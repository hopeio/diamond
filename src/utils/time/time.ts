import dayjs, {Dayjs} from "dayjs";


export const toDayjs = (value:string) => dayjs(value, "YYYY-MM-DD HH:mm:ss.SSSZ");
export const dateToDayjs = (value:string) => dayjs(value, "YYYY-MM-DD");
export const dateFmt = (value:string, format:string) => dayjs(value).format(format);
export const dateFmtDate = (value:Date) => dayjs(value).format("YYYY-MM-DD");
export const dateFmtDateTime = (value:Date) => dayjs(value).format("YYYY-MM-DD HH:mm:ss");

export const dayjsDateFmtDate = (value:Dayjs) => value.format("YYYY-MM-DD");
export const dayjsDateFmtDateTime = (value:Dayjs) => value.format("YYYY-MM-DD HH:mm:ss");

export function timestamp(dateString:string) {
    return new Date(dateString).getTime()
}