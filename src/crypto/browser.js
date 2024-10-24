
// 在浏览器中
if (typeof window.crypto === 'undefined') {

}

// 将字符串转换为 ArrayBuffer
function stringToArrayBuffer(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str).buffer;
}

// 将 ArrayBuffer 转换为字符串
function arrayBufferToString(buffer) {
    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(buffer));
}

// 加密数据
async function encrypt(data, key, iv) {
    const dataBuffer = stringToArrayBuffer(data);

    const keyBuffer = stringToArrayBuffer(key);
    const ivBuffer = stringToArrayBuffer(iv);

    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-CBC' },
        false,
        ['encrypt']
    );

    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: ivBuffer },
        cryptoKey,
        dataBuffer
    );
    return btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedBuffer)));
}

// 解密数据
async function decrypt(encryptedBase64, key, iv) {
    const encryptedBuffer = atob(encryptedBase64);
    const encryptedArrayBuffer = stringToArrayBuffer(encryptedBuffer);

    const keyBuffer = stringToArrayBuffer(key);
    const ivBuffer = stringToArrayBuffer(iv);

    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-CBC' },
        false,
        ['decrypt']
    );

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: ivBuffer },
        cryptoKey,
        encryptedArrayBuffer
    );

    return arrayBufferToString(decryptedBuffer);
}
