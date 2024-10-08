import fs, {Dirent} from "fs";
type RangeCallback = (dir:string,name:string,path:string) => void;
export function range(dir:string,callback:RangeCallback) {
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
type SyncCallback = (name:string,path:string,dst:string) => void;

export function sync(src:string,dst:string,callback:SyncCallback) {
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