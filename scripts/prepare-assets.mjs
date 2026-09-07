import { cp, mkdir, readdir, copyFile } from 'node:fs/promises';
await mkdir('public/vendor/typescript', { recursive: true });
await cp('node_modules/monaco-editor/min/vs', 'public/vendor/monaco/vs', {
  recursive: true,
});
await copyFile(
  'node_modules/typescript/lib/typescript.js',
  'public/vendor/typescript/typescript.js',
);
for (const f of await readdir('node_modules/typescript/lib'))
  if (/^lib.*\.d\.ts$/.test(f))
    await copyFile(
      `node_modules/typescript/lib/${f}`,
      `public/vendor/typescript/${f}`,
    );

await mkdir('public/engine', { recursive: true });
await copyFile('lib/compiler.mjs', 'public/engine/compiler.mjs');
