// Vue3 项目通用资源模块声明；Vue2 时代的 JSX/compatible-vue 声明已移除
// （Vue3 无默认导出，且 JSX 类型由 vue 自带）
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.scss" {
  const scss: Record<string, string>;
  export default scss;
}
