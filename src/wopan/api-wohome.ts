import {client} from "./wopan";
import {
    Channel,
    DefaultClientID,
    SpaceType,
    ErrInvalidPsToken,
    JsonClientIDSecret,
    SortType,
    JsonSecret
} from "./const";

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
    previewUrl:string
    thumbUrl: string;
    fileType: string;
}

export interface QueryAllFilesData {
    files: File[];
}

export function QueryAllFiles(spaceType: SpaceType, parentDirectoryId: string, pageNum: number, pageSize: number, sortRule: SortType, familyId: string): Promise<QueryAllFilesData> {
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
    return client.requestWoHome("QueryAllFiles", param, JsonSecret)
}

export interface PrivateSpaceLoginData {
    psToken: string
    isPass: string
    desc: string
}

export async function PrivateSpaceLogin(pwd: string): Promise<PrivateSpaceLoginData> {
    const res: PrivateSpaceLoginData = await client.requestWoHome("PrivateSpaceLogin", {
        "pwd": pwd,
        "clientId": DefaultClientID,
    }, JsonSecret)
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

export function GetDownloadUrlV2(fidList: string[]): Promise<GetDownloadUrlV2Data> {
    return  client.requestWoHome("GetDownloadUrlV2", {
        "type":     "1",
        "fidList":  fidList,
    }, JsonSecret)
}
// 下载集合压缩包
export function GetDownloadUrl(spaceType:string,fidList: string[]): Promise<DownloadUrl> {
    return  client.requestWoHome("GetDownloadUrl", {
        "fidList":   fidList,
        "spaceType": spaceType,
    }, JsonSecret)
}

export function MoveFile(dirList:string[], fileList:string[],targetDirId: string,sourceType:string,targetType:string,fromFamilyId:string,targetFamilyId:string): Promise<void> {
    const param:Record<string,any> = {
        "targetDirId": targetDirId,
        "sourceType":  sourceType,
        "targetType":  targetType,
        "dirList":     dirList,
        "fileList":    fileList,
        "secret":      false,
    }
    if (sourceType == SpaceType.Family) {
        param.fromFamilyId = fromFamilyId
    }
    if (targetType == SpaceType.Family) {
        param.familyId = targetFamilyId
    }
    return  client.requestWoHome("MoveFile",param, JsonSecret)
}

export function CopyFile(dirList:string[], fileList:string[],targetDirId: string,sourceType:string,targetType:string,fromFamilyId:string,targetFamilyId:string): Promise<void> {
    const param:Record<string,any> = {
        "targetDirId": targetDirId,
        "sourceType":  sourceType,
        "targetType":  targetType,
        "dirList":     dirList,
        "fileList":    fileList,
        "secret":      false,

    }
    if (sourceType == SpaceType.Family) {
        param.fromFamilyId = fromFamilyId
    }
    if (targetType == SpaceType.Family) {
        param.familyId = targetFamilyId
    }
    return  client.requestWoHome("CopyFile",param, JsonSecret)
}

export function DeleteFile(spaceType:string,dirList:string[], fileList:string[]): Promise<void> {
    return  client.requestWoHome("DeleteFile",{
        "spaceType": spaceType,
        "vipLevel":  "0",
        "dirList":   dirList,
        "fileList":  fileList,
       }, JsonSecret)
}

export function EmptyRecycleData(spaceType:string,dirList:string[], fileList:string[]): Promise<void> {
    return  client.requestWoHome("EmptyRecycleData",{}, JsonSecret)
}

interface VerifySetPwd {
    phone: string
    verifyResult: string // 01 不通过?
}
export function VerifySetPwd(): Promise<VerifySetPwd> {
    return  client.requestWoHome("VerifySetPwd",{
        "psToken": client.psToken,
        }, JsonSecret)
}

export function FCloudProductOrdListQry(): Promise<void> {
    return  client.request(Channel.Wostore, "FCloudProductOrdListQry",{
     }, {...JsonSecret, qryType: "1",})
}
