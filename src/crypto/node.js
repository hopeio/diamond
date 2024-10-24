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
