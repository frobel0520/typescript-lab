import { test } from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import { chapters, lessons, modules } from '../curriculum/lessons.mjs';
import { compile, checkLesson } from '../lib/compiler.mjs';
const libraries = Object.fromEntries(
  readdirSync('node_modules/typescript/lib')
    .filter((n) => /^lib.*\.d\.ts$/.test(n))
    .map((n) => [
      '/' + n,
      readFileSync('node_modules/typescript/lib/' + n, 'utf8'),
    ]),
);
const runtime = readFileSync('public/runtime-worker.js', 'utf8');
async function execute(result) {
  return new Promise((resolve, reject) => {
    const context = vm.createContext({ self: { postMessage: resolve } });
    vm.runInContext(runtime, context, { timeout: 3000 });
    context.payload = {
      code: result.runnable,
      modules: result.compiledModules,
    };
    try {
      vm.runInContext('self.onmessage({data:payload})', context, {
        timeout: 3000,
      }).catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}
test('course has ten chapters with four unique exercises each', () => {
  assert.equal(chapters.length, 10);
  assert.equal(lessons.length, 40);
  assert.equal(new Set(lessons.map((l) => l.id)).size, 40);
  for (const chapter of chapters) assert.equal(chapter.lessons.length, 4);
});
for (const lesson of lessons) {
  test(`${lesson.id} solution satisfies type and runtime contracts`, async () => {
    const checked = checkLesson(
      ts,
      lesson.solution,
      libraries,
      modules,
      lesson,
    );
    assert.deepEqual(
      checked.diagnostics,
      [],
      JSON.stringify(checked.diagnostics),
    );
    assert.ok(
      checked.rows.every((r) => r.pass),
      JSON.stringify(checked.rows),
    );
    const result = await execute(checked);
    assert.equal(result.error, undefined);
    assert.equal(result.rows.length, lesson.tests.length);
    assert.ok(
      result.rows.every((r) => r.pass),
      JSON.stringify(result.rows),
    );
  });
  test(`${lesson.id} starter does not pass`, async () => {
    const checked = checkLesson(ts, lesson.starter, libraries, modules, lesson);
    if (checked.diagnostics.length || checked.rows.some((r) => !r.pass)) return;
    const result = await execute(checked);
    assert.ok(
      result.error || result.rows.some((r) => !r.pass),
      'Starter unexpectedly passes',
    );
  });
}
test('reject compiler bypass directives and explicit any', () => {
  for (const bypass of ['// @ts-nocheck\n', 'const escape: any = 1;\n']) {
    const result = checkLesson(
      ts,
      bypass + lessons[0].solution,
      libraries,
      modules,
      lessons[0],
    );
    assert.equal(result.rows[0].pass, false);
  }
});
test('type errors provide source locations', () => {
  const result = compile(ts, 'const value: number = "wrong";', libraries);
  assert.equal(result.diagnostics[0].code, 2322);
  assert.equal(result.diagnostics[0].line, 1);
});
test('playground produces runnable output', async () => {
  const result = checkLesson(
    ts,
    'console.log("hello");',
    libraries,
    modules,
    null,
  );
  const output = await execute(result);
  assert.equal(output.logs[0], 'hello');
});
