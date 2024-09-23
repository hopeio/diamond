
interface Date {
    format(fmt: string): string;
}

type Fetch<T> = (url: string,method: string,headers: Record<string, string>, body: any)=>Promise<HttpResponse<T>>

interface HttpResponse<T> {
    status: number;
    data: T;
    headers: Headers;
}

