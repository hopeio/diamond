
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
    // 填充值必须在 [1,16] 且不超过数据长度；曾不校验，padlen 为 0 时 slice(0,-0) 把整段数据清空
    if (!(padlen >= 1 && padlen <= 16) || padlen > data.length) {
        throw new Error('pkcs7: invalid padding');
    }
    return data.slice(0, -padlen);
}
