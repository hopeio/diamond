
interface Date {
    format(fmt: string): string;
}

type Fetch<T> = (url: string,method: string,headers: Record<string, string>, body: any)=>Promise<HttpResponse<T>>

interface HttpResponse<T> {
    status: number;
    data: T;
    headers: Headers;
}

type ResData<T> = {
    code: number
    msg: string
    data: T
}

type ListRep<T> = {
    list: T[]
    total?: number
}

interface Point  {
    x: number
    y: number
}

type Point2D = [number, number];