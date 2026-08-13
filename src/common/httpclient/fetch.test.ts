import { afterEach, describe, expect, test, vi } from 'vitest'
import { FetchClient } from './fetch'

const jsonResponse = (body: any) =>
    new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('FetchClient.request', () => {
    test('POST 带 config 时 method 正确写入', async () => {
        const fetchMock = vi.fn(async () => jsonResponse({ ok: 1 }))
        vi.stubGlobal('fetch', fetchMock)
        const client = new FetchClient()
        await client.post('/x', { query: { a: 1 } } as any)
        expect(fetchMock.mock.calls[0][1].method).toBe('POST')
    })

    test('baseUrl 拼接生效', async () => {
        const fetchMock = vi.fn(async () => jsonResponse({}))
        vi.stubGlobal('fetch', fetchMock)
        const client = new FetchClient({ baseUrl: 'https://api.test' })
        await client.get('/users')
        expect(fetchMock.mock.calls[0][0]).toBe('https://api.test/users')
    })

    test('请求拦截器改写 url 生效', async () => {
        const fetchMock = vi.fn(async () => jsonResponse({}))
        vi.stubGlobal('fetch', fetchMock)
        const client = new FetchClient()
        client.interceptors.request.use((cfg) => ({ ...cfg, url: 'https://rewritten.test/y' }))
        await client.get('https://origin.test/x')
        expect(fetchMock.mock.calls[0][0]).toBe('https://rewritten.test/y')
    })

    test('网络错误且无错误拦截器时必 reject（不再永久 pending）', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('network down') }))
        const client = new FetchClient()
        await expect(client.get('/x')).rejects.toThrow('network down')
    })

    test('拦截器写 header 不污染全局默认', async () => {
        const fetchMock = vi.fn(async () => jsonResponse({}))
        vi.stubGlobal('fetch', fetchMock)
        const client = new FetchClient({ headers: { 'content-type': 'application/json' } })
        client.interceptors.request.use((cfg) => {
            ;(cfg.headers as Record<string, string>)['authorization'] = 'token-1'
            return cfg
        })
        await client.get('/a')
        expect((client.defaults.headers as Record<string, string>)['authorization']).toBeUndefined()
    })

    test('stream 回调收到 ReadableStream 且 Promise settle', async () => {
        const body = new ReadableStream({ start(c) { c.enqueue(new Uint8Array([1])); c.close() } })
        vi.stubGlobal('fetch', vi.fn(async () => new Response(body)))
        const client = new FetchClient()
        const seen: any[] = []
        const result = await client.get('/s', {
            responseType: 'stream',
            stream: (s: any) => { seen.push(s); return 'done' },
        } as any)
        expect(seen[0]).toBeInstanceOf(ReadableStream)
        expect(result).toBe('done')
    })

    test('bytes + decode 收到 Uint8Array', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => new Response(new Uint8Array([1, 2, 3]))))
        const client = new FetchClient()
        const result = await client.get('/b', {
            responseType: 'bytes',
            decode: (buf: Uint8Array) => buf.length,
        } as any)
        expect(result).toBe(3)
    })
})
