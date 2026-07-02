import {defineConfig} from "vite";
import fs from "fs";
import path from "node:path";
import dts from 'vite-plugin-dts'
import {nodePolyfills} from 'vite-plugin-node-polyfills'


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
    dayjs: 'dayjs'
}

export default defineConfig({
    plugins: [
        dts({
            outDir: "dist",
            entryRoot: 'src',
            tsconfigPath: 'tsconfig.json',
            // 声明产物只覆盖 src 且排除测试；与 tsconfig 的 include 解耦，
            // 避免为 vite.config.ts / 测试文件生成多余 .d.ts。
            include: ['src/**/*'],
            exclude: [
                'src/test/**',
                '**/test.ts',
                '**/test.js',
                '**/*.test.ts',
                '**/*.test.js',
            ],
            //rollupTypes: true,
            copyDtsFiles: true,
            beforeWriteFile: (filePath: string, content: string) => {
                const outDirAbs = path.resolve(__dirname, 'dist');
                if (!filePath.startsWith(outDirAbs)) {
                    const entryRootAbs = path.resolve(__dirname, 'src');
                    if (filePath.startsWith(entryRootAbs)) {
                        return { filePath: outDirAbs + filePath.slice(entryRootAbs.length), content };
                    }
                }
            }
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
            entry: getEntries('src'),
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



