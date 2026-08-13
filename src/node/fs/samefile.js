import crypto from 'crypto';
import fs from 'fs';

/**
 * 计算文件 SHA-256。
 * 流式读取避免大文件整载内存；错误交由调用方处理（曾算完只 console.log、吞错返回 undefined）。
 * @param filePath {string}
 * @return {Promise<string>} hex 哈希值
 */
export function calculateFileHash(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        stream.on('error', reject);
        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
    });
}
