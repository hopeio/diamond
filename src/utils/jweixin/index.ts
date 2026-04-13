import { dynamicLoadJs } from "@/utils/browser";

let active = false;


function loadwxSDK(version:string =" 1.3.2") {
  dynamicLoadJs(`https://res.wx.qq.com/open/js/jweixin-${version}.js`, () =>
    // 或者
    window.wx.miniProgram.getEnv(function (res:any) {
      console.log(res.miniprogram); // true
    })
  );
  weBrowser();
}

function weBrowser() {
  if (!window.WeixinJSBridge || !window.WeixinJSBridge.invoke) {
    document.addEventListener("WeixinJSBridgeReady", ready, false);
  } else {
    ready();
  }
}

// web-view下的页面内
function ready() {
  window.WeixinJSBridge.on("onPageStateChange", function (res:any) {
    console.log("res is active", res.active);
    active = res.active;
  });
}

function IsWeappPlatform(): boolean {
  return window.__wxjs_environment === "miniprogram";
}

export default {
  active,
  IsWeappPlatform,
  loadwxSDK,
};
