const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const charaCode = 'a'.charCodeAt(0)
const charzeroCode = '0'.charCodeAt(0)
const charACode = 'A'.charCodeAt(0)
const charZCode = 'Z'.charCodeAt(0)

// 10进制与2-62进制转换
export function formatInt(num, base) {
    if (!Number.isInteger(base) || base < 2 || base > 62) {
        throw new RangeError(`base must be an integer in [2, 62], got ${base}`)
    }
    if (!Number.isFinite(num)) {
        throw new RangeError(`num must be a finite number, got ${num}`)
    }
    num = Math.trunc(num)
    const negative = num < 0
    if (negative) num = -num
    let result = ''
    do {
        result += chars.charAt(num % base)
        num = Math.floor(num / base)
    } while (num > 0)
    result = result.split('').reverse().join('')
    return negative ? '-' + result : result
}

export function parseInt(str, base) {
    if (!Number.isInteger(base) || base < 2 || base > 62) {
        throw new RangeError(`base must be an integer in [2, 62], got ${base}`)
    }
    let negative = false
    if (str.charAt(0) === '-') {
        negative = true
        str = str.slice(1)
    }
    let result = 0
    for (let i = 0, len = str.length; i < len; i++) {
        const index = findIndex(str.charCodeAt(i))
        if (index < 0 || index >= base) {
            throw new RangeError(`invalid character '${str.charAt(i)}' for base ${base}`)
        }
        result = result * base + index
    }
    return negative ? -result : result
}

function findIndex(b) {
    if (b >= charzeroCode && b < charzeroCode + 10) {
        return b - charzeroCode
    }
    if (b >= charaCode && b < charaCode + 26) {
        return 10 + b - charaCode
    }
    if (b >= charACode && b <= charZCode) {
        return 36 + b - charACode
    }
    return -1
}
