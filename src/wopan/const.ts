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

export enum SortType {
    NameAsc,
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