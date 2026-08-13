import { expect, test } from 'vitest'
// node 变体不再从 index 导出（浏览器打包不能拖 Node 内置模块），测试直接引文件做交叉验证
import {AES128CBCDecrypt,AES128CBCEncrypt} from './node.js'
import {decrypt,encrypt} from './index'



const key = 'your-16-byte-key';
const iv = 'your-16-byte-iv1';
test('decrypt', async () =>  {
    console.log(AES128CBCEncrypt('加密',key,iv))
    console.log(AES128CBCDecrypt('qov59xVwHs1yqX5iK6Kq2g==',key,iv))
    console.log(await encrypt('加密',key,iv))
    console.log(await decrypt('qov59xVwHs1yqX5iK6Kq2g==',key,iv))
    expect(AES128CBCEncrypt('加密',key,iv)).toBe(await encrypt('加密',key,iv))
})

