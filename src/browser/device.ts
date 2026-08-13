export const enum DeviceType {
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop',
}

export function getDeviceType(): DeviceType {
  const ua = navigator.userAgent

  // 平板判定必须先行：Android 平板 UA 含 "Android" 不含 "Mobi"，曾被 Mobile 分支截胡永判成手机
  if (/iPad|Tablet|PlayBook|Silk|Android(?!.*Mobi)/i.test(ua)) {
    return DeviceType.Tablet
  }

  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return DeviceType.Mobile
  }

  // iPadOS 13+ 用桌面版 Macintosh UA，靠多点触摸识别；触摸屏 + 小屏幕也视为平板
  if (navigator.maxTouchPoints > 1 && (/Macintosh/i.test(ua) || window.screen.width < 1280)) {
    return DeviceType.Tablet
  }

  return DeviceType.Desktop
}

export const isMobile = () => getDeviceType() === DeviceType.Mobile
export const isTablet = () => getDeviceType() === DeviceType.Tablet
export const isDesktop = () => getDeviceType() === DeviceType.Desktop
