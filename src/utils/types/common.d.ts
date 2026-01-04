export type Pagination = {
    pageNo: number;
    pageSize: number;
}

export interface HttpResponse<T = CommonResp> {
    status: number;
    data: T;
    headers: Headers;
}

export type CommonResp<T = any> = {
    code: number
    msg?: string
    data?: T
}

export type ListResp<T = any> = {
    list: T[]
    total?: number
}


export type Fetch<T> = (url: string, method: string, headers: Record<string, string>, body: any) => Promise<HttpResponse<T>>