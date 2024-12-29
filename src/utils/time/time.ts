import dayjs from "dayjs";


export const toDate = (value:string) => dayjs(value, "YYYY-MM-DD HH:mm:ss.SSSZ");
export const dateFmt = (value:string, format:string) => dayjs(value).format(format);
export const dateFmtDate = (value:Date) => dayjs(value).format("YYYY-MM-DD");
export const dateFmtDateTime = (value:Date) => dayjs(value).format("YYYY-MM-DD HH:mm:ss");

export function timestamp(dateString:string) {
    return new Date(dateString).getTime()
}