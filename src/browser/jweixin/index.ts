import { dynamicLoadJs } from '../script'

let active = false;


function loadwxSDK(version:string = "1.3.2") {
  // 版本号曾带前导空格，SDK URL 变成 "jweixin- 1.3.2.js" 直接 404
  dynamicLoadJs(`https://res.wx.qq.com/open/js/jweixin-${version}.js`, () =>
    window.wx?.miniProgram?.getEnv?.(function (res:any) {
      console.log(res.miniprogram); // true
    })
  );
  weBrowser();
}

function weBrowser() {
  if (!window.WeixinJSBridge || !window.WeixinJSBridge.invoke) {
    document.addEventListener("WeixinJSBridgeReady", ready, { once: true });
  } else {
    ready();
  }
}

// web-view下的页面内
function ready() {
  window.WeixinJSBridge.on("onPageStateChange", function (res:any) {
    active = res.active;
  });
}

function IsWeappPlatform(): boolean {
  return window.__wxjs_environment === "miniprogram";
}

export default {
  // 曾导出原始值快照，读到的永远是 false；getter 才能反映实时状态
  get active() {
    return active;
  },
  IsWeappPlatform,
  loadwxSDK,
};
