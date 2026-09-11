/**
 * Device Telemetry Utility for CRM EMLY
 * Handles device fingerprinting, OS detection, and platform identification (Desktop .exe vs Web Browser)
 */

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  platform: 'desktop_exe' | 'web_browser';
  os: string;
  browser: string;
  screenResolution: string;
  appVersion: string;
  timeZone: string;
  language: string;
}

const DEVICE_ID_KEY = 'crm_emly_device_id';
const DEVICE_NAME_KEY = 'crm_emly_device_name';

/**
 * Generate or retrieve persistent unique hardware/device identifier
 */
export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'server-rendered-node';

  try {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      let generatedId = '';
      if ((window as any).__CRM_DESKTOP_BRIDGE__?.getMachineId) {
        generatedId = String((window as any).__CRM_DESKTOP_BRIDGE__.getMachineId());
      }
      if (!generatedId) {
        const randomPart = Math.random().toString(36).substring(2, 10);
        const timePart = Date.now().toString(36);
        generatedId = `EMLY-DEV-${timePart}-${randomPart}`.toUpperCase();
      }
      deviceId = generatedId;
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId || 'EMLY-DEV-ANONYMOUS';
  } catch {
    return 'EMLY-DEV-ANONYMOUS';
  }
}

/**
 * Get or assign human-readable device name (e.g. Windows PC / Dell XPS)
 */
export function getDeviceName(): string {
  if (typeof window === 'undefined') return 'Unknown Device';

  try {
    let name = localStorage.getItem(DEVICE_NAME_KEY);
    if (!name) {
      let resolvedName = '';
      if ((window as any).__CRM_DESKTOP_BRIDGE__?.getHostname) {
        resolvedName = String((window as any).__CRM_DESKTOP_BRIDGE__.getHostname());
      }
      if (!resolvedName) {
        const os = getOS();
        resolvedName = `${os} Machine (${navigator.platform || 'x64'})`;
      }
      name = resolvedName;
      localStorage.setItem(DEVICE_NAME_KEY, name);
    }
    return name || 'Desktop PC';
  } catch {
    return 'Desktop PC';
  }
}

/**
 * Detect Operating System
 */
export function getOS(): string {
  if (typeof window === 'undefined') return 'Unknown OS';

  const userAgent = navigator.userAgent;
  if (/Windows NT 10.0/i.test(userAgent)) return 'Windows 11 / 10 (x64)';
  if (/Windows NT 6.3/i.test(userAgent)) return 'Windows 8.1';
  if (/Windows NT 6.1/i.test(userAgent)) return 'Windows 7';
  if (/Mac OS X/i.test(userAgent)) return 'macOS Apple Silicon / Intel';
  if (/Linux/i.test(userAgent)) return 'Linux Desktop';
  if (/Android/i.test(userAgent)) return 'Android Device';
  if (/iPhone|iPad/i.test(userAgent)) return 'iOS Device';

  return 'Windows PC';
}

/**
 * Detect Platform: Desktop .exe wrapper or Standard Web Browser
 */
export function getPlatformType(): 'desktop_exe' | 'web_browser' {
  if (typeof window === 'undefined') return 'web_browser';

  // Check custom desktop user agent, electron bridge, or window flags
  const isElectron = !!(window as any).process?.versions?.electron || /electron/i.test(navigator.userAgent);
  const isDesktopBridge = !!(window as any).__CRM_DESKTOP_BRIDGE__;
  const isStandalonePwa = window.matchMedia('(display-mode: standalone)').matches;
  const isExeQuery = typeof window !== 'undefined' && window.location.search.includes('platform=desktop_exe');

  if (isElectron || isDesktopBridge || isExeQuery) {
    return 'desktop_exe';
  }

  return 'web_browser';
}

/**
 * Get full device fingerprint object
 */
export function collectDeviceTelemetry(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      deviceId: 'server',
      deviceName: 'Server',
      platform: 'web_browser',
      os: 'Server OS',
      browser: 'Node',
      screenResolution: '0x0',
      appVersion: 'v2.0.2',
      timeZone: 'UTC',
      language: 'en',
    };
  }

  return {
    deviceId: getOrCreateDeviceId(),
    deviceName: getDeviceName(),
    platform: getPlatformType(),
    os: getOS(),
    browser: navigator.userAgent.includes('Chrome') ? 'Chromium / Edge' : navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Safari / WebKit',
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    appVersion: 'v2.0.2-pro',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Los_Angeles',
    language: navigator.language || 'en-US',
  };
}
