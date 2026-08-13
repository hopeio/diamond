export function compareVersion(v1: string, v2: string) {
    const v1s = v1.split('.')
    const v2s = v2.split('.')
    // 按分段数对齐比较；曾用字符串长度做 while 填充条件导致不等长版本串死循环
    const len = Math.max(v1s.length, v2s.length)
    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1s[i] ?? '0', 10) || 0
        const num2 = parseInt(v2s[i] ?? '0', 10) || 0
        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }
    return 0
}
