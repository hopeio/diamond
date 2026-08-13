import {client,Channel} from "../wopan";

// 手工联调草稿：凭据与密文从环境变量注入，不要把真实会话 token 提交进仓库
const accessToken = process.env.WOPAN_ACCESS_TOKEN ?? ''
const refreshToken = process.env.WOPAN_REFRESH_TOKEN ?? ''
if (!accessToken) {
    throw new Error('set WOPAN_ACCESS_TOKEN / WOPAN_REFRESH_TOKEN to run this script')
}
client.setToken(accessToken, refreshToken)
client.psToken = process.env.WOPAN_PS_TOKEN ?? ''
//QueryAllFiles(SpaceType.Private, '0', 0, 20, SortType.NameAsc, '').then (r =>console.log(r))
if (process.env.WOPAN_CIPHER) {
    console.log(await client.decrypt(process.env.WOPAN_CIPHER))
}
if (process.env.WOPAN_CIPHER_API_USER) {
    console.log(await client.decrypt(process.env.WOPAN_CIPHER_API_USER, Channel.APIUser))
}
