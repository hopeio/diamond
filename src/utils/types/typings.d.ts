export type Fetch<T> = (url: string, method: string, headers: Record<string, string>, body: any) => Promise<HttpResponse<T>>


interface Point {
    x: number
    y: number
}

type Point2D = [number, number];