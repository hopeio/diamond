export function arrayToMapArrValue<T, K>(arr: T[], getKey: (v: T) => K): Map<K, T[]> {
    const result = new Map<K, T[]>()
    for (const item of arr) {
        const key = getKey(item)
        const group = result.get(key)
        if (group) {
            group.push(item)
        } else {
            result.set(key, [item])
        }
    }
    return result
}

export function arrayToMap<T, K>(arr: T[], getKey: (v: T) => K): Map<K, T> {
    // 曾是 arrayToMapArrValue 的复制粘贴，值被包成数组；重复 key 以后者覆盖
    const result = new Map<K, T>()
    for (const item of arr) {
        result.set(getKey(item), item)
    }
    return result
}
