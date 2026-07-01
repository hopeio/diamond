import {webcrypto} from "crypto";

export let compatiblecrypto;
// 在node中
if (typeof crypto === 'undefined') {
    compatiblecrypto = webcrypto;
}else {
    compatiblecrypto = crypto;
}

const subtle = compatiblecrypto.subtle;


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
    return btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedBuffer)));
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


