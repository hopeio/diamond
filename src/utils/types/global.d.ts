declare global {
    interface Date {
        format(fmt: string): string;
    }

    /**
     * 平台的名称、版本、运行所需的`node`和`pnpm`版本、依赖、最后构建时间的类型提示
     */
    const __APP_INFO__: {
        pkg: {
            name: string;
            version: string;
            engines: {
                node: string;
                pnpm: string;
            };
            dependencies: Recordable<string>;
            devDependencies: Recordable<string>;
        };
        lastBuildTime: string;
    };
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

    interface Document {
        webkitFullscreenElement?: Element;
        mozFullScreenElement?: Element;
        msFullscreenElement?: Element;
    }

    interface Window {
        wx: any;
        WeixinJSBridge: any;
        __wxjs_environment: string;
        __APP__: App<Element>;
        webkitCancelAnimationFrame: (handle: number) => void;
        mozCancelAnimationFrame: (handle: number) => void;
        oCancelAnimationFrame: (handle: number) => void;
        msCancelAnimationFrame: (handle: number) => void;
        webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
        mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
        oRequestAnimationFrame: (callback: FrameRequestCallback) => number;
        msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    }

    interface Point {
        x: number
        y: number
    }

    type Point2D = [number, number];
}

export {}

