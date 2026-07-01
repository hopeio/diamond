// 由 `browser/index.ts` 在模块加载时自动 import；也可单独 effect import 本文件。
// 须在业务代码之前执行（如 uniapp `main.ts` 首行 `import '@hopeio/utils/browser'`）。

if (typeof (window as any).global === 'undefined') {
  (window as any).global = window
}

/** 低版本 WebView / 旧浏览器无 `Array.prototype.at` 时的补丁。 */
if (typeof Array.prototype.at !== 'function') {
  // eslint-disable-next-line no-extend-native
  Array.prototype.at = function (index: number) {
    const len = this.length
    const k = index >= 0 ? index : len + index
    if (k < 0 || k >= len) return undefined
    return this[k]
  }
}

export {}
