import type { Plugin } from "vue";
import reNormalCountTo from "./src/normal";
import reboundCountTo from "./src/rebound";
import { withInstall } from "@pureadmin/utils";

/** 普通数字动画组件 */
const ReNormalCountTo = withInstall(reNormalCountTo) as Plugin;

/** 回弹式数字动画组件 */
const ReboundCountTo = withInstall(reboundCountTo) as Plugin;

export { ReNormalCountTo, ReboundCountTo };
