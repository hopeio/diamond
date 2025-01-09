export type Fetch<T> = (url: string, method: string, headers: Record<string, string>, body: any) => Promise<HttpResponse<T>>
