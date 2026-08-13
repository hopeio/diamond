import {Channel, DefaultClientSecret} from "./const";
import {decrypt, encrypt} from "../common/crypto";
import SparkMD5 from "spark-md5";
import type { Fetch, HttpResponse } from '../types'
class Client {
    private static instance: Client

    private constructor() {
    }

    public static getInstance(): Client {
        if (!Client.instance) {
            Client.instance = new Client()
        }
        return Client.instance
    }

    private _fetch: Fetch<any> = async function<T> (url:string, method: string, headers: Record<string, string>, body: any):Promise<HttpResponse<Resp<T>>> {
        const res = await fetch(url,{
            headers: headers,
            body: JSON.stringify(body),
            method: method
        })
        // 网关 502/HTML 响应时直接 res.json() 会抛 SyntaxError，错误形态与业务错误码不一致
        const text = await res.text()
        let data: any
        try {
            data = JSON.parse(text)
        } catch {
            data = text
        }
        return {
            status: res.status,
            data,
            headers: res.headers,
        }
    }

    private _failCallback: ((error: any) => void) | undefined

    set fetch(value: Fetch<any>) {
        this._fetch = value
    }
    set failCallback(value: (error: any) => void) {
        this._failCallback = value
    }
    accessToken: string = ''
    accessKey: string = ''
    refreshToken: string = ''
    psToken: string = ''
    _proxy:string = ''
    set proxy(value: string) {
        this._proxy = value
    }
    private iv: string = 'wNSOYIB1k1DjY5lA'

    setToken(accessToken: string, refreshToken: string) {
        // accessKey 取前 16 字节做 AES-128 密钥，短 token 会在加密时抛难排查的 Invalid key length
        if (accessToken.length < 16) {
            throw new Error("invalid accessToken: length must be >= 16")
        }
        this.accessToken = accessToken
        this.accessKey = accessToken.slice(0, 16)
        this.refreshToken = refreshToken
    }

    private DefaultBaseURL = "https://panservice.mail.wo.cn"
    async request<T>(
        channel: Channel,
        key: string,
        param: Record<string, any>,
        other: Record<string, any>,
        api = "dispatcher"
    ):Promise<T> {
        const headers: Record<string, string> = {
            "Content-Type":"application/json",
            "Origin": "https://pan.wo.cn",
            "Referer": "https://pan.wo.cn/",
        }

        if (this.accessToken !== '') {
            headers.Accesstoken = this.accessToken
        }

        let body= await this.newBody(channel, param, other)
        if (key!==""){
            const header = calHeader(channel, key)
            body =  {header, body}
        }
        // 注意：官方 SDK 按真实 channel 拼路径（wostore/wocloud 各自独立），这里统一折叠到 api-user。
        // 该组合（api-user 路径 + header 内真实 channel + clientSecret 加密）经线上 uniapp 登录验证可用，
        // 服务端接受；改回官方拼法需连同密钥选择一起联调验证，不要单独改动。
        let uri: string = Channel.WoHome
        if (channel != Channel.WoHome){
            uri = Channel.APIUser
        }
        let url = `${this.DefaultBaseURL}/${uri}/${api}`
        if (this._proxy!=''){
            headers["Target-Url"] = this.DefaultBaseURL
            headers["Target-Origin"] = "https://pan.wo.cn"
            headers["Target-Referer"] = "https://pan.wo.cn/"
            url = `${this._proxy}/${uri}/${api}`
        }
        const {status, data} = await this._fetch(url, "POST", headers, body)
        // failCallback 是失败通知（消费方可在其中 toast/跳登录，消息前缀是既定协议不要改动）；
        // 回调后必须 throw 终止流程，曾继续往下走把失败数据当成功返回
        const fail = (msg: string): never => {
            this._failCallback?.(msg)
            throw new Error(msg)
        }
        if (status > 399) {
            fail(`request failed: ${status}, data: ${typeof data === "string" ? data : JSON.stringify(data)}`)
        }
        if (data.STATUS != "200") {
            fail(`request failed with status: ${data.STATUS}, msg: ${data.MSG}`)
        }
        if (data.RSP.RSP_CODE != "0000") {
            // 1001 未登录
            fail(`request failed with rsp_code: ${data.RSP.RSP_CODE},rep_desc: ${data.RSP.RSP_DESC}`)
        }

        if (typeof data.RSP.DATA === "string"){
            if (data.RSP.DATA !== ""){
                const plain = await this.decrypt(data.RSP.DATA, channel)
                // 部分接口 DATA 是加密的纯字符串而非 JSON，解析失败按原文返回
                try {
                    return JSON.parse(plain)
                } catch {
                    return plain as T
                }
            }
        }
         return data.RSP.DATA
    }

    requestApiUser<T>(key: string,
                   param: Record<string, any>,
                   other: Record<string, any>
    ): Promise<T>{
        return this.request(Channel.APIUser, key, param, other)
    }

    requestWoStore<T>(key: string,
                      param: Record<string, any>,
                      other: Record<string, any>
    ): Promise<T>{
        return this.request(Channel.Wostore, key, param, other)
    }

    requestWoHome<T>(key: string,
                      param: Record<string, any>,
                      other: Record<string, any>,
                    ): Promise<T>{
        return this.request(Channel.WoHome, key, param, other)
    }

    // 密钥选择与官方 SDK 有意不同（官方仅 api-user 用 clientSecret）：
    // 登录接口走 wostore 通道时 accessKey 尚为空，只能用 clientSecret；
    // 该组合与上面 URL 折叠配套，经线上验证可用，勿单独改动
    async encrypt(data: string, channel: string): Promise<string> {
        try {
            let key = this.accessKey;
            if (channel != Channel.WoHome) {
                key = DefaultClientSecret
            }
            return encrypt(data,key,this.iv)
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

   async decrypt(data: string, channel = Channel.WoHome): Promise<string> {
        try {
            let key = this.accessKey;
            if (channel != Channel.WoHome) {
                key = DefaultClientSecret
            }
            return await decrypt(data,key,this.iv);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    private async newBody(channel: string, param: any,other:any): Promise<any> {
        return {
            ...other,
            "param": param?await this.encrypt(JSON.stringify(param), channel):'',
        }
    }
}


interface Header {
    key: string;
    resTime: number;
    reqSeq: number;
    channel: string;
    sign: string;
    version: string;
}

function calHeader(channel: string, key: string): Header {
    const resTime = Date.now();
    const reqSeq = Math.floor(Math.random() * 8999) + 1e5;
    const version = "";
    const sign = SparkMD5.hash(`${key}${resTime}${reqSeq}${channel}${version}`);
    return {
        key: key,
        resTime: resTime,
        reqSeq: reqSeq,
        channel: channel,
        sign: sign,
        version: version,
    };
}

export const client = Client.getInstance()




interface RspData<T> {
    RSP_CODE: string;
    RSP_DESC: string;
    DATA: string|T;
}

interface Resp<T> {
    STATUS: string;
    MSG: string;
    LOGID: string;
    RSP: RspData<T>;
}
