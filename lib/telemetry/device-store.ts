/**
 * In-memory & Persistent Device Registry for CRM EMLY Telemetry
 */

export interface RegisteredDevice {
  id: string;
  deviceId: string;
  userId: string;
  userEmail: string;
  userName: string;
  deviceName: string;
  platform: 'desktop_exe' | 'web_browser';
  os: string;
  browser: string;
  ipAddress: string;
  location: string;
  screenResolution: string;
  appVersion: string;
  timeZone: string;
  firstSeen: string;
  lastActive: string;
  status: 'online' | 'idle' | 'offline';
  isRevoked: boolean;
}

// Default initial seeded devices for instant preview
let deviceRegistry: RegisteredDevice[] = [
  {
    id: 'dev_rec_1',
    deviceId: 'EMLY-DEV-WIN-1049-A8F2',
    userId: 'user_1',
    userEmail: 'www.junky3@yahoo.com',
    userName: 'Amy Tran',
    deviceName: 'Dell OptiPlex 7090 (Front Desk)',
    platform: 'desktop_exe',
    os: 'Windows 11 Pro (64-bit)',
    browser: 'CRM EMLY Desktop Native v1.1.6',
    ipAddress: '172.56.21.90',
    location: 'Garden Grove, CA, United States',
    screenResolution: '1920x1080',
    appVersion: 'v2.0.2-pro',
    timeZone: 'America/Los_Angeles',
    firstSeen: new Date(Date.now() - 14 * 86400000).toISOString(),
    lastActive: new Date().toISOString(),
    status: 'online',
    isRevoked: false,
  },
  {
    id: 'dev_rec_2',
    deviceId: 'EMLY-DEV-WIN-8832-B7C1',
    userId: 'user_2',
    userEmail: 'daniel@taxservice.com',
    userName: 'Daniel Lee',
    deviceName: 'Lenovo ThinkPad P1 (Office CPA)',
    platform: 'desktop_exe',
    os: 'Windows 11 Enterprise (64-bit)',
    browser: 'CRM EMLY Desktop Native v2.0.2',
    ipAddress: '98.148.12.45',
    location: 'Westminster, CA, United States',
    screenResolution: '2560x1440',
    appVersion: 'v2.0.2-pro',
    timeZone: 'America/Los_Angeles',
    firstSeen: new Date(Date.now() - 7 * 86400000).toISOString(),
    lastActive: new Date(Date.now() - 12 * 60000).toISOString(),
    status: 'online',
    isRevoked: false,
  },
  {
    id: 'dev_rec_3',
    deviceId: 'EMLY-DEV-MAC-3301-C99E',
    userId: 'user_3',
    userEmail: 'sarah@emlycpa.com',
    userName: 'Sarah Kim',
    deviceName: 'MacBook Pro 16" (M2 Max)',
    platform: 'web_browser',
    os: 'macOS Sonoma (ARM64)',
    browser: 'Chrome 128.0 (SaaS Web App)',
    ipAddress: '47.151.88.204',
    location: 'Irvine, CA, United States',
    screenResolution: '1728x1117',
    appVersion: 'v2.0.2-web',
    timeZone: 'America/Los_Angeles',
    firstSeen: new Date(Date.now() - 3 * 86400000).toISOString(),
    lastActive: new Date(Date.now() - 45 * 60000).toISOString(),
    status: 'idle',
    isRevoked: false,
  },
];

export function getDeviceRegistry(): RegisteredDevice[] {
  // Update online/idle/offline status based on last active timestamp
  const now = Date.now();
  return deviceRegistry.map((dev) => {
    const elapsedMinutes = (now - new Date(dev.lastActive).getTime()) / 60000;
    let computedStatus: 'online' | 'idle' | 'offline' = 'offline';
    if (elapsedMinutes <= 10) computedStatus = 'online';
    else if (elapsedMinutes <= 60) computedStatus = 'idle';

    return {
      ...dev,
      status: dev.isRevoked ? 'offline' : computedStatus,
    };
  });
}

export function registerOrUpdateDevice(
  userId: string,
  userEmail: string,
  userName: string,
  ipAddress: string,
  telemetry: any
): RegisteredDevice {
  const existingIndex = deviceRegistry.findIndex(
    (d) => d.deviceId === telemetry.deviceId || (d.userId === userId && d.deviceName === telemetry.deviceName)
  );

  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    const existing = deviceRegistry[existingIndex];
    const updated: RegisteredDevice = {
      ...existing,
      userId: userId || existing.userId,
      userEmail: userEmail || existing.userEmail,
      userName: userName || existing.userName,
      deviceName: telemetry.deviceName || existing.deviceName,
      platform: telemetry.platform || existing.platform,
      os: telemetry.os || existing.os,
      browser: telemetry.browser || existing.browser,
      ipAddress: ipAddress || existing.ipAddress,
      screenResolution: telemetry.screenResolution || existing.screenResolution,
      appVersion: telemetry.appVersion || existing.appVersion,
      lastActive: now,
      status: existing.isRevoked ? 'offline' : 'online',
    };
    deviceRegistry[existingIndex] = updated;
    return updated;
  }

  const newDevice: RegisteredDevice = {
    id: `dev_rec_${Date.now()}`,
    deviceId: telemetry.deviceId,
    userId: userId || 'unregistered',
    userEmail: userEmail || 'user@local.crm',
    userName: userName || 'User',
    deviceName: telemetry.deviceName || 'Windows Machine',
    platform: telemetry.platform || 'desktop_exe',
    os: telemetry.os || 'Windows 11',
    browser: telemetry.browser || 'Desktop App',
    ipAddress: ipAddress || '127.0.0.1',
    location: 'California, United States',
    screenResolution: telemetry.screenResolution || '1920x1080',
    appVersion: telemetry.appVersion || 'v1.1.6',
    timeZone: telemetry.timeZone || 'America/Los_Angeles',
    firstSeen: now,
    lastActive: now,
    status: 'online',
    isRevoked: false,
  };

  deviceRegistry.unshift(newDevice);
  return newDevice;
}

export function revokeDevice(deviceId: string): boolean {
  const target = deviceRegistry.find((d) => d.deviceId === deviceId || d.id === deviceId);
  if (target) {
    target.isRevoked = true;
    target.status = 'offline';
    return true;
  }
  return false;
}

export function unrevokeDevice(deviceId: string): boolean {
  const target = deviceRegistry.find((d) => d.deviceId === deviceId || d.id === deviceId);
  if (target) {
    target.isRevoked = false;
    target.status = 'online';
    return true;
  }
  return false;
}

export function removeDevice(deviceId: string): boolean {
  const initialLen = deviceRegistry.length;
  deviceRegistry = deviceRegistry.filter((d) => d.deviceId !== deviceId && d.id !== deviceId);
  return deviceRegistry.length < initialLen;
}
