import qs from 'qs'
import type {ResponseType} from './type.ts'
import {copypropertyIfNotExist} from "@/utils/compatible";


/* eslint-disable no-param-reassign */
export type FetchOptions = RequestInit & {
    url: string
    timeout?: number
    baseUrl?: string
    query?: Record<string, any>
    responseType?: ResponseType
    decode?: (input: Uint8Array, length?: number) => any
    stream?: (input: ReadableStream<Uint8Array<ArrayBuffer>> | null) => Promise<any>
    /** 出错时是否隐藏错误提示 */
    hideErrorToast?: boolean
    successMsg?: string
    loadingMsg?: string
}

export type FetchDefaults = Omit<FetchOptions, 'url'>

export type FetchInterceptor = (options: FetchOptions) => FetchOptions
type ResponseInterceptor = (response: FetchSuccessCallbackResult) => FetchSuccessCallbackResult | null
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
        return new Promise<T>((resolve, reject) => {
            if (!config) {
                config = {method: method, url: url}
            }
            copypropertyIfNotExist(config, this.defaults)

            // 接口请求支持通过 query 参数配置 queryString
            if (config.query) {
                const queryStr = qs.stringify(config.query)
                if (url.includes('?')) {
                    url += `&${queryStr}`
                } else {
                    url += `?${queryStr}`
                }
            }
            if (url.startsWith('http')) {
                config.url = url
            } else {
                config.url = (config?.baseUrl || this.defaults.baseUrl) + url
            }
            if (!config.headers) {
                config.headers = {...this.defaults.headers}
            } else if (this.defaults.headers) {
                copypropertyIfNotExist(config.headers, this.defaults.headers)
            }

            // 执行请求拦截器
            for (const ri of this.requestInterceptors) {
                config = ri(config!)
            }

            if (config.timeout && !config.signal) {
                const controller = new AbortController();
                setTimeout(() => controller.abort(), config.timeout);
                config.signal = controller.signal;
            }

            // 发送请求
            fetch(url, config).then(res => {
                    let resc: FetchSuccessCallbackResult = {response: res, config: config}
                    // 执行响应拦截
                    for (const ri of this.responseInterceptors) {
                        if (!ri(resc)) {
                            reject(resc)
                            return
                        }
                    }
                    if (res.bodyUsed) {
                        return
                    }
                    switch (config!.responseType) {
                        case 'json':
                            return res.json();
                        case 'text':
                            return res.text();
                        case 'blob':
                            return res.blob();
                        case 'arraybuffer':
                            return res.arrayBuffer();
                        case 'formdata':
                            return res.formData();
                        case 'bytes':
                            return res.bytes();
                        case 'stream':
                            if (config!.stream) {
                                return config!.stream!(res.body);
                            }
                            return Promise.resolve(res.body);
                        default:
                            return res.json();
                    }

                }
            ).then(res => {
                switch (config!.responseType) {
                    case 'bytes':
                        if (config!.decode) {
                            resolve(config!.decode(new Uint8Array(res)))
                            return
                        }
                        break
                    case 'arraybuffer':
                        if (config!.decode) {
                            resolve(config!.decode(new Uint8Array(res)))
                            return
                        }
                        break
                }
                resolve(res)
            }).catch(err => {
                for (const ei of this.responseErrorInterceptors) {
                    if (!ei(err)) {
                        reject(err)
                        return
                    }
                }
            })
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
