export function toUrlParams(obj: Record<string, any>) {
  return Object.entries(obj)
    .filter(([, value]) => value != null)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value
          .map((item, index) => encodeURIComponent(key) + '[' + index + ']=' + encodeURIComponent(item))
          .join('&')
      }
      return encodeURIComponent(key) + '=' + encodeURIComponent(value)
    })
    .join('&')
}

/** history 模式：从 location.href 取 query */
export const getQueryByNameHistory = (name: string) => {
  return new URL(location.href).searchParams.get(name)
}

/** hash 模式：从 location.hash 取 query */
export const getQueryByNameHash = (name: string) => {
  return new URLSearchParams(location.hash.split('?')[1]).get(name)
}

/** 模块加载时求值会拿到路由初始化前的快照，须每次调用现取 */
export const isHashMode = () => typeof location !== 'undefined' && location.hash !== ''

/** 先查 search 再查 hash 内 query；精确键名匹配并自动解码（曾用 includes 子串误匹配且不解码） */
export const getQueryByName = (name: string) => {
  const u = new URL(location.href)
  const v = u.searchParams.get(name)
  if (v != null) return v
  const hashQuery = u.hash.split('?')[1]
  if (hashQuery) return new URLSearchParams(hashQuery).get(name) ?? ''
  return ''
}

export const parseQueryString = function (): Record<string, string> {
  const objURL: Record<string, string> = {}
  new URLSearchParams(location.search).forEach((value, key) => {
    objURL[key] = value
  })
  return objURL
}
