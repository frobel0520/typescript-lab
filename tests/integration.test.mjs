/* eslint-disable typescript/no-deprecated -- The fake document implements the standard browser createElement API, not Workers HTMLRewriter. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import * as engine from '../lib/compiler.mjs';
import { lessons, modules } from '../curriculum/lessons.mjs';
const importTs = async (path) => {
  const source = ts.transpileModule(
    readFileSync(path, 'utf8').replace(
      "import { assetUrl } from './asset-url';",
      "const assetUrl = path => 'https://example.test/typescript-lab/' + path;",
    ),
    {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  return import(
    'data:text/javascript;base64,' + Buffer.from(source).toString('base64')
  );
};
const { parseProgress } = await importTs('lib/storage.ts');
test('storage restores known drafts, removes unknown ids and duplicate completions', () => {
  const value = parseProgress(
    JSON.stringify({
      drafts: { '01-01': 'const x=1;', evil: 'x' },
      completed: ['01-01', '01-01', 'evil'],
      selected: '01-01',
      language: 'Python',
    }),
    ['01-01'],
  );
  assert.deepEqual(value, {
    drafts: { '01-01': 'const x=1;' },
    completed: ['01-01'],
    selected: '01-01',
    language: 'Python',
  });
});
test('storage handles corrupt and hostile shapes', () => {
  for (const value of [
    '{',
    'null',
    '[]',
    '42',
    '{"completed":"all","drafts":true,"selected":false}',
  ]) {
    const state = parseProgress(value, ['01-01']);
    assert.equal(state.selected, '01-01');
    assert.deepEqual(state.completed, []);
  }
});
test('compiler worker loads real standard-library dependency graph and checks a module lesson', async () => {
  let resolve;
  const output = new Promise((r) => {
    resolve = r;
  });
  const workerSource = readFileSync(
    'public/compiler-worker.js',
    'utf8',
  ).replace("await import(asset('engine/compiler.mjs'))", 'providedEngine');
  const context = vm.createContext({
    importScripts: () => {},
    ts,
    URL,
    providedEngine: engine,
    fetch: async (url) => ({
      ok: true,
      text: async () =>
        readFileSync(
          'public/' + new URL(url).pathname.replace('/typescript-lab/', ''),
          'utf8',
        ),
    }),
    self: {
      postMessage: resolve,
      location: {
        href: 'https://example.test/typescript-lab/compiler-worker.js',
      },
    },
  });
  vm.runInContext(workerSource, context);
  const lesson = lessons.find((l) => l.id === '09-04');
  await context.self.onmessage({
    data: { id: 1, code: lesson.solution, modules, lesson },
  });
  const result = await output;
  assert.equal(result.error, undefined);
  assert.equal(result.diagnostics.length, 0);
  assert.ok(result.rows.every((r) => r.pass));
});
test('runtime host isolates the frame, validates message source and cleans up on completion', async () => {
  const old = {
    window: globalThis.window,
    document: globalThis.document,
    fetch: globalThis.fetch,
  };
  const listeners = new Set();
  let frame;
  try {
    globalThis.fetch = async () => ({
      ok: true,
      text: async () => readFileSync('public/runtime-worker.js', 'utf8'),
    });
    globalThis.window = {
      addEventListener: (n, fn) => listeners.add(fn),
      removeEventListener: (n, fn) => listeners.delete(fn),
    };
    globalThis.document = {
      createElement: () =>
        (frame = {
          style: {},
          attributes: {},
          setAttribute(k, v) {
            this.attributes[k] = v;
          },
          contentWindow: { postMessage() {} },
          remove() {
            this.removed = true;
          },
        }),
      body: { appendChild() {} },
    };
    const { runCode } = await importTs('lib/run-code.ts');
    const promise = runCode('return [];', {}, new AbortController().signal);
    await new Promise((r) => setImmediate(r));
    assert.equal(frame.attributes.sandbox, 'allow-scripts');
    assert.match(frame.srcdoc, /connect-src 'none'/);
    assert.match(frame.srcdoc, /worker-src blob:/);
    const nonce = JSON.parse(frame.srcdoc.match(/const nonce=("[^"]+")/)[1]);
    for (const fn of listeners)
      fn({
        source: {},
        data: { nonce, result: { rows: [], logs: ['spoof'] } },
      });
    assert.ok(!frame.removed);
    for (const fn of listeners)
      fn({
        source: frame.contentWindow,
        data: { nonce, result: { rows: [], logs: ['ok'] } },
      });
    assert.deepEqual(await promise, { rows: [], logs: ['ok'] });
    assert.ok(frame.removed);
    assert.equal(listeners.size, 0);
  } finally {
    Object.assign(globalThis, old);
  }
});
test('runtime timeout terminates the frame and detaches listeners', async () => {
  const old = {
    window: globalThis.window,
    document: globalThis.document,
    fetch: globalThis.fetch,
  };
  const listeners = new Set();
  let frame;
  let stopped = false;
  try {
    globalThis.fetch = async () => ({
      ok: true,
      text: async () => readFileSync('public/runtime-worker.js', 'utf8'),
    });
    globalThis.window = {
      addEventListener: (n, fn) => listeners.add(fn),
      removeEventListener: (n, fn) => listeners.delete(fn),
    };
    globalThis.document = {
      createElement: () =>
        (frame = {
          style: {},
          setAttribute() {},
          contentWindow: {
            postMessage(value) {
              if (value.stop) stopped = true;
            },
          },
          remove() {
            this.removed = true;
          },
        }),
      body: { appendChild() {} },
    };
    const { runCode } = await importTs('lib/run-code.ts');
    const result = await runCode(
      'while(true){}',
      {},
      new AbortController().signal,
    );
    assert.match(result.error, /3 秒/);
    assert.ok(frame.removed);
    assert.ok(stopped);
    assert.equal(listeners.size, 0);
  } finally {
    Object.assign(globalThis, old);
  }
});
