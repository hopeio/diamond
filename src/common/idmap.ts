interface IdObj<T> {
    id: T
}

export function appendObjMap<K, T extends IdObj<K>>(map: Map<K, T>, objs: T[]): Map<K, T> {
    for (const obj of objs) {
        map.set(obj.id, obj)
    }
    return map
}

export class ObjMap<K, V extends IdObj<K>> {
    _map = new Map<K, V>()

    append(objs: V[]) {
        for (const obj of objs) {
            this._map.set(obj.id, obj)
        }
    }

    // 曾用非空断言把 undefined 谎报成有值，缺失键解引用直接崩
    get(id: K): V | undefined {
        return this._map.get(id)
    }

    set(id: K, v: V) {
        this._map.set(id, v)
    }

    has(key: K): boolean {
        return this._map.has(key)
    }
}
