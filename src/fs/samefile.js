import crypto from 'crypto';
import fs from 'fs';

async function calculateFileHash(filePath) {
    try {
        // 读取文件内容
        const fileContent = await fs.promises.readFile(filePath);

        // 创建一个SHA-256哈希对象
        const hash = crypto.createHash('sha256');

        // 更新哈希对象的内容
        hash.update(fileContent);

        // 计算哈希值
        const hashValue = hash.digest('hex');

        console.log(`File ${filePath} hash: ${hashValue}`);
    } catch (error) {
        console.error('Error calculating file hash:', error);
    }
}


