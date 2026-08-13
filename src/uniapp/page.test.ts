import { describe, expect, test } from 'vitest'
import { PageHelper, ensureDecodeURIComponent, getUrlObj } from './page'

describe('getUrlObj', () => {
    test('无 query 不崩溃', () => {
        expect(getUrlObj('/pages/login/index')).toEqual({ path: '/pages/login/index', query: {} })
    })
    test('常规 query 解析并解码', () => {
        const { path, query } = getUrlObj('/pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor')
        expect(path).toBe('/pages/login/index')
        expect(query.redirect).toBe('/pages/demo/base/route-interceptor')
    })
    test('仅 key 无值、空段不崩溃', () => {
        const { query } = getUrlObj('/p?flag&&a=1')
        expect(query.flag).toBe('')
        expect(query.a).toBe('1')
    })
    test('值内 = 保留', () => {
        const { query } = getUrlObj('/p?redirect=a=b')
        expect(query.redirect).toBe('a=b')
    })
})

describe('ensureDecodeURIComponent', () => {
    test('多重编码逐层解码', () => {
        expect(ensureDecodeURIComponent('%252Fpages%252Fa')).toBe('/pages/a')
    })
    test('中间编码也解码', () => {
        expect(ensureDecodeURIComponent('hello%20world')).toBe('hello world')
    })
    test('%25 解出 % 不抛错', () => {
        expect(ensureDecodeURIComponent('%25')).toBe('%')
    })
})

describe('PageHelper', () => {
    const pagesJson = {
        pages: [
            { path: 'pages/index/index' },
            { path: 'pages/mine/index', needLogin: true },
        ],
        subPackages: [
            { root: 'pages-sub', pages: [{ path: 'wopan/list', needLogin: true }, { path: 'about/index' }] },
        ],
    }
    test('needLoginPages 是 path 字符串数组（守卫可用）', () => {
        const helper = new PageHelper(pagesJson)
        expect(helper.needLoginPages).toEqual(['/pages/mine/index', '/pages-sub/wopan/list'])
    })
    test('拦截器对需登录页返回 false 并跳登录', () => {
        const nav: string[] = []
        ;(globalThis as any).uni = { navigateTo: (o: any) => nav.push(o.url) }
        const helper = new PageHelper(pagesJson)
        const interceptor = helper.navigateToInterceptor('/pages/login/index', () => false)
        expect(interceptor.invoke({ url: '/pages-sub/wopan/list?x=1' })).toBe(false)
        expect(nav[0]).toContain('/pages/login/index?back=')
        expect(interceptor.invoke({ url: '/pages/index/index' })).toBe(true)
        delete (globalThis as any).uni
    })
    test('无 subPackages 不崩溃', () => {
        const helper = new PageHelper({ pages: [{ path: 'pages/a', needLogin: true }] })
        expect(helper.needLoginPages).toEqual(['/pages/a'])
    })
})
