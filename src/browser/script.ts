export function dynamicLoadJs(url:string, callback: Function | undefined) {
  const head = document.getElementsByTagName("head")[0];
  const script: HTMLScriptElement = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  if (callback && typeof callback == "function") {
    script.onload = function () {
      if (!document.readyState || document.readyState === "complete") {
        callback();
        script.onload = null;
      }
    };
  }
  head.appendChild(script);
}

export function startWorker(url: string): Worker {
  if (typeof Worker !== "undefined") {
    return new Worker(url);
  } else {
    throw new Error("抱歉，你的浏览器不支持 Web Workers...");
  }
}
