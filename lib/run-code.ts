import { assetUrl } from './asset-url';
export type ResultRow = {
  name: string;
  pass: boolean;
  detail?: string;
  actual?: string;
  expected?: string;
};
export type RuntimeResult = {
  rows: ResultRow[];
  logs: string[];
  error?: string;
};
let runtimeSource: Promise<string> | undefined;
export async function runCode(
  code: string,
  modules: Record<string, string>,
  signal: AbortSignal,
): Promise<RuntimeResult> {
  runtimeSource ??= fetch(assetUrl('runtime-worker.js'), {
    signal: AbortSignal.timeout(10000),
  })
    .then((r) => {
      if (!r.ok) throw new Error('無法載入執行環境');
      return r.text();
    })
    .catch((error) => {
      runtimeSource = undefined;
      throw error;
    });
  const source = await runtimeSource;
  if (signal.aborted) throw new Error('已取消');
  return new Promise((resolve) => {
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.style.display = 'none';
    frame.title = '程式執行隔離環境';
    const nonce = crypto.randomUUID();
    let finished = false;
    const finish = (result: RuntimeResult) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      window.removeEventListener('message', receive);
      signal.removeEventListener('abort', cancel);
      frame.contentWindow?.postMessage({ stop: true }, '*');
      frame.remove();
      resolve(result);
    };
    const cancel = () => finish({ rows: [], logs: [], error: '已取消執行' });
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.contentWindow || event.data?.nonce !== nonce)
        return;
      if (event.data.ready) {
        frame.contentWindow?.postMessage({ code, modules }, '*');
        return;
      }
      finish(event.data.result);
    };
    window.addEventListener('message', receive);
    signal.addEventListener('abort', cancel, { once: true });
    const script = `const nonce=${JSON.stringify(nonce)};const worker=new Worker(URL.createObjectURL(new Blob([${JSON.stringify(source)}],{type:'text/javascript'})));worker.onmessage=e=>parent.postMessage({nonce,result:e.data},'*');worker.onerror=e=>parent.postMessage({nonce,result:{rows:[],logs:[],error:e.message||'執行失敗'}},'*');onmessage=e=>{if(e.source!==parent)return;if(e.data.stop){worker.terminate();return;}worker.postMessage(e.data);};parent.postMessage({nonce,ready:true},'*');`;
    frame.srcdoc = `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; worker-src blob:; connect-src 'none'"><script>${script.replace(/<\/script/gi, '<\\/script')}</script>`;
    const timer = setTimeout(
      () =>
        finish({
          rows: [],
          logs: [],
          error: '執行超過 3 秒，已停止。請檢查無窮迴圈或未完成的 Promise。',
        }),
      3000,
    );
    document.body.appendChild(frame);
  });
}
