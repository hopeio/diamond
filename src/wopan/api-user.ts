import {client} from './wopan';
import {Channel, DefaultClientSecret, JsonClientID, JsonClientIDSecret} from "./const";

export interface PcWebLoginData {
    needSmsCode:string
}

export function PcWebLogin(phone:string, password:string): Promise<PcWebLoginData>{
   return  client.requestApiUser("PcWebLogin",{
        "phone":        phone,
        "password":     password,
        "uuid":         "",
        "verifyCode":   "",
        "clientSecret": DefaultClientSecret,
    },JsonClientIDSecret)
}
export interface PcLoginVerifyCodeData  {
    access_token : string
    refresh_token :string
    expires_in    :number
}

export async function PcLoginVerifyCode(phone:string, password:string,messageCode:string): Promise<PcLoginVerifyCodeData>{
    const res:PcLoginVerifyCodeData = await  client.requestApiUser("PcLoginVerifyCode",{
        "phone":        phone,
        "messageCode":  messageCode,
        "verifyCode":   null,
        "uuid":         null,
        "clientSecret": DefaultClientSecret,
        "password":     password,
    },JsonClientIDSecret)
    client.setToken(res.access_token, res.refresh_token)
    return res
}


export interface AppQueryUserData  {
    userId:        string
    headUrl:        string
    userName:       string
    sex:           string
    birthday:      string
    isModify:      string
    isHeadModify:  string
    isSetPassword: string
    registerTime:  string
}

export function AppQueryUser(): Promise<AppQueryUserData>{
    return  client.requestApiUser("AppQueryUser",{
        "accessToken": client.accessToken
    },JsonClientIDSecret)
}

export function AppQueryUser2(): Promise<AppQueryUserData>{
    return  client.requestWoStore("AppQueryUserV2",{
        "psToken": client.psToken,
    },JsonClientIDSecret)
}

export interface AppRefreshTokenData {
    access_token:  string
    token_type  :  string
    refresh_token: string
    expires_in    :number
    scope        :string
}

export async function AppRefreshToken(): Promise<AppRefreshTokenData>{
    const res:AppRefreshTokenData = await client.requestApiUser("AppRefreshToken",{
        "refreshToken": client.refreshToken,
        "clientSecret": DefaultClientSecret,
    },JsonClientIDSecret)
    client.setToken(res.access_token, res.refresh_token)
    return res
}

export function sendMessageCodeBase(phone:string): Promise<void>{
    return client.request(Channel.APIUser, '',{
        "operateType":"1",
        "phone":phone
    },{...JsonClientID,func: "app_send"},"sendMessageCodeBase")
}

export interface AppLoginByMobileData {
    access_token:  string
    isSetIdInfo:  string
    refresh_token: string
    expires_in: number
    is_new_register: string
}


export async function AppLoginByMobile(phone:string,smsCode:string): Promise<AppLoginByMobileData>{
    const res:AppLoginByMobileData = await  client.requestWoStore("AppLoginByMobile",{
        "phone":        phone,
        "smsCode":  smsCode,
        "clientSecret": DefaultClientSecret,
    },JsonClientID)
    client.setToken(res.access_token, res.refresh_token)
    return res
}