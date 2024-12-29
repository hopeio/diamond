import {range} from './range_file.js';
import {test} from "vitest";



test(
    "range",
    ()=>{
        range("ScreenRecorder",(name:string,path:string)=>{
            console.log(name,path)
        })
    }
)