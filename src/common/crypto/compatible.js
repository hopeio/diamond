// 全局 crypto 在现代浏览器 / Worker / Node 19+ 均可用；
// 曾顶层 import {webcrypto} from "crypto"，浏览器打包直接拖入 Node 内置模块而失败
export const compatiblecrypto = globalThis.crypto;

const subtle = compatiblecrypto.subtle;

// Uint8Array 转 base64；曾用 String.fromCharCode.apply 一次展开全部字节，大密文栈溢出
function bytesToBase64(bytes) {
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
}

// 加密数据
export async function encrypt(data, key, iv) {
    const dataBuffer = new TextEncoder().encode(data);
    const keyBuffer = new TextEncoder().encode(key);
    const ivBuffer = new TextEncoder().encode(iv);

    const cryptoKey = await subtle.importKey(
        'raw',
        keyBuffer,
        {name: 'AES-CBC'},
        false,
        ['encrypt']
    );

    const encryptedBuffer = await subtle.encrypt(
        {name: 'AES-CBC', iv: ivBuffer},
        cryptoKey,
        dataBuffer
    );
    return bytesToBase64(new Uint8Array(encryptedBuffer));
}

// 解密数据
export async function decrypt(encryptedBase64, key, iv) {
    const encryptedBuffer = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    const keyBuffer = new TextEncoder().encode(key);
    const ivBuffer = new TextEncoder().encode(iv);

    const cryptoKey = await subtle.importKey(
        'raw',
        keyBuffer,
        {name: 'AES-CBC'},
        false,
        ['decrypt']
    );

    const decryptedBuffer = await subtle.decrypt(
        {name: 'AES-CBC', iv: ivBuffer},
        cryptoKey,
        encryptedBuffer
    );

    return new TextDecoder().decode(decryptedBuffer);
}
