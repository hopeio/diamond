export function copypropertyIfNotExist(dst: Record<string, any>, src: Record<string, any>) {
    for (const [key, value] of Object.entries(src)) {
        if (!dst.hasOwnProperty(key)) {
            dst[key] = value;
        }
    }
}