import { expect, test } from 'vitest'
import {parseInt} from './number.js'

test('decimalTo62 1 to 1', () => {
    expect(parseInt(1,62)).toBe('1')
})
