

export interface HttpResponse<T = ResData> {
    status: number;
    data: T;
    headers: Headers;
}

export type ResData<T = any> = {
    code: number
    msg?: string
    data?: T
}

export type ListRep<T = any> = {
    list: T[]
    total?: number
}
