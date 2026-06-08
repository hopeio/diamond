export function toUrlParams(obj: Record<string, any>) {
    return Object.entries(obj)
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return value
                    .map((item, index) => encodeURIComponent(key) + '[' + index + ']=' + encodeURIComponent(item))
                    .join('&');
            } else {
                return encodeURIComponent(key) + '=' + encodeURIComponent(value);
            }
        })
        .join('&');
}