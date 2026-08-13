import qs from 'qs'
import type { ResponseType } from './type'
import { copypropertyIfNotExist } from '../object'
import type { Decode, Stream } from '../../types';

/* eslint-disable no-param-reassign */
export type FetchOptions<T = any> = RequestInit & {
    url: string
    timeout?: number
    baseUrl?: string
    query?: Record<string, any>
    responseType?: ResponseType
    decode?: Decode<T>
    stream?: Stream<T>
    /** 出错时是否隐藏错误提示 */
    hideErrorToast?: boolean
    successMsg?: string
    loadingMsg?: string
}

export type FetchDefaults = Omit<FetchOptions, 'url'>

export type FetchInterceptor = (options: FetchOptions) => FetchOptions
type ResponseInterceptor = (response: FetchSuccessCallbackResult) => FetchSuccessCallbackResult | any
type ResponseErrorInterceptor = (error: any) => any

export interface FetchSuccessCallbackResult {
    response: Response
    config?: FetchOptions
}

export class FetchClient {
    constructor(defaultConfig?: FetchDefaults) {
        if (defaultConfig) {
            this.defaults = Object.assign(this.defaults, defaultConfig)
        }
    }

    // 默认的请求配置
    public defaults: FetchDefaults = {
        baseUrl: '',
        responseType: 'json',
        headers: {},
        timeout: 30000,
    }

    // 请求拦截器
    private requestInterceptors = [] as FetchInterceptor[]
    // 响应拦截器
    private responseInterceptors = [] as ResponseInterceptor[]
    // 响应错误拦截器
    private responseErrorInterceptors = [] as ResponseErrorInterceptor[]
    public interceptors = {
        request: {
            use: (ri: FetchInterceptor) => {
                this.requestInterceptors.push(ri)
            },
        },
        response: {
            use: (ri: ResponseInterceptor, ei: ResponseErrorInterceptor) => {
                this.responseInterceptors.push(ri)
                this.responseErrorInterceptors.push(ei)
            },
        },
    }

    // 发起请求，默认配置是defaultConfig，也可以传入config参数覆盖掉默认配置中某些属性
    public request<T = any>(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        url: string,
        config?: FetchOptions,
    ): Promise<T> {
        let cfg: FetchOptions = config ?? { method, url }
        // method 必须显式写入；曾只在 config 缺省时设置，POST/PUT/DELETE 带 config 时全部退化成 GET
        cfg.method = method
        // headers 先合并成新对象，避免 copypropertyIfNotExist 把 defaults.headers 的引用带进 cfg，
        // 后续拦截器写 header 会污染全局默认
        cfg.headers = Object.assign({}, this.defaults.headers, cfg.headers)
        copypropertyIfNotExist(cfg, this.defaults)

        // 接口请求支持通过 query 参数配置 queryString
        if (cfg.query) {
            const queryStr = qs.stringify(cfg.query)
            url += (url.includes('?') ? '&' : '?') + queryStr
        }
        cfg.url = url.startsWith('http') ? url : (cfg.baseUrl || '') + url

        // 执行请求拦截器
        for (const ri of this.requestInterceptors) {
            cfg = ri(cfg)
        }

        let timer: ReturnType<typeof setTimeout> | undefined
        if (cfg.timeout && !cfg.signal) {
            const controller = new AbortController()
            timer = setTimeout(() => controller.abort(), cfg.timeout)
            cfg.signal = controller.signal
        }

        // 曾用局部 url 发请求，baseUrl 与拦截器改写的 config.url 全部不生效
        return fetch(cfg.url, cfg)
            .then(res => {
                const resc: FetchSuccessCallbackResult = { response: res, config: cfg }
                // 执行响应拦截；约定返回原对象表示放行，返回其它值当作错误
                for (const ri of this.responseInterceptors) {
                    const result = ri(resc)
                    if (result != resc) {
                        return Promise.reject(result)
                    }
                }
                if (res.bodyUsed) {
                    // 拦截器已消费 body（如自行读取并抛出业务错误后放行）
                    return undefined as T
                }
                switch (cfg.responseType) {
                    case 'text':
                        return res.text() as Promise<T>
                    case 'blob':
                        return res.blob() as Promise<T>
                    case 'formdata':
                        return res.formData() as Promise<T>
                    case 'stream': {
                        // 曾拆成两级 then 后再取 res.body，拿到的永远是 undefined 且不 settle
                        if (cfg.stream) {
                            const s = cfg.stream
                            return (typeof s === 'function' ? s(res.body) : s.stream(res.body)) as Promise<T>
                        }
                        return res.body as T
                    }
                    case 'bytes':
                    case 'arraybuffer': {
                        const data = cfg.responseType === 'bytes' ? res.bytes() : res.arrayBuffer()
                        if (cfg.decode) {
                            const dec = cfg.decode
                            return data.then(raw => {
                                const buf = raw instanceof Uint8Array ? raw : new Uint8Array(raw)
                                return typeof dec === 'function' ? dec(buf) : dec.decode(buf)
                            })
                        }
                        return data as Promise<T>
                    }
                    case 'json':
                    default:
                        return res.json() as Promise<T>
                }
            })
            .catch(err => {
                // 错误拦截器可转换错误，但最终必须 reject；
                // 曾在无拦截器（或拦截器全返回 truthy）时既不 resolve 也不 reject，Promise 永久挂起
                for (const ei of this.responseErrorInterceptors) {
                    try {
                        const r = ei(err)
                        if (r !== undefined) {
                            err = r
                        }
                    } catch (e) {
                        err = e
                    }
                }
                return Promise.reject(err)
            })
            .finally(() => {
                // 定时器不清理会在请求完成后仍触发 abort，并在 Node 中拖住事件循环
                if (timer !== undefined) {
                    clearTimeout(timer)
                }
            })
    }

    // 发起get请求
    public get<T>(url: string, config?: FetchOptions) {
        return this.request<T>('GET', url, config)
    }

    // 发起post请求
    public post<T>(url: string, config?: FetchOptions) {
        return this.request<T>('POST', url, config)
    }

    public put<T>(url: string, config?: FetchOptions) {
        return this.request<T>('PUT', url, config)
    }

    public delete<T>(url: string, config?: FetchOptions) {
        return this.request<T>('DELETE', url, config)
    }
}

export const fetchclient = new FetchClient({
    headers: {
        'content-type': 'application/json',
        //'user-agent': 'uniapp-' + uni.getAppBaseInfo().appName,
    },
    responseType: 'json',
})
