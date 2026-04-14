import { copypropertyIfNotExist } from "@/utils/compatible";
import qs from 'qs';
import type { Decode } from '../types';
/* eslint-disable no-param-reassign */
export type RequestOptions<T = any> = Omit<UniApp.RequestOptions, 'url'> & {
    url?: string
    baseURL?: string
    query?: Record<string, string | number>
    headers?: any
    decode?: Decode<T>
    /** 出错时是否隐藏错误提示 */
    hideErrorToast?: boolean
    successMsg?: string
    loadingMsg?: string
}

type RequestInterceptor = (options: RequestOptions) => RequestOptions
type ResponseInterceptor = (response: RequestSuccessCallbackResult) => RequestSuccessCallbackResult | null
type ResponseErrorInterceptor = (err: UniApp.GeneralCallbackResult) => any

// 组合优于继承,真好
export interface RequestSuccessCallbackResult {
    response: UniApp.RequestSuccessCallbackResult
    config?: RequestOptions
}

export class HttpClient {
    constructor(defaultConfig?: RequestOptions) {
        if (defaultConfig) {
            this.defaults = Object.assign(this.defaults, defaultConfig)
        }
    }

    // 默认的请求配置
    public defaults: RequestOptions = {
        baseURL: '',
        header: {},
        headers: {},
        dataType: 'json',
        // #ifndef MP-WEIXIN
        responseType: 'text',
        // #endif
        timeout: 30000,
    }

    // 请求拦截器
    private requestInterceptors = [] as RequestInterceptor[]
    // 响应拦截器
    private responseInterceptors = [] as ResponseInterceptor[]
    // 响应错误拦截器
    private responseErrorInterceptors = [] as ResponseErrorInterceptor[]
    public interceptors = {
        request: {
            use: (ri: RequestInterceptor) => {
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
    public request<T>(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        url: string,
        config?: RequestOptions<T>,
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (!config) {
                config = {}
            }
            config.method = method
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
                config.url = (config?.baseURL || this.defaults.baseURL) + url
            }

            if (!config.header) {
                config.header = config.headers
            } else if (config.headers) {
                copypropertyIfNotExist(config.header, config.headers)
            }
            if (this.defaults.headers) {
                copypropertyIfNotExist(config.header, this.defaults.headers)
            }

            // 执行请求拦截器
            for (const ri of this.requestInterceptors) {
                config = ri(config!)
            }

            config.success = (res) => {
                let resc: RequestSuccessCallbackResult = { response: res, config: config }
                // 执行响应拦截
                for (const ri of this.responseInterceptors) {
                    if (!ri(resc)) {
                        reject(resc)
                        return
                    }
                }
                switch (config!.responseType) {
                    case 'arraybuffer':
                        if (config!.decode) {
                            const dec = config!.decode
                            const buf = new Uint8Array(res.data as ArrayBuffer)
                            resolve(typeof dec === 'function' ? dec(buf) : dec.decode(buf))
                            return
                        }
                        break
                }
                resolve(resc.response.data as T)
            }
            config.fail = (err) => {
                // 执行响应错误拦截
                for (const ei of this.responseErrorInterceptors) {
                    if (!ei(err)) {
                        reject(err)
                        return
                    }
                }
                reject(err)
            }

            // 发送请求
            uni.request(config as UniApp.RequestOptions)
        })
    }

    // 发起get请求
    public get<T>(url: string, config?: RequestOptions) {
        return this.request<T>('GET', url, config)
    }

    // 发起post请求
    public post<T>(url: string, config?: RequestOptions) {
        return this.request<T>('POST', url, config)
    }

    public put<T>(url: string, config?: RequestOptions) {
        return this.request<T>('PUT', url, config)
    }

    public delete<T>(url: string, config?: RequestOptions) {
        return this.request<T>('DELETE', url, config)
    }
}

export const httpclient = new HttpClient({
    header: {
        'content-type': 'application/json',
        //'user-agent': 'uniapp-' + uni.getAppBaseInfo().appName,
    },
    timeout: 10000,
})
