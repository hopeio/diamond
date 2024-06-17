import crypto from 'crypto';
/**
 * 解密
 * @param dataStr {string}
 * @param key {string}
 * @param iv {string}
 * @return {string}
 */
function decrypt(dataStr, key, iv) {
    let cipherChunks = [];
    let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(dataStr, 'base64', 'utf8'));
    cipherChunks.push(decipher.final('utf8'));
    return cipherChunks.join('');
}
/**
 * 加密

 * @param dataStr {string}
 * @param key {string}
 * @param iv {string}
 * @return {string}
 */
function encrypt(dataStr, key, iv) {
    let cipherChunks = [];
    let cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(dataStr, 'utf8', 'base64'));
    cipherChunks.push(cipher.final('base64'));
    return cipherChunks.join('');
}
