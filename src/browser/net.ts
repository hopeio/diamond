export function supportIPv6(url: string): Promise<boolean> {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', url, true);
        xhr.timeout = 5000;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status !== 0) { // 请求完成
                resolve(true)
            }
        };
        xhr.onerror = () => {
            resolve(false)
        };
        // 超时后 readyState===4 且 status===0，上面的分支不会 resolve；不补 ontimeout 会永久 pending
        xhr.ontimeout = () => {
            resolve(false)
        };

        xhr.send();
    })
}
