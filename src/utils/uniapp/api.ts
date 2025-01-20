export async function loading<T=any>(title:string,handler: ()=>Promise<T>) {
    uni.showLoading({
        title: title,
    })
    await handler()
    uni.hideLoading()
}