// 入口 import `@hopeio/utils/browser` 时自动执行 polyfill（须在业务代码之前，如 uniapp `main.ts` 首行）。
import './globalPolyfills'

export * from './device'
export * from './dom'
export * from './download'
export * from './net'
export * from './print'
export * from './script'
export * from './localforage'
export { default as jweixin } from './jweixin'
