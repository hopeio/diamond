import { describe, expect, test } from 'vitest'
import { toDayjs, dateTimeToDayjs } from './time'
import dateTool from './date'

describe('time parse', () => {
    test('自定义格式解析生效（customParseFormat 已注册）', () => {
        const d = dateTimeToDayjs('2023-01-02 15:04:05')
        expect(d.isValid()).toBe(true)
        expect(d.year()).toBe(2023)
        expect(d.hour()).toBe(15)
    })
    test('Go RFC3339Nano 纳秒截断后可解析', () => {
        const d = toDayjs('2023-01-02 15:04:05.123456789+08:00')
        expect(d.isValid()).toBe(true)
        expect(d.millisecond()).toBe(123)
    })
    test('dateTool.parse 支持 T 分隔与纳秒', () => {
        expect(dateTool.parse('2023-01-02T15:04:05.123456789+08:00').isValid()).toBe(true)
        expect(dateTool.parse('2023-01-02 15:04:05+08:00').isValid()).toBe(true)
    })
})

describe('getReplyTime', () => {
    test('超过 7 天返回格式化字符串而非 Dayjs 对象', () => {
        const old = new Date(Date.now() - 30 * 24 * 3600 * 1000)
        const y = old.getFullYear()
        const m = String(old.getMonth() + 1).padStart(2, '0')
        const day = String(old.getDate()).padStart(2, '0')
        const input = `${y}-${m}-${day} 12:00:00+08:00`
        const result = dateTool.getReplyTime(input)
        expect(typeof result).toBe('string')
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
    test('一分钟内返回 刚刚', () => {
        const now = new Date()
        const pad = (n: number) => String(n).padStart(2, '0')
        const input = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
        expect(dateTool.getReplyTime(input)).toBe('刚刚')
    })
})
