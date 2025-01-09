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
    interface Window {
        wx: any;
        WeixinJSBridge: any;
        __wxjs_environment: string;
    }

    interface Point {
        x: number
        y: number
    }

    type Point2D = [number, number];
}

export {}

