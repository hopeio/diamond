export async function loading<T=any>(title:string,handler: ()=>Promise<T>) {
    uni.showLoading({
        title: title,
    })
    await handler()
    uni.hideLoading()
}

/**
 * 获取设备基础信息
 *
 * @see [uni.getDeviceInfo](https://uniapp.dcloud.net.cn/api/system/getDeviceInfo.html)
 */
export function getDeviceInfo() {
    if (uni.canIUse('getDeviceInfo') || uni.getDeviceInfo) {
        return uni.getDeviceInfo();
    } else {
        return uni.getSystemInfoSync();
    }
}

/**
 * 获取窗口信息
 *
 * @see [uni.getWindowInfo](https://uniapp.dcloud.net.cn/api/system/getWindowInfo.html)
 */
export function getWindowInfo() {
    if (uni.canIUse('getWindowInfo') || uni.getWindowInfo) {
        return uni.getWindowInfo();
    } else {
        return uni.getSystemInfoSync();
    }
}

/**
 * 获取APP基础信息
 *
 * @see [uni.getAppBaseInfo](https://uniapp.dcloud.net.cn/api/system/getAppBaseInfo.html)
 */
export function getAppBaseInfo() {
    if (uni.canIUse('getAppBaseInfo') || uni.getAppBaseInfo) {
        return uni.getAppBaseInfo();
    } else {
        return uni.getSystemInfoSync();
    }
}
