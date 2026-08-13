const PhoneReg = /^1[0-9]{10}$/;
// 线性回溯：每次迭代必消费固定前缀字符，无嵌套量词 ReDoS；域名点转义；TLD 放开到 2+ 位
const EmailReg = /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;

// 方法不依赖 this，解构后可直接调用
export const Validator = {
  PhoneReg,
  phone(input: string): boolean {
    return PhoneReg.test(input);
  },
  EmailReg,
  mail(input: string): boolean {
    return EmailReg.test(input);
  },
};
