export const getGlobal = (): any => {
    // globalThis 全环境可用（浏览器/Node/Worker）；直接引用 global 在 Worker 中会 ReferenceError
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof window !== "undefined" ? window : global;
};
