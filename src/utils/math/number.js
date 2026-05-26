const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const charaCode = 'a'.charCodeAt(0)
const charzeroCode = '0'.charCodeAt(0)
const charACode = 'A'.charCodeAt(0)
const charZCode = 'Z'.charCodeAt(0)

// 10进制与2-62进制转换
export function formatInt(num,base) {
    let result = ''
    do {
        let remainder = num % base
        result += chars.charAt(remainder)
        num = Math.floor(num / base)
    } while (num > 0)
    return result.split('').reverse().join('')
}
export  function parseInt(str,base) {
    let result = 0
    for (let i = 0, len = str.length; i < len; i++) {
        let index = findIndex(str.charAt(i).charCodeAt(0)) //chars.indexOf(str[i])
        let power = len - i - 1
        result += index * Math.pow(base, power)
    }
    return result
}

function findIndex(b) {
    if (b < charACode) {
        return b - charzeroCode
    } else if (b > charZCode) {
        return 10 + b-charaCode
    }
    return 36 + b-charACode
}
