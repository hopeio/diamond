import {copypropertyIfNotExist} from "@/utils/compatible";


/* eslint-disable no-param-reassign */
export type RequestOptions = Omit<UniApp.RequestOptions, 'url'> & {
    url?: string
    baseUrl?: string
    query?: Record<string, string|number>
    headers?: any
    decode?: (input: Uint8Array, length?: number) => any
    stream?: (input: ReadableStream<Uint8Array<ArrayBuffer>> | null) => Promise<any>
    /** 出错时是否隐藏错误提示 */
    hideErrorToast?: boolean
    successMsg?: string
    loadingMsg?: string
}
export type Defaults = Omit<RequestOptions, 'url'>

export type UploadFileOptions = {
    file?: File
    files?: UniApp.UploadFileOptionFiles[]
    filePath?: string
    name?: string
    formData?: any
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
    constructor(defaultConfig?: Defaults) {
        if (defaultConfig) {
            this.defaults = Object.assign(this.defaults, defaultConfig)
        }
    }

    // 默认的请求配置
    public defaults: Defaults = {
        baseUrl: '',
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
        config?: RequestOptions,
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (!config){
                config =  { method: method, url: url }
            }
            copypropertyIfNotExist(config, this.defaults)
            // 接口请求支持通过 query 参数配置 queryString
            if (config.query) {
                const queryStr = Object.keys(config.query).map((key) => `${key}=${config!.query![key]}`)
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

            if (!config.header){
                config.header =  config.headers
            }else if(config.headers){
                copypropertyIfNotExist(config.header,config.headers)
            }
            if(this.defaults.headers){
                copypropertyIfNotExist(config.header,this.defaults.headers)
            }

            // 执行请求拦截器
            for (const ri of this.requestInterceptors) {
                config = ri(config!)
            }

            config.success = (res) => {
                let resc: RequestSuccessCallbackResult = {response: res, config: config}
                // 执行响应拦截
                for (const ri of this.responseInterceptors) {
                    if (!ri(resc)) {
                        reject(resc)
                        return
                    }
                }
                switch (config!.responseType) {
                    case 'arraybuffer':
                        if (config!.decode){
                            resolve(config!.decode(new Uint8Array(res.data as ArrayBuffer)))
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
