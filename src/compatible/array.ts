export function arr2map(arr: any[]): Map<any, any> {
    return arr.reduce((accumulator, currentValue) => {
        // 获取当前元素的 key 和 value

        // 如果 accumulator 中已经有这个 key，则在其对应的数组中添加 value
        if (accumulator.has(currentValue.key)) {
            accumulator.get(currentValue.key).push(currentValue);
        } else {
            // 否则，在 accumulator 中创建新的 key-value 对
            accumulator.set(currentValue.key, [currentValue]);
        }

        return accumulator;
    }, new Map())
}