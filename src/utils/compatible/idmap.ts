interface IdObj<T> {
    id: T
}

export function appendObjMap<T extends IdObj<any>>(map: Map<number, T>, objs: T[]): Map<number, T> {
    for (const obj of objs) {
        map.set(obj.id, obj)
    }
    return map
}

export class ObjMap<K, V extends IdObj<any>> {
    _map = new Map<K, V>()

    append(objs: V[]) {
        for (const obj of objs) {
            this._map.set(obj.id, obj)
        }
    }

    get(id: K): IdObj<any> {
        return this._map.get(id)!
    }

    set(id: K, v: V) {
        this._map.set(id, v)
    }

    has(key: K): boolean {
        return this._map.has(key)
    }
}
