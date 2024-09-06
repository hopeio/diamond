import fs, {Dirent} from "fs";

export function range(dir:string,callback:Function) {
    fs.readdirSync(dir,{withFileTypes:true}).forEach(
        (file:Dirent) => {
            const path = dir+"/"+file.name;
            if (file.isDirectory()) {
                range(path,callback)
            }else {
                callback(dir,file.name,path)
            }
        }
    )
}

export function sync(src:string,dst:string,callback:Function) {
    if (!fs.existsSync(dst)){
        fs.mkdirSync(dst)
    }
    fs.readdirSync(src,{withFileTypes:true}).forEach(
        (file:Dirent) => {
            const path = src+"/"+file.name;
            if (file.isDirectory()) {
                const dstpath = dst+"/"+file.name;
                sync(path,dstpath,callback)
            }else {
                callback(file.name,path,dst)
            }
        }
    )
}