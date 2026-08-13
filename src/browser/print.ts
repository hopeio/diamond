// @ts-nocheck — 历史构造函数风格，保留运行时行为
interface PrintFunction {
    extendOptions: Function;
    getStyle: Function;
    setDomHeight: Function;
    toPrint: Function;
}

const Print = function (dom: string|HTMLElement, options?: object): PrintFunction {
    options = options || {};
    // @ts-expect-error
    if (!(this instanceof Print)) return new Print(dom, options);
    this.conf = {
        styleStr: "",
        // Elements that need to dynamically get and set the height
        setDomHeightArr: [],
        // Callback before printing
        printBeforeFn: null,
        // Callback after printing
        printDoneCallBack: null
    };
    for (const key in this.conf) {
        if (key && options.hasOwnProperty(key)) {
            this.conf[key] = options[key];
        }
    }
    if (typeof dom === "string") {
        this.dom = document.querySelector(dom);
    } else {
        this.dom = this.isDOM(dom) ? dom : dom && dom.$el;
    }
    // 未命中时深处 outerHTML 才崩，报错信息不可读；这里前置校验
    if (!this.dom) {
        throw new Error(`Print: target element not found (${typeof dom === "string" ? dom : dom})`);
    }
    this._heightRestore = [];
    if (this.conf.setDomHeightArr && this.conf.setDomHeightArr.length) {
        this.setDomHeight(this.conf.setDomHeightArr);
    }
    this.init();
};

Print.prototype = {
    /**
     * init
     */
    init: function (): void {
        const content = this.getStyle() + this.getHtml();
        this.writeIframe(content);
    },
    /**
     * Configuration property extension
     * @param {Object} obj
     * @param {Object} obj2
     */
    extendOptions: function <T>(obj:T, obj2: T): T {
        for (const k in obj2) {
            obj[k] = obj2[k];
        }
        return obj;
    },
    /**
     Copy all styles of the original page
     */
    getStyle: function (): string {
        let str = "";
        const styles: NodeListOf<Element> = document.querySelectorAll("style,link");
        for (let i = 0; i < styles.length; i++) {
            str += styles[i].outerHTML;
        }
        // styleStr 含 </style> 时会截断样式块，后续内容被当 HTML 执行（注入）
        const safeStyle = String(this.conf.styleStr ?? "").replace(/<\/style/gi, "<\\/style");
        str += `<style>.no-print{display:none;}${safeStyle}</style>`;
        return str;
    },
    // form assignment
    getHtml: function (): Element {
        // 只处理打印目标内的控件；曾对整页 input/select/textarea/canvas 做写操作，污染全站状态
        const root: HTMLElement = this.dom;
        const inputs = root.querySelectorAll("input");
        const selects = root.querySelectorAll("select");
        const textareas = root.querySelectorAll("textarea");
        const canvass = root.querySelectorAll("canvas");

        for (let k = 0; k < inputs.length; k++) {
            if (inputs[k].type == "checkbox" || inputs[k].type == "radio") {
                if (inputs[k].checked) {
                    inputs[k].setAttribute("checked", "checked");
                } else {
                    inputs[k].removeAttribute("checked");
                }
            } else {
                inputs[k].setAttribute("value", inputs[k].value);
            }
        }

        for (let k2 = 0; k2 < textareas.length; k2++) {
            if (textareas[k2].type == "textarea") {
                // textContent 自动转义；innerHTML 直写时值内 </textarea> 会打断文档结构（注入）
                textareas[k2].textContent = textareas[k2].value;
            }
        }

        for (let k3 = 0; k3 < selects.length; k3++) {
            if (selects[k3].type == "select-one") {
                const child = selects[k3].children;
                for (const i in child) {
                    if (child[i].tagName == "OPTION") {
                        if ((child[i] as any).selected == true) {
                            child[i].setAttribute("selected", "selected");
                        } else {
                            child[i].removeAttribute("selected");
                        }
                    }
                }
            }
        }

        for (let k4 = 0; k4 < canvass.length; k4++) {
            const imageURL = canvass[k4].toDataURL("image/png");
            const img = document.createElement("img");
            img.src = imageURL;
            img.setAttribute("style", "max-width: 100%;");
            img.className = "isNeedRemove";
            canvass[k4].parentNode.insertBefore(img, canvass[k4].nextElementSibling);
        }

        return this.dom.outerHTML;
    },
    /**
     create iframe
     */
    writeIframe: function (content) {
        const iframe: HTMLIFrameElement = document.createElement("iframe");
        const f: HTMLIFrameElement = document.body.appendChild(iframe);
        iframe.setAttribute(
            "style",
            "position:absolute;width:0;height:0;top:-10px;left:-10px;"
        );

        const w = f.contentWindow || f.contentDocument;
        const doc = f.contentDocument || f.contentWindow.document;

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this = this;
        let cleaned = false;
        const cleanup = function (): void {
            if (cleaned) return;
            cleaned = true;
            _this._restoreDomHeight();
            if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
            }
            if (_this.conf.printDoneCallBack) {
                _this.conf.printDoneCallBack();
            }
        };
        // onload 必须在写文档前绑定；同步 write 时部分环境 load 事件先于赋值触发，回调整体丢失
        iframe.onload = function (): void {
            // Before popping, callback
            if (_this.conf.printBeforeFn) {
                _this.conf.printBeforeFn({ doc });
            }
            _this.toPrint(w);
            // 打印对话框关闭后再清理；曾固定 100ms 移除 iframe，Safari 等非阻塞环境预览直接空白
            if (w && typeof w.addEventListener === "function") {
                w.addEventListener("afterprint", function () {
                    setTimeout(cleanup, 0);
                }, { once: true });
            }
            // 兜底：部分环境不触发 afterprint
            setTimeout(cleanup, 60_000);
        };

        doc.open();
        doc.write(content);
        doc.close();

        const removes = document.querySelectorAll(".isNeedRemove");
        for (let k = 0; k < removes.length; k++) {
            removes[k].parentNode.removeChild(removes[k]);
        }
    },
    /**
     Print
     */
    toPrint: function (frameWindow:Window): void {
        try {
            setTimeout(function () {
                frameWindow.focus();
                try {
                    if (!frameWindow.document.execCommand("print", false)) {
                        frameWindow.print();
                    }
                } catch {
                    frameWindow.print();
                }
                frameWindow.close();
            }, 10);
        } catch (err) {
            console.error(err);
        }
    },
    isDOM:
        typeof HTMLElement === "object"
            ? function (obj:object) {
                return obj instanceof HTMLElement;
            }
            : function (obj:object) {
                return (
                    obj &&
                    typeof obj === "object" &&
                    obj.nodeType === 1 &&
                    typeof obj.nodeName === "string"
                );
            },
    /**
     * Set the height of the specified dom element by getting the existing height of the dom element and setting
     * @param {Array} arr
     */
    setDomHeight(arr:Array<any>) {
        if (arr && arr.length) {
            arr.forEach(name => {
                const domArr = document.querySelectorAll(name);
                domArr.forEach(dom => {
                    // 记录原 inline 高度，打印结束后恢复；曾永久写死导致布局锁死
                    this._heightRestore.push([dom, dom.style.height]);
                    dom.style.height = dom.offsetHeight + "px";
                });
            });
        }
    },
    _restoreDomHeight() {
        for (const [dom, height] of this._heightRestore) {
            dom.style.height = height;
        }
        this._heightRestore = [];
    }
};

export default Print;
