import { expect, test } from 'vitest'
import {client,Channel,QueryAllFiles,SpaceType} from './index'



test('decrypt', () => {
    expect(client.decrypt('',Channel.APIUser)).toBe('1')
})

test('encrypt', () => {
    expect(client.encrypt('',Channel.APIUser)).toBe('1')
})

test('encrypt', () => {
    expect(QueryAllFiles(SpaceType.Private,'0',1,10,0,'')).toBe('1')
})