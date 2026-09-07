const asset = (path) => new URL(path, self.location.href).href;
importScripts(asset('vendor/typescript/typescript.js'));
let engine, libraries;
const ready = (async () => {
  engine = await import(asset('engine/compiler.mjs'));
  libraries = {};
  const load = async (name) => {
    if (name in libraries) return;
    libraries[name] = '';
    const response = await fetch(asset('vendor/typescript' + name));
    if (!response.ok) throw new Error('無法載入型別標準庫 ' + name);
    const text = await response.text();
    libraries[name] = text;
    const refs = [...text.matchAll(/<reference lib="([^"]+)"/g)].map(
      (m) => '/lib.' + m[1] + '.d.ts',
    );
    await Promise.all(refs.map(load));
  };
  await Promise.all([load('/lib.es2022.d.ts'), load('/lib.dom.d.ts')]);
})();
self.onmessage = async ({ data }) => {
  try {
    await ready;
    const result = engine.checkLesson(
      ts,
      data.code,
      libraries,
      data.modules,
      data.lesson,
    );
    self.postMessage({ id: data.id, ...result });
  } catch (e) {
    self.postMessage({ id: data.id, error: String(e) });
  }
};
