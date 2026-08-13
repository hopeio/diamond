export function dynamicLoadJs(url: string, callback?: Function, onError?: (e: Event | string) => void) {
  const head = document.getElementsByTagName("head")[0];
  const script: HTMLScriptElement = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  if (callback && typeof callback == "function") {
    // onload 触发即脚本加载执行完成；曾误判 document.readyState（与脚本加载无关），
    // 文档还在 loading 时回调被静默吞掉
    script.onload = function () {
      script.onload = null;
      callback();
    };
  }
  script.onerror = function (e) {
    script.onerror = null;
    onError?.(e);
  };
  head.appendChild(script);
}

export function startWorker(url: string): Worker {
  if (typeof Worker !== "undefined") {
    return new Worker(url);
  } else {
    throw new Error("抱歉，你的浏览器不支持 Web Workers...");
  }
}
