export enum Channel {
    APIUser = 'api-user',
    WoHome = 'wohome',
    WoCloud = 'wocloud',
    Wostore = 'wostore'
}
export enum SpaceType {
    Personal = "0",
    Family = "1",
    Private = "4"
}

export const DefaultClientSecret = "XFmi9GS2hzk98jGX"
export const DefaultClientID = "1001000021"

// 与官方 SDK 对齐从 1 起（Go 侧 iota+1）；曾从 0 起导致所有排序语义整体错位一档
export enum SortType {
    NameAsc = 1,
    NameDesc,
    SizeAsc,
    SizeDesc,
    TimeAsc,
    TimeDesc,
}

export const JsonClientID = {
    "clientId": DefaultClientID,
}

export const JsonClientIDSecret ={
    "clientId": DefaultClientID,
    "secret":   true,
}
export const JsonSecret = {
    "secret": true,
}

export const ErrInvalidPsToken = new Error("invalid psToken")