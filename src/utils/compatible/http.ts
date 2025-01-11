import axios, {
    type AxiosInstance,
    type AxiosError,
    type AxiosResponse,
    type Method,
    type HeadersDefaults,
    type AxiosHeaderValue,
    type AxiosInterceptorOptions, type InternalAxiosRequestConfig, type AxiosRequestConfig, type AxiosRequestHeaders,
} from "axios";


export type HttpRequestMethods = Extract<
    Method,
    "get" | "post" | "put" | "delete" | "patch" | "option" | "head"
>;

export interface HttpError extends AxiosError {
    isCancelRequest?: boolean;
}

export interface HttpResponse extends AxiosResponse {
    config: InternalHttpRequestConfig;
}

export interface InternalHttpRequestConfig extends HttpRequestConfig {
    headers: AxiosRequestHeaders;
}

export interface HttpRequestConfig extends AxiosRequestConfig {
    successMsg?: string;
    beforeRequestCallback?: (request: HttpRequestConfig) => void;
    beforeResponseCallback?: (response: HttpResponse) => void;
}

export interface HttpDefaults extends Omit<HttpRequestConfig, 'headers'> {
    headers: HeadersDefaults;
}

type HttpRequestInterceptorUse<T> = (
    onFulfilled?: ((value: T) => T | Promise<T>) | null,
    onRejected?: ((error: any) => any) | null,
    options?: AxiosInterceptorOptions
) => number;

type HttpResponseInterceptorUse<T> = (
    onFulfilled?: ((value: T) => T | Promise<T>) | null,
    onRejected?: ((error: any) => any) | null
) => number;

export interface HttpInterceptorManager<V> {
    use: V extends HttpResponse
        ? HttpResponseInterceptorUse<V>
        : HttpRequestInterceptorUse<V>;

    eject(id: number): void;

    clear(): void;
}

export class Http {
    constructor(config?: HttpRequestConfig) {
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
    defaults: Omit<HttpDefaults, "headers"> & {
        headers: HeadersDefaults & { [p: string]: AxiosHeaderValue }
    } = axios.defaults;
    instance: AxiosInstance = axios;

    interceptors: {
        request: HttpInterceptorManager<InternalAxiosRequestConfig>;
        response: HttpInterceptorManager<HttpResponse>;
    } = {
        request: axios.interceptors.request,
        response: axios.interceptors.response
    }

    /** 通用请求工具函数 */
    public request<T>(
        method: HttpRequestMethods,
        url: string,
        param?: HttpRequestConfig
    ): Promise<T> {
        const config = {
            method,
            url,
            ...param
        } as HttpRequestConfig;

        // 单独处理自定义请求/响应回调
        return new Promise((resolve, reject) => {
            this.instance
                .request(config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /** 单独抽离的`post`工具函数 */
    public post<T>(url: string, params?: HttpRequestConfig): Promise<T> {
        return this.request<T>("post", url, params);
    }

    /** 单独抽离的`get`工具函数 */
    public get<T>(url: string, params?: HttpRequestConfig): Promise<T> {
        return this.request<T>("get", url, params);
    }

    public put<T>(url: string, params?: HttpRequestConfig): Promise<T> {
        return this.request<T>("put", url, params);
    }

    public delete<T>(url: string, params?: HttpRequestConfig): Promise<T> {
        return this.request<T>("delete", url, params);
    }
}

export const http = new Http();
