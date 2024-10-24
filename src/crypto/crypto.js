import crypto from 'crypto';
/**
 * 解密
 * @param dataStr {string}
 * @param key {string}
 * @param iv {string}
 * @return {string}
 */
export function AES128CBCDecrypt(dataStr, key, iv) {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(dataStr, 'base64', 'utf8');
    return decrypted + decipher.final('utf8');
}
/**
 * 加密

 * @param dataStr {string}
 * @param key {string}
 * @param iv {string}
 * @return {string}
 */
export function AES128CBCEncrypt(dataStr, key, iv) {
    const cipher = crypto.createCipheriv('aes-128-cbc', key,  iv);
    let encrypted = cipher.update(dataStr, 'utf8', 'base64');
    return encrypted + cipher.final('base64');
}


export function AES256CBCDecrypt(dataStr, key, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(dataStr, 'base64', 'utf8');
    return decrypted + decipher.final('utf8');
}
/**
 * 加密

 * @param dataStr {string}
 * @param key {string}
 * @param iv {string}
 * @return {string}
 */
export function AES256CBCEncrypt(dataStr, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key,  iv);
    let encrypted = cipher.update(dataStr, 'utf8', 'base64');
    return encrypted + cipher.final('base64');
}

// Pkcs7 填充函数
export function pkcs7Pad(data) {
    const blocksize = 16;
    const padlen = blocksize - (data.length % blocksize);
    const padding = String.fromCharCode(padlen).repeat(padlen);
    return data + padding;
}

// Pkcs7 解填充函数
export function pkcs7Unpad(data) {
    const padlen = data.charCodeAt(data.length - 1);
    return data.slice(0, -padlen);
}
