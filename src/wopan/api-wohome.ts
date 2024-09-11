import {client} from "./wopan";
import {DefaultClientID, DefaultClientSecret, SpaceType} from "./const";
import {ErrInvalidPsToken, JsonClientIDSecret} from "./var";

export interface File {
    familyId: number;
    fid: string;
    creator: string;
    size: number;
    createTime: string;
    name: string;
    shootingTime: string;
    id: string;
    type: number;
    thumbUrl: string;
    fileType: string;
}

export interface QueryAllFilesData {
    files: File[];
}

export async function QueryAllFiles(spaceType: SpaceType, parentDirectoryId: string, pageNum: number, pageSize: number, sortRule: number, familyId: string): Promise<QueryAllFilesData> {
    const param: any = {
        "spaceType": spaceType,
        "parentDirectoryId": parentDirectoryId,
        "pageNum": pageNum,
        "pageSize": pageSize,
        "sortRule": sortRule,
        "clientId": DefaultClientID,
    }
    if (spaceType == SpaceType.Family) {
        param.familyId = familyId
    }
    if (spaceType == SpaceType.Private) {
        if (client.psToken == "") {
            throw ErrInvalidPsToken
        }
        param.psToken = client.psToken
    }
    return client.requestWoHome("QueryAllFiles", param, JsonClientIDSecret, false)
}

export interface PrivateSpaceLoginData {
    psToken: string
    isPass: string
    desc: string
}

export async function PrivateSpaceLogin(pwd: string): Promise<PrivateSpaceLoginData> {
    const res: PrivateSpaceLoginData = await client.requestWoHome("PrivateSpaceLogin", {
        "pwd": pwd,
        "clientId": DefaultClientID
    }, JsonClientIDSecret, false)
    client.psToken = res.psToken
    return res
}

export interface GetDownloadUrlV2Data {
    type: number
    list: DownloadUrl[]
}

export interface DownloadUrl {
    fid: string
    downloadUrl: string
}

export async function GetDownloadUrlV2(fidList: string[]): Promise<GetDownloadUrlV2Data> {
    return  client.requestWoHome("GetDownloadUrlV2", {
        "type":     "1",
        "fidList":  fidList,
        "clientId": DefaultClientID,
    }, JsonClientIDSecret, false)
}
// 下载集合压缩包
export async function GetDownloadUrl(spaceType:string,fidList: string[]): Promise<DownloadUrl> {
    return  client.requestWoHome("GetDownloadUrl", {
        "fidList":   fidList,
        "clientId":  DefaultClientID, // ???
        "spaceType": spaceType,
    }, JsonClientIDSecret, false)
}

export async function MoveFile(dirList:string[], fileList:string[],targetDirId: string,sourceType:string,targetType:string,fromFamilyId:string,targetFamilyId:string): Promise<void> {
    const param:Record<string,any> = {
        "targetDirId": targetDirId,
        "sourceType":  sourceType,
        "targetType":  targetType,
        "dirList":     dirList,
        "fileList":    fileList,
        "secret":      false,
        "clientId":    DefaultClientID,
    }
    if (sourceType == SpaceType.Family) {
        param.fromFamilyId = fromFamilyId
    }
    if (targetType == SpaceType.Family) {
        param.familyId = targetFamilyId
    }
    return  client.requestWoHome("MoveFile",param, JsonClientIDSecret, false)
}

export async function CopyFile(dirList:string[], fileList:string[],targetDirId: string,sourceType:string,targetType:string,fromFamilyId:string,targetFamilyId:string): Promise<void> {
    const param:Record<string,any> = {
        "targetDirId": targetDirId,
        "sourceType":  sourceType,
        "targetType":  targetType,
        "dirList":     dirList,
        "fileList":    fileList,
        "secret":      false,
        "clientId":    DefaultClientID,
    }
    if (sourceType == SpaceType.Family) {
        param.fromFamilyId = fromFamilyId
    }
    if (targetType == SpaceType.Family) {
        param.familyId = targetFamilyId
    }
    return  client.requestWoHome("CopyFile",param, JsonClientIDSecret, false)
}

export async function DeleteFile(spaceType:string,dirList:string[], fileList:string[]): Promise<void> {
    return  client.requestWoHome("DeleteFile",{
        "spaceType": spaceType,
        "vipLevel":  "0",
        "dirList":   dirList,
        "fileList":  fileList,
        "clientId":  DefaultClientID,}, JsonClientIDSecret, false)
}

export async function EmptyRecycleData(spaceType:string,dirList:string[], fileList:string[]): Promise<void> {
    return  client.requestWoHome("EmptyRecycleData",{
        "clientId": DefaultClientID,}, JsonClientIDSecret, false)
}