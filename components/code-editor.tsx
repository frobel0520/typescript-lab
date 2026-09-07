'use client';
import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '@/lib/asset-url';
import type * as Monaco from 'monaco-editor';
type EditorWindow = Window & {
  monaco?: typeof Monaco;
  require?: {
    (deps: string[], callback: () => void, error: (e: Error) => void): void;
    config: (config: unknown) => void;
  };
};
let ready: Promise<typeof Monaco> | undefined;
function loadMonaco() {
  return (ready ??= new Promise<typeof Monaco>((resolve, reject) => {
    const w = window as unknown as EditorWindow;
    const boot = () => {
      // Monaco workers may execute from blob: URLs, so AMD paths must be absolute.
      const vs = assetUrl('vendor/monaco/vs');
      w.require!.config({ paths: { vs } });
      w.require!(['vs/editor/editor.main'], () => resolve(w.monaco!), reject);
    };
    if (w.monaco) return resolve(w.monaco);
    if (w.require) return boot();
    const s = document.createElement('script');
    s.src = assetUrl('vendor/monaco/vs/loader.js');
    s.onload = boot;
    s.onerror = () => {
      ready = undefined;
      reject(new Error('編輯器載入失敗，仍可使用文字編輯模式。'));
    };
    document.head.appendChild(s);
  }));
}
export default function CodeEditor({
  value,
  onChange,
  onRun,
  lessonId,
  modules,
}: {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  lessonId: string;
  modules: Record<string, string>;
}) {
  const host = useRef<HTMLDivElement>(null);
  const editor = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const change = useRef(onChange);
  const run = useRef(onRun);
  const current = useRef(value);
  const [status, setStatus] = useState('loading');
  useEffect(() => {
    change.current = onChange;
    run.current = onRun;
    current.current = value;
  }, [onChange, onRun, value]);
  useEffect(() => {
    let canceled = false;
    let cleanup = () => {};
    loadMonaco()
      .then((monaco) => {
        if (canceled || !host.current) return;
        monaco.editor.defineTheme('tslab', {
          base: 'vs-dark',
          inherit: true,
          rules: [],
          colors: {
            'editor.background': '#10151e',
            'editorLineNumber.foreground': '#53647b',
            'editorLineNumber.activeForeground': '#acc5e6',
            'editor.lineHighlightBackground': '#18212e',
            'editor.selectionBackground': '#264974',
          },
        });
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          strict: true,
          target: monaco.languages.typescript.ScriptTarget.ESNext,
          module: monaco.languages.typescript.ModuleKind.CommonJS,
          moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs,
          allowNonTsExtensions: true,
        });
        const extras = Object.entries(modules).map(([path, code]) =>
          monaco.languages.typescript.typescriptDefaults.addExtraLib(
            code,
            'file://' + path,
          ),
        );
        const model = monaco.editor.createModel(
          current.current,
          'typescript',
          monaco.Uri.parse('file:///exercise.ts'),
        );
        const instance = monaco.editor.create(host.current, {
          model,
          theme: 'tslab',
          fontSize: 15,
          lineHeight: 26,
          fontFamily: '"Geist Mono", "SFMono-Regular", Consolas, monospace',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 20, bottom: 20 },
          tabSize: 2,
          wordWrap: 'on',
          fixedOverflowWidgets: true,
          accessibilitySupport: 'on',
        });
        editor.current = instance;
        const sub = instance.onDidChangeModelContent(() =>
          change.current(instance.getValue()),
        );
        instance.addAction({
          id: 'run-code',
          label: '執行與檢查',
          keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
          run: () => run.current(),
        });
        setStatus('ready');
        cleanup = () => {
          sub.dispose();
          instance.dispose();
          model.dispose();
          extras.forEach((e) => e.dispose());
          editor.current = null;
        };
      })
      .catch(() => {
        if (!canceled) setStatus('fallback');
      });
    return () => {
      canceled = true;
      cleanup();
    };
  }, [modules]);
  useEffect(() => {
    if (editor.current && editor.current.getValue() !== value) {
      editor.current.setValue(value);
    }
  }, [value, lessonId]);
  return (
    <div className="code-editor">
      <div
        ref={host}
        className="monaco-host"
        style={{ display: status === 'fallback' ? 'none' : 'block' }}
      />
      {status !== 'ready' && (
        <div
          className={
            status === 'loading' ? 'editor-loading' : 'editor-fallback'
          }
        >
          {status === 'loading' ? (
            <span>正在載入 TypeScript 編輯器…</span>
          ) : (
            <>
              <p>編輯器載入失敗，可繼續使用文字模式。</p>
              <textarea
                aria-label="TypeScript 程式碼"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                spellCheck={false}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
