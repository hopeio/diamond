
import  fs from 'fs'

function copy_dir(src, dest) {
    if (!fs.existsSync(dest)){
        fs.mkdirSync(dest)
    }
    fs.readdirSync(src).forEach(
        file=>{
            let path = src+"/"+file;
            let stat = fs.statSync(path);
            if (stat.isDirectory()) {
                copy_dir(path, dest+"/"+file);
            }else {
                fs.copyFileSync(path,dest+"/"+file)
            }
        }
    )
}
