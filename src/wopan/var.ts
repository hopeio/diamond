const 	DefaultClientID     = "1001000021"
export const JsonClientIDSecret ={
    "clientId": DefaultClientID,
    "secret":   true,
}
export const JsonSecret = {
    "secret": true,
}

export const ErrInvalidPsToken = new Error("invalid psToken")