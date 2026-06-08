
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
