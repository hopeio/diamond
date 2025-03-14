
export function compareVersion(v1:string, v2:string) {
    const v1s = v1.split('.')
    const v2s = v2.split('.')
    const len = Math.max(v1.length, v2.length)
    while (v1s.length < len) {
        v1s.push('0')
    }
    while (v2.length < len) {
        v2s.push('0')
    }
    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1s[i], 10)
        const num2 = parseInt(v2s[i], 10)

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }
    return 0
}