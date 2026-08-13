import { describe, expect, test } from 'vitest'
import { compareVersion } from './version'
import { getCookie } from './cookie'
import { arrayToMap, arrayToMapArrValue } from './array'
import { extractPathList, handleTree } from './tree'
import { Validator } from './validator'
import { copypropertyIfNotExist } from './object'
import { toUrlParams } from './url'

describe('compareVersion', () => {
    test('不等长版本串不再死循环且比较正确', () => {
        expect(compareVersion('1.0.0', '2.0')).toBe(-1)
        expect(compareVersion('2.0', '1.0.0')).toBe(1)
        expect(compareVersion('1.0.0', '1.0')).toBe(0)
        expect(compareVersion('1.2', '1.10')).toBe(-1)
        expect(compareVersion('1.10.1', '1.10.1')).toBe(0)
    })
})

describe('getCookie', () => {
    test('带前导空格的后续 cookie 可读取', () => {
        expect(getCookie('b', 'a=1; b=2')).toBe('2')
        expect(getCookie('a', 'a=1; b=2')).toBe('1')
        expect(getCookie('c', 'a=1; b=2')).toBe('')
    })
    test('值解码且非法编码不抛错', () => {
        expect(getCookie('n', 'n=a%20b')).toBe('a b')
        expect(getCookie('n', 'n=%E0%A4%A')).toBe('%E0%A4%A')
    })
    test('同前缀键名不误匹配', () => {
        expect(getCookie('id', 'userid=9; id=1')).toBe('1')
    })
})

describe('arrayToMap', () => {
    test('值为单个对象且重复 key 覆盖', () => {
        const m = arrayToMap([{ id: 1, v: 'a' }, { id: 1, v: 'b' }, { id: 2, v: 'c' }], (x) => x.id)
        expect(m.get(1)).toEqual({ id: 1, v: 'b' })
        expect(m.get(2)).toEqual({ id: 2, v: 'c' })
    })
    test('arrayToMapArrValue 分组', () => {
        const m = arrayToMapArrValue([{ id: 1, v: 'a' }, { id: 1, v: 'b' }], (x) => x.id)
        expect(m.get(1)).toHaveLength(2)
    })
})

describe('tree', () => {
    test('extractPathList 包含子树节点', () => {
        const paths = extractPathList([
            { uniqueId: '0', children: [{ uniqueId: '0-0', children: [{ uniqueId: '0-0-0' }] }] },
            { uniqueId: '1' },
        ])
        expect(paths).toEqual(['0', '0-0', '0-0-0', '1'])
    })
    test('handleTree 叶子节点不写入 children: undefined', () => {
        const tree = handleTree([
            { id: 1, parentId: null },
            { id: 2, parentId: 1 },
        ])
        expect(tree).toHaveLength(1)
        expect('children' in tree[0].children[0]).toBe(false)
    })
})

describe('Validator', () => {
    test('邮箱域名点必须是点', () => {
        expect(Validator.mail('user@domain.com')).toBe(true)
        expect(Validator.mail('user@domainXcom')).toBe(false)
        expect(Validator.mail('a.b_c@mail.example.online')).toBe(true)
    })
    test('解构后可直接调用', () => {
        const { phone, mail } = Validator
        expect(phone('13800138000')).toBe(true)
        expect(mail('a@b.cn')).toBe(true)
    })
    test('恶意长串快速返回（无 ReDoS）', () => {
        const start = Date.now()
        Validator.mail('a'.repeat(64) + '!')
        expect(Date.now() - start).toBeLessThan(50)
    })
})

describe('object/url', () => {
    test('copypropertyIfNotExist 支持无原型对象', () => {
        const dst = Object.create(null)
        copypropertyIfNotExist(dst, { a: 1 })
        expect(dst.a).toBe(1)
    })
    test('toUrlParams 跳过 null/undefined', () => {
        expect(toUrlParams({ a: 1, b: undefined, c: null, d: 'x' })).toBe('a=1&d=x')
    })
})
