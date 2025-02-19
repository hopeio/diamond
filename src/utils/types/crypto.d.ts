declare module 'spark-md5' {
    class SparkMD5 {
        constructor();
        append(arr: ArrayBuffer): void;
        end(raw?: boolean): string;

        static hash: (str: string, raw?: boolean) => string;
    }
    export = SparkMD5;
}
