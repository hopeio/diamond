const DefaultPreviewURL = "https://tjtn.pan.wo.cn/compressed/preview?fid="
const DefaultThumbnailsV3 = "https://tjtn.pan.wo.cn/thumbnailsV3?fid="
const DefaultThumbnails = "https://du.smartont.net:8442/openapi/thumbnails?fid="

export function preview(fid: string):string{
    return `${DefaultPreviewURL}${encodeURIComponent(fid)}`
}
export function thumbnailsV3(fid: string):string{
    return `${DefaultThumbnailsV3}${encodeURIComponent(fid)}`
}
export function thumbnails(fid: string):string{
    return `${DefaultThumbnails}${encodeURIComponent(fid)}`
}