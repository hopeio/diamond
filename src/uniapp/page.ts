
/**
 * 获取当前页面路由的 path 路劲和 redirectPath 路径
 * path 如 ‘/pages/login/index’
 * redirectPath 如 ‘/pages/demo/base/route-interceptor’
 */
export const currRoute = () => {
    // getCurrentPages() 至少有1个元素，所以不再额外判断
    const lastPage = getCurrentPages().at(-1)
    const currRoute = (lastPage as any).$page
    // console.log('lastPage.$page:', currRoute)
    // console.log('lastPage.$page.fullpath:', currRoute.fullPath)
    // console.log('lastPage.$page.options:', currRoute.options)
    // console.log('lastPage.options:', (lastPage as any).options)
    // 经过多端测试，只有 fullPath 靠谱，其他都不靠谱
    const {fullPath} = currRoute as { fullPath: string }
    console.log(fullPath)
    // eg: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor (小程序)
    // eg: /pages/login/index?redirect=%2Fpages%2Froute-interceptor%2Findex%3Fname%3Dfeige%26age%3D30(h5)
    return getUrlObj(fullPath)
}

export function ensureDecodeURIComponent(url: string){
    if (url.startsWith('%')) {
        return ensureDecodeURIComponent(decodeURIComponent(url))
    }
    return url
}
/**
 * 解析 url 得到 path 和 query
 * 比如输入url: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor
 * 输出: {path: /pages/login/index, query: {redirect: /pages/demo/base/route-interceptor}}
 */
export const getUrlObj = (url: string) => {
    const [path, queryStr] = url.split('?')
    console.log(path, queryStr)

    const query: Record<string, string> = {}
    queryStr.split('&').forEach((item) => {
        const [key, value] = item.split('=')
        console.log(key, value)
        query[key] = ensureDecodeURIComponent(value) // 这里需要统一 decodeURIComponent 一下，可以兼容h5和微信y
    })
    return {path, query}
}

export class PageHelper {
    constructor(pagesJson: any) {
        this.pagesJson = pagesJson
        this.needLoginPages = this.getAllPages('needLogin')
    }

    pagesJson: any


    /** 判断当前页面是否是tabbar页  */
    public isTabbar() {
        if (!this.pagesJson.tabBar) {
            return false
        }
        if (!this.pagesJson.tabBar.list.length) {
            // 通常有tabBar的话，list不能有空，且至少有2个元素，这里其实不用处理
            return false
        }
        // getCurrentPages() 至少有1个元素，所以不再额外判断
        const lastPage = getCurrentPages().at(-1)
        const currPath = lastPage?.route
        return !!this.pagesJson.tabBar.list.find((e:any) => e.pagePath === currPath)
    }


    /**
     * 得到所有的需要登录的pages，包括主包和分包的
     * 只得到 path 数组
     */
    public needLoginPages: string[]
    private getNeedLoginPages = (): string[] => this.getAllPages('needLogin').map((page) => page.path)
    /**
     * 得到所有的需要登录的pages，包括主包和分包的
     * 这里设计得通用一点，可以传递key作为判断依据，默认是 needLogin, 与 route-block 配对使用
     * 如果没有传 key，则表示所有的pages，如果传递了 key, 则表示通过 key 过滤
     */
    public getAllPages(key = 'needLogin') {
        // 这里处理主包
        const mainPages = [
            ...this.pagesJson.pages
                .filter((page:any) => !key || page[key])
                .map((page:any) => ({
                    ...page,
                    path: `/${page.path}`,
                })),
        ]
        // 这里处理分包
        const subPages: any[] = []
        this.pagesJson.subPackages.forEach((subPageObj:any) => {
            // console.log(subPageObj)
            const {root} = subPageObj

            subPageObj.pages
                .filter((page:any) => !key || page[key])
                .forEach((page: { path: string } & Record<string, any>) => {
                    subPages.push({
                        ...page,
                        path: `/${root}/${page.path}`,
                    })
                })
        })
        const result = [...mainPages, ...subPages]
        console.log(`getAllPages by ${key} result: `, result)
        return result
    }

    public navigateToInterceptor(loginRoute: string, isLogined: () => boolean, isDev = false) {
        let needLoginPages = this.needLoginPages
        const getNeedLoginPages = this.getNeedLoginPages
        return {
            // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
            invoke({url}: { url: string }) {
                if (url.startsWith(loginRoute)) {
                    return true
                }
                // console.log(url) // /pages/route-interceptor/index?name=feige&age=30
                const path = url.split('?')[0]
                // 为了防止开发时出现BUG，这里每次都获取一下。生产环境可以移到函数外，性能更好
                if (isDev) {
                    needLoginPages = getNeedLoginPages()
                }
                const isNeedLogin = needLoginPages.includes(path)
                if (!isNeedLogin) {
                    return true
                }
                const hasLogin = isLogined()
                if (hasLogin) {
                    return true
                }
                const redirectRoute = `${loginRoute}?back=${encodeURIComponent(url)}`
                uni.navigateTo({url: redirectRoute})
                return false
            }
        }
    }
}
