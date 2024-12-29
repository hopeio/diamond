import childProcess from "child_process";

const CommonCmd = ` -i "%s" -y `

let execPath = "ffmpeg"

export function setExecPath(path:string) {
    execPath = path
}

export function ffmpegCmd(cmd:string)  {
    cmd = execPath + cmd
    console.log(cmd)
    childProcess.execSync(cmd,{
        encoding: 'utf-8',
        stdio: 'inherit',
    })
}