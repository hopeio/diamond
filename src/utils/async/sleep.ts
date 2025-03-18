export function sleep(delay:number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, delay);
    })
}
