import { expect, test } from 'vitest'
import {AES128CBCDecrypt,AES128CBCEncrypt,decrypt,encrypt} from './index'



const key = 'your-16-byte-key';
const iv = 'your-16-byte-iv1';
test('decrypt', async () =>  {
    console.log(AES128CBCEncrypt('加密',key,iv))
    console.log(AES128CBCDecrypt('qov59xVwHs1yqX5iK6Kq2g==',key,iv))
    console.log(await encrypt('加密',key,iv))
    console.log(await decrypt('qov59xVwHs1yqX5iK6Kq2g==',key,iv))
    expect(AES128CBCEncrypt('加密',key,iv)).toBe(await encrypt('加密',key,iv))
})

