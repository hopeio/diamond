export const enum DeviceType {
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop',
}

export function getDeviceType(): DeviceType {
  const ua = navigator.userAgent

  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return DeviceType.Mobile
  }

  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobi))/i.test(ua)) {
    return DeviceType.Tablet
  }

  // 触摸屏 + 小屏幕也视为平板
  if (navigator.maxTouchPoints > 1 && window.screen.width < 1280) {
    return DeviceType.Tablet
  }

  return DeviceType.Desktop
}

export const isMobile = () => getDeviceType() === DeviceType.Mobile
export const isTablet = () => getDeviceType() === DeviceType.Tablet
export const isDesktop = () => getDeviceType() === DeviceType.Desktop
