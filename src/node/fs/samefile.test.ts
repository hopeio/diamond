import { expect, test } from 'vitest'
import { calculateFileHash } from './samefile.js'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

test('calculateFileHash 返回 hex 哈希（曾只打印不返回）', async () => {
    const file = path.join(os.tmpdir(), `hash-test-${Date.now()}.txt`)
    fs.writeFileSync(file, 'hello')
    try {
        const hash = await calculateFileHash(file)
        expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
    } finally {
        fs.unlinkSync(file)
    }
})

test('calculateFileHash 文件不存在时 reject（曾吞错返回 undefined）', async () => {
    await expect(calculateFileHash('/nonexistent/path/file.bin')).rejects.toThrow()
})
