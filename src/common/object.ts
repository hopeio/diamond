export function copypropertyIfNotExist(dst: Record<string, any>, src: Record<string, any>) {
    for (const [key, value] of Object.entries(src)) {
        // 不直接调 dst.hasOwnProperty：Object.create(null) 创建的对象没有该方法
        if (!Object.prototype.hasOwnProperty.call(dst, key)) {
            dst[key] = value;
        }
    }
}
