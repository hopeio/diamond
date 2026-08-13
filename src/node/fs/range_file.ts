import * as fs from "fs";
import * as path from "path";
import type {Dirent} from "fs";
type RangeCallback = (dir:string,name:string,path:string) => void;
export function range(dir:string,callback:RangeCallback) {
    fs.readdirSync(dir,{withFileTypes:true}).forEach(
        (file:Dirent) => {
            const filePath = path.join(dir, file.name);
            if (file.isDirectory()) {
                range(filePath,callback)
            }else {
                callback(dir,file.name,filePath)
            }
        }
    )
}
type SyncCallback = (name:string,path:string,dst:string) => void;
type Filter = (file:Dirent) => boolean;
export function sync(src:string,dst:string,callback:SyncCallback,filter?:Filter) {
    // recursive：深层目标目录不存在时不再 ENOENT
    fs.mkdirSync(dst, {recursive: true})
    fs.readdirSync(src,{withFileTypes:true}).forEach(
        (file:Dirent) => {
            if (filter && !filter(file)) return
            const srcPath = path.join(src, file.name);
            if (file.isDirectory()) {
                const dstPath = path.join(dst, file.name);
                sync(srcPath,dstPath,callback,filter)
            }else {
                callback(file.name,srcPath,dst)
            }
        }
    )
}
