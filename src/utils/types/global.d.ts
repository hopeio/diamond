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

    type Point2D = [number, number]

    type RefType<T> = T | null;

    type EmitType = (event: string, ...args: any[]) => void;

    type TargetContext = "_self" | "_blank";

    type ComponentRef<T extends HTMLElement = HTMLDivElement> =
        ComponentElRef<T> | null;

    type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

    type ForDataType<T> = {
        [P in T]?: ForDataType<T[P]>;
    };

    type AnyFunction<T> = (...args: any[]) => T;


    type Writable<T> = {
        -readonly [P in keyof T]: T[P];
    };

    type Nullable<T> = T | null;

    type NonNullable<T> = T extends null | undefined ? never : T;

    type Recordable<T = any> = Record<string, T>;

    type ReadonlyRecordable<T = any> = {
        readonly [key: string]: T;
    };

    type Indexable<T = any> = {
        [key: string]: T;
    };

    type DeepPartial<T> = {
        [P in keyof T]?: DeepPartial<T[P]>;
    };

    type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

    type Exclusive<T, U> = (Without<T, U> & U) | (Without<U, T> & T);

    type TimeoutHandle = ReturnType<typeof setTimeout>;

    type IntervalHandle = ReturnType<typeof setInterval>;

    type Effect = "light" | "dark";

    interface ChangeEvent extends Event {
        target: HTMLInputElement;
    }

    interface WheelEvent {
        path?: EventTarget[];
    }

    interface ImportMetaEnv extends ViteEnv {
        __: unknown;
    }

    interface Fn<T = any, R = T> {
        (...arg: T[]): R;
    }

    interface PromiseFn<T = any, R = T> {
        (...arg: T[]): Promise<R>;
    }

    interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
        $el: T;
    }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
    function parseInt(s: string | number, radix?: number): number;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
    function parseFloat(string: string | number): number;
}

export {}

