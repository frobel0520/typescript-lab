export const options = (ts) => ({
  strict: true,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.CommonJS,
  moduleResolution: ts.ModuleResolutionKind.Node10,
  skipLibCheck: true,
  noEmitOnError: true,
  lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'],
});
export const typePrelude =
  'type Equal<A,B> = (<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2) ? true : false; type Expect<T extends true> = T;';
export function compile(ts, code, libraries, modules = {}, extra = '') {
  const files = {
    ...libraries,
    ...modules,
    '/exercise.ts': code + '\n' + extra,
  };
  const output = {};
  const host = {
    getSourceFile: (name, languageVersion) =>
      files[name] !== undefined
        ? ts.createSourceFile(name, files[name], languageVersion, true)
        : undefined,
    getDefaultLibFileName: () => '/lib.es2022.d.ts',
    writeFile: (name, text) => {
      output[name] = text;
    },
    getCurrentDirectory: () => '/',
    getDirectories: () => [],
    fileExists: (name) => files[name] !== undefined,
    readFile: (name) => files[name],
    getCanonicalFileName: (name) => name,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => '\n',
  };
  const program = ts.createProgram(['/exercise.ts'], options(ts), host);
  const diagnostics = ts.getPreEmitDiagnostics(program).map((d) => {
    const p =
      d.file && d.start !== undefined
        ? d.file.getLineAndCharacterOfPosition(d.start)
        : null;
    return {
      code: d.code,
      message: ts.flattenDiagnosticMessageText(d.messageText, '\n'),
      line: p ? p.line + 1 : 0,
      column: p ? p.character + 1 : 0,
      file: d.file?.fileName || '',
      start: d.start || 0,
      length: d.length || 1,
    };
  });
  if (!diagnostics.length) program.emit();
  return { diagnostics, output };
}
export function checkLesson(ts, code, libraries, modules, lesson) {
  const base = compile(ts, code, libraries, modules);
  const rows = [];
  lesson ??= { tests: [], types: '', negative: [] };
  // A learner can experiment with any in the playground, but it cannot satisfy type contracts.
  const sf = ts.createSourceFile(
    '/exercise.ts',
    code,
    ts.ScriptTarget.Latest,
    true,
  );
  let hasAny = false;
  const walk = (n) => {
    if (n.kind === ts.SyntaxKind.AnyKeyword) hasAny = true;
    ts.forEachChild(n, walk);
  };
  walk(sf);
  const bypass = hasAny || /@ts-(?:ignore|nocheck|expect-error)/.test(code);
  rows.push({
    name: '嚴格型別檢查',
    pass: !base.diagnostics.length && !bypass,
    detail: bypass
      ? '練習請不要使用 any 或 @ts-* 略過型別檢查。'
      : base.diagnostics.length
        ? `${base.diagnostics.length} 個型別錯誤`
        : '程式通過 TypeScript 5.9 strict 檢查',
  });
  if (lesson.types) {
    const checked = compile(
      ts,
      code,
      libraries,
      modules,
      typePrelude + '\n' + lesson.types,
    );
    rows.push({
      name: '型別契約與推導',
      pass: checked.diagnostics.length === 0,
      detail:
        checked.diagnostics.map((d) => d.message).join('\n') ||
        '推導型別符合題目要求',
    });
  }
  for (const negative of lesson.negative || []) {
    const checked = compile(ts, code, libraries, modules, negative);
    const offset = code.length + 1;
    rows.push({
      name: '拒絕非法用法',
      pass:
        base.diagnostics.length === 0 &&
        checked.diagnostics.some(
          (d) => d.file === '/exercise.ts' && d.start >= offset,
        ),
      detail: negative,
    });
  }
  const runtime = lesson.tests
    .map(
      (t) =>
        `try { const actual = await (${t.expression}); __results.push({name:${JSON.stringify(t.name)},pass:__equal(actual, ${t.expected === undefined ? 'undefined' : JSON.stringify(t.expected)}),actual:__display(actual),expected:__display(${t.expected === undefined ? 'undefined' : JSON.stringify(t.expected)})}); } catch(error) { __results.push({name:${JSON.stringify(t.name)},pass:false,detail:String(error)}); }`,
    )
    .join('\n');
  // Runtime probes share the lexical module scope but are never evaluated in the UI thread.
  const source = ts.transpileModule(code, {
    compilerOptions: options(ts),
  }).outputText;
  const runnable =
    source +
    `\nreturn (async()=>{const __results=[];${runtime}\nreturn __results;})();`;
  const compiledModules = Object.fromEntries(
    Object.entries(modules).map(([name, source]) => [
      name,
      ts.transpileModule(source, { compilerOptions: options(ts) }).outputText,
    ]),
  );
  return { ...base, rows, runnable, compiledModules };
}
