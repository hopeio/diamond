export function toUrlParams(obj: Record<string, any>) {
  return Object.entries(obj)
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

export const isHashMode = typeof location !== 'undefined' && location.hash !== ''

export const getQueryByName = (name: string) => {
  const queryList = location.href.split('?')[1]?.split('&') || []
  const curQuery = queryList.find((item) => item.includes(name))
  return curQuery?.split('=')[1] || ''
}

export const parseQueryString = function (): Record<string, string> {
  const str = location.search
  const objURL: Record<string, string> = {}
  str.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), (_m, key, _eq, val) => (objURL[key] = val))
  return objURL
}
