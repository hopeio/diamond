import type { Directive } from 'vue'

type CopyEl = HTMLElement
type OptimizeOptions = Record<string, unknown>
type RippleOptions = Record<string, unknown>

declare module 'vue' {
  export interface ComponentCustomProperties {
    vLoading: Directive<Element, boolean>
    vCopy: Directive<CopyEl, string>
    vLongpress: Directive<HTMLElement, Function>
    vOptimize: Directive<HTMLElement, OptimizeOptions>
    vRipple: Directive<HTMLElement, RippleOptions>
  }
}
