import CryptoJS from 'crypto-js';
import {Channel, DefaultClientSecret} from "./const";

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
        return {
            status: res.status,
            data: await res.json(),
            headers: res.headers,
        }
    }

    set fetch(value: Fetch<any>) {
        this._fetch = value
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
        this.accessToken = accessToken
        this.accessKey = accessToken.slice(0, 16)
        this.refreshToken = refreshToken
    }

    private DefaultBaseURL  = "https://panservice.mail.wo.cn"
    private DefaultZoneURL  = "https://tjupload.pan.wo.cn"
    private DefaultPartSize = 8 * 1024 * 1024
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

        let body= this.newBody(channel, param, other)
        if (key!==""){
            const header = calHeader(channel, key)
            body =  {header, body}
        }
        let uri = Channel.WoHome
        if (channel != Channel.WoHome){
            uri = Channel.APIUser
        }
        let url = `${this.DefaultBaseURL}/${uri}/${api}`
        if (this._proxy!=''){
            headers["Target-Host"] = this.DefaultBaseURL
            url = `${this._proxy}/${uri}/${api}`
        }
        const {status, data} = await this._fetch(url, "POST", headers, body)
        if(status > 399) {
            throw new Error(`${status} ${data}`)
        }
        if (data.STATUS != "200") {
             throw new Error(`request failed with status: ${data.STATUS}, msg: ${data.MSG}`)
        }
        if (data.RSP.RSP_CODE != "0000") {
            // 1001 未登录
            throw new Error(`request failed with rsp_code: ${data.RSP.RSP_CODE},rep_desc: ${data.RSP.RSP_DESC}`)
        }

        if (typeof data.RSP.DATA === "string"){
            return JSON.parse(this.decrypt(data.RSP.DATA, channel))
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

    encrypt(data: string, channel: string): string {
        try {
            let key = this.accessKey;
            if (channel != Channel.WoHome) {
                key = DefaultClientSecret
            }
            const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
                iv: CryptoJS.enc.Utf8.parse(this.iv),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            return encrypted.toString()
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    decrypt(data: string, channel = Channel.WoHome): string {
        try {
            let key = this.accessKey;
            if (channel != Channel.WoHome) {
                key = DefaultClientSecret
            }
            const decrypted = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
                iv: CryptoJS.enc.Utf8.parse(this.iv),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    private newBody(channel: string, param: any,other:any): any {
        return {
            ...other,
            "param": param?this.encrypt(JSON.stringify(param), channel):'',
        }
    }


    async request2<T>( channel: Channel,
              param: Record<string, any>,
              other: Record<string, any>,
              api:string
    ):Promise<T>{
        const headers: Record<string, string> = {
            "Content-Type":"application/json",
            "Origin": "https://pan.wo.cn",
            "Referer": "https://pan.wo.cn/",
        }
        let url = `${this.DefaultBaseURL}/${channel}/${api}`
        if (this._proxy!==''){
            headers["Target-Host"] = this.DefaultBaseURL
            url = `${this._proxy}/${channel}/${api}`
        }
        const {status, data} = await this._fetch(url, "POST", headers , {...param,...other})
        if(status > 399) {
            throw new Error(`${status} ${data}`)
        }
        if (data.STATUS != "200") {
            throw new Error(`request failed with status: ${data.STATUS}, msg: ${data.MSG}`)
        }
        if (data.RSP.RSP_CODE != "0000") {
            // 1001 未登录
            throw new Error(`request failed with rsp_code: ${data.RSP.RSP_CODE},rep_desc: ${data.RSP.RSP_DESC}`)
        }
        return data.RSP.DATA
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
    const sign = CryptoJS.MD5(`${key}${resTime}${reqSeq}${channel}${version}`).toString(CryptoJS.enc.Hex);
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
