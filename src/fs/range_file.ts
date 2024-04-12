import fs from "fs";

export function range(dir:string,callback:Function) {
    fs.readdirSync(dir,{withFileTypes:true}).forEach(
        file => {
            const path = dir+"/"+file.name;
            if (file.isDirectory()) {
                range(path,callback)
            }else {
                callback(file.name,path,dir)
            }
        }
    )
}

export function sync(src:string,dst:string,callback:Function) {
    if (!fs.existsSync(dst)){
        fs.mkdirSync(dst)
    }
    fs.readdirSync(src,{withFileTypes:true}).forEach(
        file => {
            const path = src+"/"+file.name;
            const dstpath = dst+"/"+file.name;
            if (file.isDirectory()) {
                sync(path,dstpath,callback)
            }else {
                callback(file.name,path,dst)
            }
        }
    )
}