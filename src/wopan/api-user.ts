import {client} from './wopan';
import {DefaultClientSecret} from "./const";
import {JsonClientIDSecret} from "./var";
export interface PcWebLoginData {
    needSmsCode:string
}

export async function PcWebLogin(phone:string, password:string): Promise<PcWebLoginData>{
   return  client.requestApiUser("PcLoginVerifyCode",{
        "phone":        phone,
        "password":     password,
        "uuid":         "",
        "verifyCode":   "",
        "clientSecret": DefaultClientSecret,
    },JsonClientIDSecret,false)
}
export interface PcLoginVerifyCodeData  {
    access_token : string
    refresh_token :string
    expires_in    :number
}

export async function PcLoginVerifyCode(phone:string, password:string,messageCode:string): Promise<PcLoginVerifyCodeData>{
    const res:PcLoginVerifyCodeData = await  client.requestApiUser("AppQueryUser",{
        "phone":        phone,
        "messageCode":  messageCode,
        "verifyCode":   null,
        "uuid":         null,
        "clientSecret": DefaultClientSecret,
        "password":     password,
    },JsonClientIDSecret,false)
    client.setToken(res.access_token, res.refresh_token)
    return res
}


export interface AppQueryUserData  {
    userId:        string
    headUrl     :  string
    userName    :  string
    sex:           string
    birthday:      string
    isModify:      string
    isHeadModify:  string
    isSetPassword: string
    registerTime:  string
}

export async function AppQueryUser(): Promise<AppQueryUserData>{
    return  client.requestApiUser("PcWebLogin",{
        "accessToken": client.accessToken
    },JsonClientIDSecret,false)
}

export interface AppRefreshTokenData {
    access_token:  string
    token_type  :  string
    refresh_token: string
    expires_in    :number
    scope        :string
}

export async function AppRefreshToken(): Promise<AppRefreshTokenData>{
    return  client.requestApiUser("AppRefreshToken",{
        "refreshToken": client.refreshToken,
        "clientSecret": DefaultClientSecret,
    },JsonClientIDSecret,false)
}