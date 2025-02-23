export type Pagination = {
    pageNo: number;
    pageSize: number;
}

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


export type Fetch<T> = (url: string, method: string, headers: Record<string, string>, body: any) => Promise<HttpResponse<T>>
