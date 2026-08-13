import axios, {
    type AxiosInstance,
    type AxiosError,
    type AxiosResponse,
    type Method,
    type HeadersDefaults,
    type AxiosInterceptorOptions, type AxiosRequestConfig, type AxiosRequestHeaders,
    type AxiosHeaderValue,
} from "axios";

import type { Decode, Stream } from '../../types';

export interface Error extends AxiosError {
    isCancelRequest?: boolean;
}

export interface Response extends AxiosResponse {
    config: InternalRequestConfig;
}

interface InternalRequestConfig<T = any> extends RequestConfig<T> {
    headers: AxiosRequestHeaders;
}

export interface RequestConfig<T = any> extends AxiosRequestConfig {
    decode?: Decode<T>
    stream?: Stream<T>
    successMsg?: string;
    beforeRequestCallback?: (request: RequestConfig) => void;
    beforeResponseCallback?: (response: Response) => void;
}

export interface Defaults extends Omit<RequestConfig, 'headers'> {
    headers: HeadersDefaults & {
        [key: string]: AxiosHeaderValue
    }
}

type RequestInterceptorUse<T> = (
    onFulfilled?: ((value: T) => T | Promise<T>) | null,
    onRejected?: ((error: any) => any) | null,
    options?: AxiosInterceptorOptions
) => number;

type ResponseInterceptorUse<T> = (
    onFulfilled?: ((value: T) => T | Promise<T>) | null,
    onRejected?: ((error: any) => any) | null
) => number;

export interface InterceptorManager<V> {
    use: V extends Response
    ? ResponseInterceptorUse<V>
    : RequestInterceptorUse<V>;

    eject(id: number): void;

    clear(): void;
}

export class HttpClient {
    constructor(config?: RequestConfig) {
        if (config) {
            this.instance = axios.create(config);
            this.defaults = this.instance.defaults;
            this.interceptors = {
                request: this.instance.interceptors.request,
                response: this.instance.interceptors.response
            };
        }
    }

    /** 保存当前`Axios`实例对象 */
    defaults: Defaults = axios.defaults;
    instance: AxiosInstance = axios;

    interceptors: {
        request: InterceptorManager<InternalRequestConfig>;
        response: InterceptorManager<Response>;
    } = {
            request: axios.interceptors.request,
            response: axios.interceptors.response
        }

    /** 通用请求工具函数 */
    public request<T>(
        method: Method,
        url: string,
        config?: RequestConfig<T>
    ): Promise<T> {
        if (!config) {
            config = { method: method, url: url };
        } else {
            config.method = method;
            config.url = url;
        }

        // 直接返回 Promise 链；曾用 new Promise 包裹且 stream 分支只 return 不 resolve，外层永久 pending
        return this.instance
            .request(config as AxiosRequestConfig<T>)
            .then(res => {
                switch (res.config.responseType) {
                    case 'arraybuffer':
                        if (config!.decode) {
                            const dec = config!.decode
                            const buf = new Uint8Array(res.data as ArrayBuffer)
                            return typeof dec === 'function' ? dec(buf) : dec.decode(buf)
                        }
                        break
                    case 'stream':
                        if (config!.stream) {
                            const s = config!.stream
                            return typeof s === 'function' ? s(res.data) : s.stream(res.data)
                        }
                        break
                }
                return res.data as T;
            });
    }

    /** 单独抽离的`post`工具函数 */
    public post<T>(url: string, params?: RequestConfig): Promise<T> {
        return this.request<T>("post", url, params);
    }

    /** 单独抽离的`get`工具函数 */
    public get<T>(url: string, params?: RequestConfig): Promise<T> {
        return this.request<T>("get", url, params);
    }

    public put<T>(url: string, params?: RequestConfig): Promise<T> {
        return this.request<T>("put", url, params);
    }

    public delete<T>(url: string, params?: RequestConfig): Promise<T> {
        return this.request<T>("delete", url, params);
    }
}

export const httpClient = new HttpClient();
