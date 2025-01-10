export function arrayToMapArrValue<T, K>(arr: any[], getKey: (T) => K): Map<K, T[]> {
    return arr.reduce((accumulator, currentValue) => {
        // 获取当前元素的 key 和 value
        const key = getKey(currentValue)
        // 如果 accumulator 中已经有这个 key，则在其对应的数组中添加 value
        if (accumulator.has(key)) {
            accumulator.get(key).push(currentValue);
        } else {
            // 否则，在 accumulator 中创建新的 key-value 对
            accumulator.set(key, [currentValue]);
        }

        return accumulator;
    }, new Map())
}

export function arrayToMap<T, K>(arr: any[], getKey: (T) => K): Map<K, T> {
    return arr.reduce((accumulator, currentValue) => {
        // 获取当前元素的 key 和 value
        const key = getKey(currentValue)
        // 如果 accumulator 中已经有这个 key，则在其对应的数组中添加 value
        if (accumulator.has(key)) {
            accumulator.get(key).push(currentValue);
        } else {
            // 否则，在 accumulator 中创建新的 key-value 对
            accumulator.set(key, [currentValue]);
        }

        return accumulator;
    }, new Map())
}