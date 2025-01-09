import qs from 'qs'

/* eslint-disable no-param-reassign */
export type UniRequestOptions = Omit<UniApp.RequestOptions, 'url'> & {
    baseUrl?: string
    query?: Record<string, any>
    /** 出错时是否隐藏错误提示 */
    hideErrorToast?: boolean
}

type UniRequestInterceptor = (options: UniApp.RequestOptions) => UniApp.RequestOptions
type UniResponseInterceptor = (
    response: RequestSuccessCallbackResult,
) => RequestSuccessCallbackResult|null
type UniResponseErrorInterceptor = (
    err: UniApp.GeneralCallbackResult,
) => any

export interface RequestSuccessCallbackResult extends  UniApp.RequestSuccessCallbackResult{
    config?: UniRequestOptions
}

class UniRequest {
    constructor(defaultConfig?: UniRequestOptions) {
        if (defaultConfig) {
            this.defaults = Object.assign(this.defaults, defaultConfig)
        }
    }

    // 默认的请求配置
    public defaults: UniRequestOptions = {
        baseUrl: '',
        header: {},
        dataType: 'json',
        // #ifndef MP-WEIXIN
        responseType: 'json',
        // #endif
        timeout: 30000,
    }

    // 请求拦截器
    private requestInterceptors = [] as UniRequestInterceptor[]
    // 响应拦截器
    private responseInterceptors = [] as UniResponseInterceptor[]
    // 响应错误拦截器
    private responseErrorInterceptors = [] as UniResponseErrorInterceptor[]
    public interceptors = {
        request: {
            use: (ri: UniRequestInterceptor) => {
                this.requestInterceptors.push(ri)
            },
        },
        response: {
            use: (ri: UniResponseInterceptor, ei: UniResponseErrorInterceptor) => {
                this.responseInterceptors.push(ri)
                this.responseErrorInterceptors.push(ei)
            },
        },
    }

    // 发起请求，默认配置是defaultConfig，也可以传入config参数覆盖掉默认配置中某些属性
    public request<
        T extends string | AnyObject | ArrayBuffer = any,
    >(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        url: string,
        config?: UniRequestOptions,
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            // 接口请求支持通过 query 参数配置 queryString
            if (config?.query) {
                const queryStr = qs.stringify(config.query)
                if (url.includes('?')) {
                    url += `&${queryStr}`
                } else {
                    url += `?${queryStr}`
                }
            }
            url = (config?.baseUrl || this.defaults.baseUrl) + url
            const header = config?.header
                ? Object.assign(this.defaults.header, config.header)
                : this.defaults.header
            const timeout = config?.timeout ? config.timeout : this.defaults.timeout
            let options: UniApp.RequestOptions = {
                ...config,
                method,
                url,
                header,
                timeout,
                success: (res) => {
                     let resc:RequestSuccessCallbackResult ={ ...res, config}
                    // 执行响应拦截
                    for (const ri of this.responseInterceptors) {
                        if (!ri(resc)) {
                            reject(resc)
                            return
                        }
                    }
                    resolve(resc.data as T)
                },
                fail: (err) => {
                    // 执行响应错误拦截
                    for (const ei of this.responseErrorInterceptors) {
                       if(!ei(err)) {
                           reject(err)
                           return
                       }
                    }
                    reject(err)
                },
            }

            // 执行请求拦截器
            for (const ri of this.requestInterceptors) {
                options = ri(options)
            }
            // 发送请求
            uni.request(options)
        })
    }

    // 发起get请求
    public get<
        T extends string | AnyObject | ArrayBuffer = any
    >(url: string, config?: UniRequestOptions) {
        return this.request<T>('GET', url, config)
    }

    // 发起post请求
    public post<
        T extends string | AnyObject | ArrayBuffer = any
    >(url: string,  config?: UniRequestOptions) {
        return this.request<T>('POST', url,  config)
    }

    public put<
        T extends string | AnyObject | ArrayBuffer = any
    >(url: string,  config?: UniRequestOptions) {
        return this.request<T>('PUT', url,  config)
    }

    public delete<
        T extends string | AnyObject | ArrayBuffer = any
    >(url: string,  config?: UniRequestOptions) {
        return this.request<T>('DELETE', url, config)
    }
}

export const unirequest = new UniRequest({
    header: {
        'content-type': 'application/json',
        //'user-agent': 'uniapp-' + uni.getAppBaseInfo().appName,
    },
    timeout: 10000,
})
