import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// dayjs(value, format) 依赖该插件；不注册时第二个参数被静默忽略
dayjs.extend(customParseFormat);

Date.prototype.format = function (fmt:string) {
  return dayjs(this).format(fmt);
};

export const dateTool = {
  parse(dateStr: string) {
    // dayjs 小数秒最多毫秒；Go RFC3339Nano 的 9 位小数先截断，曾用不存在的 SSSSSSSSS token
    const normalized = dateStr.replace(/\.(\d{3})\d+/, ".$1");
    return dayjs(normalized, [
      "YYYY-MM-DD HH:mm:ss.SSSZ",
      "YYYY-MM-DD HH:mm:ss.SSS",
      "YYYY-MM-DD HH:mm:ssZ",
      "YYYY-MM-DD HH:mm:ss",
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
      "YYYY-MM-DDTHH:mm:ss.SSS",
      "YYYY-MM-DDTHH:mm:ssZ",
      "YYYY-MM-DDTHH:mm:ss",
    ]);
  },

  zeroTime: "0001-01-01T08:00:00+08:00",
  format: "YYYY-MM-DD HH:mm:ss",
  formatYMD: "YYYY-MM-DD",
  formatYMD2: "YYYY年MM月DD日",
  formatYMDHM: "YYYY-MM-DD HH:mm",
  formatYMDHM2: "YYYY年MM月DD日 HH点mm分ss秒",

  getReplyTime(date: string) {
    const time = this.parse(date).valueOf();
    const currentT = new Date().getTime();
    const diff = (currentT - time) / 1000;
    if (diff < 60) {
      return "刚刚";
    } else if (diff < 60 * 60) {
      return `${Math.floor(diff / 60)}分钟前`;
    } else if (diff < 24 * 60 * 60) {
      return `${Math.floor(diff / 60 / 60)}小时前`;
    } else if (diff < 7 * 24 * 60 * 60) {
      return `${Math.floor(diff / 24 / 60 / 60)}天前`;
    } else {
      // 曾写成 dayjs(time, fmt) 把格式串当解析参数，返回 Dayjs 对象而非字符串
      return dayjs(time).format(this.formatYMD);
    }
  },
};

export default dateTool;
