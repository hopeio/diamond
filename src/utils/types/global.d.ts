declare global {
    interface Date {
        format(fmt: string): string;
    }

    /**
     * 扩展 `Element`
     */
    interface Element {
// v-ripple 作用于 src/directives/ripple/index.ts 文件
        _ripple?: {
            enabled?: boolean;
            centered?: boolean;
            class?: string;
            circle?: boolean;
            touched?: boolean;
        };
    }

}

export {}

