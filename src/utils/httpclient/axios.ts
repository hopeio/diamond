import axios, {
    type AxiosInstance,
    type AxiosError,
    type AxiosResponse,
    type Method,
    type HeadersDefaults,
    type AxiosInterceptorOptions, type AxiosRequestConfig, type AxiosRequestHeaders,
    type AxiosHeaderValue,
} from "axios";



export interface Error extends AxiosError {
    isCancelRequest?: boolean;
}

export  interface Response extends AxiosResponse {
    config: InternalRequestConfig;
}

interface InternalRequestConfig extends RequestConfig {
    headers: AxiosRequestHeaders;
}

export interface RequestConfig extends AxiosRequestConfig {
    decode?: (input: Uint8Array, length?: number) => any
    stream?: (input: ReadableStream<Uint8Array<ArrayBuffer>> | null) => Promise<any>
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
        config?: RequestConfig
    ): Promise<T> {
        if (!config) {
            config = {method: method, url: url};
        } else {
            config.method = method;
            config.url = url;
        }

        // 单独处理自定义请求/响应回调
        return new Promise((resolve, reject) => {
            this.instance
                .request(config)
                .then(response => {
                    switch (response.config.responseType) {
                        case 'arraybuffer':
                            if (config!.decode){
                                resolve(config!.decode(new Uint8Array(response.data)));
                                return
                            }
                            break
                        case 'stream':
                            if (config!.stream){
                                resolve(config!.stream(response.data))
                                return
                            }
                            break
                    }
                    resolve(response.data);
                }).catch((err: Error) => {
                    reject(err);
                });
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
