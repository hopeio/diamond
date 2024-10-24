import dayjs from "dayjs/esm";

export const date2s = (value:string) => dayjs(value).format("YYYY-MM-DD HH:mm:ss");
export const s2date = (value:string) => dayjs(value, "YYYY-MM-DD HH:mm:ss.SSS Z");
export const datefmt = (value:string, format:string) => dayjs(value).format(format);

export function timestamp(dateString:string) {
    return new Date(dateString).getTime()
}