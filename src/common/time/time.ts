import dayjs, {Dayjs} from "dayjs";


export const toDayjs = (value:string) => dayjs(value, "YYYY-MM-DD HH:mm:ss.SSSZ");
export const dateToDayjs = (value:string) => dayjs(value, "YYYY-MM-DD");
export const dateTimeToDayjs = (value:string) => dayjs(value, "YYYY-MM-DD HH:mm:ss");
export const dateFmt = (value:string, format:string) => dayjs(value,format);
export const dateFmtDate = (value:Date|number) => dayjs(value).format("YYYY-MM-DD");
export const dateFmtDateTime = (value:Date|number) => dayjs(value).format("YYYY-MM-DD HH:mm:ss");

export const dayjsDateFmtDate = (value:Dayjs) => value.format("YYYY-MM-DD");
export const dayjsDateFmtDateTime = (value:Dayjs) => value.format("YYYY-MM-DD HH:mm:ss");

export function timestamp(dateString:string) {
    return new Date(dateString).getTime()
}

export interface Timestamp {
    seconds: number;
    nanos: number;
}

export function pbTimeToDayjs(pbTime: Timestamp): Dayjs {
    return dayjs(pbTime.seconds * 1000 + pbTime.nanos / 1000000);
}

export function unixToDayjs(seconds: number, nanos: number = 0): Dayjs {
    return dayjs(seconds * 1000 + nanos / 1000000);
}

