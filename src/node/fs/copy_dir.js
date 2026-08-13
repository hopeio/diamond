import fs from 'fs'
import path from 'path'

export function copyDir(src, dest) {
    // recursive：父目录不存在时不再 ENOENT，已存在也不报错
    fs.mkdirSync(dest, { recursive: true })
    fs.readdirSync(src).forEach(
        file => {
            const srcPath = path.join(src, file)
            const destPath = path.join(dest, file)
            const stat = fs.statSync(srcPath)
            if (stat.isDirectory()) {
                copyDir(srcPath, destPath)
            } else {
                fs.copyFileSync(srcPath, destPath)
            }
        }
    )
}
