// 获取cookie
export function getCookie(key: string, cookie: string): string {
    const prefix = key + '='
    for (const part of cookie.split(';')) {
        // 曾写成 charAt(0) === ""（空串）导致前导空格剥不掉，除第一个外的 cookie 全部取不到
        const c = part.trim()
        if (c.startsWith(prefix)) {
            const value = c.substring(prefix.length)
            // 只对值解码；整串先 decode 会把值里编码的 ; = 拆散，且非法编码会抛 URIError
            try {
                return decodeURIComponent(value)
            } catch {
                return value
            }
        }
    }
    return ''
}
