declare module 'spark-md5' {
    class SparkMD5 {
        constructor();
        append(arr: string | ArrayBuffer): SparkMD5;
        end(raw?: boolean): string;

        static hash: (str: string, raw?: boolean) => string;
    }
    namespace SparkMD5 {
        /** 增量计算 ArrayBuffer 的 MD5（与 spark-md5 运行时 API 对齐）。 */
        class ArrayBuffer {
            constructor();
            append(arr: globalThis.ArrayBuffer): ArrayBuffer;
            end(raw?: boolean): string;
            reset(): ArrayBuffer;
            static hash(arr: globalThis.ArrayBuffer, raw?: boolean): string;
        }
    }
    export = SparkMD5;
}
