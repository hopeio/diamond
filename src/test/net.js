// 草稿：XHR 版实现（与 browser/net.ts 同款；ontimeout 必须补上否则超时永久 pending）
export function supportIPv6xhr(url){
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.timeout = 5000;
        xhr.onreadystatechange = (e) => {
            console.log(e)
            if (xhr.readyState === 4 && xhr.status !== 0) { // 请求完成
                resolve(true)
            }
        };
        xhr.onerror = (e) => {
            console.log(e)
            resolve(false)
        };
        xhr.ontimeout = () => {
            resolve(false)
        };
        xhr.send();
    })
}
function supportIPv6(url) {
    return  fetch(url,{
        method: 'HEAD',
        mode: 'cors'
    }).then(res => {
        console.log(res)
        return true
    }).catch(err => {
        console.log(err)
        return false
    })
}

supportIPv6("https://mng.feixiang.xyz:6790").then(v => {console.log(v)})
