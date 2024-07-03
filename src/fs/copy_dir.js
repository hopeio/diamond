
import  fs from 'fs'

function copyDir(src, dest) {
    if (!fs.existsSync(dest)){
        fs.mkdirSync(dest)
    }
    fs.readdirSync(src).forEach(
        file=>{
            let path = src+"/"+file;
            let stat = fs.statSync(path);
            if (stat.isDirectory()) {
                copyDir(path, dest+"/"+file);
            }else {
                fs.copyFileSync(path,dest+"/"+file)
            }
        }
    )
}
