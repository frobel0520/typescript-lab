/* eslint-disable typescript/no-implied-eval -- This isolated worker intentionally executes learner code; never import it into the UI. */
// A fresh, disposable worker is created per run; infinite loops are terminated by the parent.
self.onmessage = async ({ data }) => {
  const logs = [];
  const display = (v) => {
    if (v === undefined) return 'undefined';
    try {
      return typeof v === 'string' ? v : JSON.stringify(v);
    } catch {
      return String(v);
    }
  };
  const equal = (a, b) => {
    if (Object.is(a, b)) return true;
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object')
      return false;
    const ak = Object.keys(a),
      bk = Object.keys(b);
    return (
      ak.length === bk.length &&
      ak.every((k) => Object.hasOwn(b, k) && equal(a[k], b[k]))
    );
  };
  const localConsole = {
    log: (...args) => {
      if (logs.length < 100)
        logs.push(args.map(display).join(' ').slice(0, 4000));
    },
    warn: (...args) => {
      if (logs.length < 100)
        logs.push(args.map(display).join(' ').slice(0, 4000));
    },
    error: (...args) => {
      if (logs.length < 100)
        logs.push(args.map(display).join(' ').slice(0, 4000));
    },
  };
  const cache = {};
  const require = (id) => {
    const path = '/' + id.replace(/^\.\//, '') + '.ts';
    if (!Object.hasOwn(data.modules, path))
      throw new Error('此練習沒有提供模組 ' + id);
    if (cache[path]) return cache[path];
    const exports = {};
    cache[path] = exports;
    new Function('exports', 'require', 'console', data.modules[path])(
      exports,
      require,
      localConsole,
    );
    return exports;
  };
  try {
    const result = await new Function(
      'exports',
      'require',
      'console',
      '__equal',
      '__display',
      data.code,
    )({}, require, localConsole, equal, display);
    self.postMessage({ rows: result || [], logs });
  } catch (error) {
    self.postMessage({ error: String(error), logs });
  }
};
