import {defineConfig} from "vite";
import vue from '@vitejs/plugin-vue'
import fs from "fs";
import path from "node:path";
import dts from 'vite-plugin-dts'
import {nodePolyfills} from 'vite-plugin-node-polyfills'

function getEntries(...dirs: string[]) {
    const entries = {};
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

const pathResolve = (p) => path.resolve(__dirname, p);


const globals = {
    'spark-md5': 'SparkMD5', // 告诉Rollup全局变量名
    dayjs: 'dayjs',
    vue: 'Vue',
}

export default defineConfig({
    plugins: [
        vue(),
        dts({
            outDir: "dist",
            tsconfigPath: './tsconfig.utils.json',
            //rollupTypes: true,
            copyDtsFiles: true
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
            "@": pathResolve("src"),
            _: __dirname,
        }
    },
    build: {
        outDir: "dist",
        lib: {
            entry: getEntries("src"),
            name: "diamond",
            formats: ["es", "cjs"],
            fileName: (format) => `[name].${format}.js`
        },
        commonjsOptions: {
            include: [/node_modules/],
        },
        //minify: 'terser',
        rollupOptions: {
            input: getEntries('src/utils'),
            external: id => /node_modules/.test(id) || ["http", "fs", "crypto"].includes(id),
            output: {
                dir: 'dist',
                globals,
                entryFileNames: "[name].[format].js",
                chunkFileNames: "[name]-[hash].js",
                assetFileNames: "[name].[ext]",
                exports: "named"
            }
        }

    }
})



