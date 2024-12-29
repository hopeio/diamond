declare module 'spark-md5' {
    const md5: {
        hash: (str: string, raw?: boolean) => string;
        // 添加其他必要的成员
    };
    export = md5;
}
