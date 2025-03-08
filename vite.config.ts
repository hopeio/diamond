import {defineConfig} from "vite";
import vue from '@vitejs/plugin-vue'
import fs from "fs";
import path from "node:path";
import dts from 'vite-plugin-dts'
import vueJsx from "@vitejs/plugin-vue-jsx";
import {nodePolyfills} from 'vite-plugin-node-polyfills'
import tailwindcss from '@tailwindcss/vite';

function getEntries(...dirs: string[]) {
    const entries: Record<string, string> = {};
    const index = ["index.ts", "index.js"]
    for (const dir of dirs) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = dir + "/" + file;
            if (fs.statSync(fullPath).isDirectory()) {
                const entryFile = fs.readdirSync(fullPath).find(f => index.includes(f))
                if (entryFile) {
                    entries[file] = path.resolve(fullPath, entryFile);
                }
            } else if (index.includes(file)) {
                entries[path.basename(dir)] = path.resolve(dir, file);
            }
        });
    }
    return entries;
}

function getExternal(): string[] {
    const dir = "node_modules"
    let external: string[] = ["http", "fs", "crypto"]
    const files = fs.readdirSync(dir)
    files.forEach(file => {
        const fullPath = dir + "/" + file;
        if (fs.statSync(fullPath).isDirectory()) {
            if (file.startsWith("@")) {
                external = external.concat(fs.readdirSync(fullPath).map(f => file + '/' + f))
            } else {
                external.push(file)
            }
        }

    });
    return external
}


const globals = {
    'spark-md5': 'SparkMD5', // 告诉Rollup全局变量名
    dayjs: 'dayjs',
    vue: 'Vue',
    'element-plus': "ElementPlus",
    '@pure-admin/table': "PureTable"
}

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        tailwindcss(),
        dts({
            outDir: "dist",
            entryRoot:'src/utils',
            tsconfigPath: 'tsconfig.utils.json',
            //rollupTypes: true,
            copyDtsFiles: true
        }),
        dts({
            outDir: "dist",
            entryRoot:'src/vue',
            tsconfigPath: 'tsconfig.vue.json',
            //rollupTypes: true,
            copyDtsFiles: false
        }),
        nodePolyfills({
            exclude: [
                'http', // Excludes the polyfill for `http` and `node:http`.
                'crypto',
                'fs'
            ],
            globals: {
                Buffer: true, // can also be 'build', 'dev', or false
                global: true,
                process: true,
            },
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    build: {
        outDir: "dist",
        lib: {
            entry: getEntries('src/utils', 'src/vue'),
            name: "@hopeio/utils",
            formats: ["es", "cjs"],
        },
        //minify: 'terser',
        rollupOptions: {
            external: getExternal(),
            output: {
                dir: 'dist',
                globals,
                entryFileNames: "[name].[format].js",
                chunkFileNames: "[name]-[hash].js",
                assetFileNames: (assetInfo) => {
                    if (assetInfo.names[0].endsWith('.css')) {
                        return 'index.css';
                    }
                    return `[name].[ext]`;
                },
                exports: "named"
            }
        }

    }
})



