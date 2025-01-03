
import qs from 'qs'
import type {ResData} from "@/utils/types";

type IUniUploadFileOptions = {
    file?: File
    files?: UniApp.UploadFileOptionFiles[]
    filePath?: string
    name?: string
    formData?: any
}

export type CustomRequestOptions = UniApp.RequestOptions & {
    query?: Record<string, any>
    /** 出错时是否隐藏错误提示 */
    hideErrorToast?: boolean
} & IUniUploadFileOptions // 添加uni.uploadFile参数类型
export const http = <T>(options: CustomRequestOptions) => {
    if (options.query) {
        const queryStr = qs.stringify(options.query)
        if (options.url.includes('?')) {
            options.url += `&${queryStr}`
        } else {
            options.url += `?${queryStr}`
        }
    }
    // 1. 返回 Promise 对象
    return new Promise<ResData<T>>((resolve, reject) => {
        uni.request({
            ...options,
            dataType: 'json',
            // #ifndef MP-WEIXIN
            responseType: 'json',
            // #endif
            // 响应成功
            success(res) {
                // 状态码 2xx，参考 axios 的设计
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    // 2.1 提取核心数据 res.data
                    resolve(res.data as ResData<T>)
                } else if (res.statusCode === 401) {
                    // 401错误  -> 清理用户信息，跳转到登录页
                    // userStore.clearUserInfo()
                    // uni.navigateTo({ url: '/pages/user/login' })
                    reject(res)
                } else {
                    // 其他错误 -> 根据后端错误信息轻提示
                    !options.hideErrorToast &&
                    uni.showToast({
                        icon: 'none',
                        title: (res.data as ResData<T>).msg || '请求错误',
                    })
                    reject(res)
                }
            },
            // 响应失败
            fail(err) {
                uni.showToast({
                    icon: 'none',
                    title: '网络错误，换个网络试试',
                })
                reject(err)
            },
        })
    })
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @returns
 */
export const httpGet = <T>(url: string, query?: Record<string, any>) => {
    return http<T>({
        url,
        query,
        method: 'GET',
    })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @returns
 */
export const httpPost = <T>(
    url: string,
    data?: Record<string, any>,
    query?: Record<string, any>,
) => {
    return http<T>({
        url,
        query,
        data,
        method: 'POST',
    })
}

http.get = httpGet
http.post = httpPost
