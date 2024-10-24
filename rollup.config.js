import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import glob from 'fast-glob';
import {readFileSync} from "fs";
import path from 'node:path'
import {fileURLToPath} from 'node:url';
import terser from "@rollup/plugin-terser";
import alias from "@rollup/plugin-alias";

const __filename = fileURLToPath(import.meta.url);
const packageJson = JSON.parse(readFileSync("./package.json", "utf8")); // 读取UMD全局模块名，在package中定义了
const pkgName = packageJson.name;
const __dirname = path.dirname(__filename);

const pathResolve = (p) => path.resolve(__dirname, p);
const input = glob.sync('src/**/*.(ts|js)', {ignore: [`src/**/*.test.(ts|js)`]});
const Namedinput = Object.fromEntries(
    input.map((file) => [
        // 这里将删除 `src/` 以及每个文件的扩展名。
        // 因此，例如 src/nested/foo.js 会变成 nested/foo
        path.relative(
            'src',
            file.slice(0, file.length - path.extname(file).length)
        ),
        // 这里可以将相对路径扩展为绝对路径，例如
        // src/nested/foo 会变成 /project/src/nested/foo.js
        fileURLToPath(new URL(file, import.meta.url))
    ])
)


const plugin = [
    resolve(),
    commonjs({
        include: /node_modules/
    }),

    alias({
        entries: {
            "@": pathResolve("src"),
            _: __dirname,
        }
    }),
    json(),
];

function plugins(mode) {
    let config = "./tsconfig.json";
    if (mode && mode !== "") {
        config = `./tsconfig.${mode}.json`;
    }
    return [...plugin, typescript({
        tsconfig: config
    })]
}

export default [{
    input: Namedinput,
    output: [/*{
        dir: "es",
        format: "esm",
        entryFileNames: '[name].mjs'
        //preserverModules:true
    },*/
    {
        dir: "es",
        format: "esm",
        //preserverModules:true
    }],
    plugins: plugins('esm'),
    external: id => /node_modules/.test(id)
},
    {
        input: Namedinput,
        output: [/*{
            dir: "cjs",
            format: "cjs",
            entryFileNames: '[name].cjs'
            //preserverModules:true
        },*/
        {
            dir: "cjs",
            format: "cjs",
            //preserverModules:true
        }],
        plugins: plugins('cjs'),
        external: id => /node_modules/.test(id)
    },
    {
        input: "src/index.ts",
        context:'window',
        output: [{
            file: "dist/umd.js",
            format: "umd",
            name: pkgName,
            globals: {
                // 配置依赖中的UMD全局变量名
                "event-message-center": "MessageCenter",
                "task-queue-lib": "TaskQueue",
            },
            //sourcemap: true, // 生成 source map（可选）
            //sourcemap: true, // 生成 source map（可选）
        },
        {
            file: "dist/amd.js",
            format: "amd",
        },
        {
            file: "dist/iife.js",
            format: "iife",
            name: pkgName,
        }],
        plugins: [resolve({browser:true}),typescript({
            tsconfig: "./tsconfig.json"
        }) ,terser()],
        external: []
    }
];