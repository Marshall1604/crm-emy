import { NextRequest, NextResponse } from 'next/server';
import { getDeviceRegistry, revokeDevice, unrevokeDevice, removeDevice } from '@/lib/telemetry/device-store';

export async function GET(req: NextRequest) {
  try {
    const devices = getDeviceRegistry();
    const url = new URL(req.url);
    const filterPlatform = url.searchParams.get('platform');
    const filterStatus = url.searchParams.get('status');
    const search = url.searchParams.get('search')?.toLowerCase();

    let filtered = devices;

    if (filterPlatform && filterPlatform !== 'all') {
      filtered = filtered.filter((d) => d.platform === filterPlatform);
    }

    if (filterStatus && filterStatus !== 'all') {
      filtered = filtered.filter((d) => d.status === filterStatus);
    }

    if (search) {
      filtered = filtered.filter(
        (d) =>
          d.userEmail.toLowerCase().includes(search) ||
          d.userName.toLowerCase().includes(search) ||
          d.deviceName.toLowerCase().includes(search) ||
          d.deviceId.toLowerCase().includes(search) ||
          d.ipAddress.toLowerCase().includes(search) ||
          d.os.toLowerCase().includes(search)
      );
    }

    // Stats
    const totalDevices = devices.length;
    const onlineDesktop = devices.filter((d) => d.platform === 'desktop_exe' && d.status === 'online').length;
    const onlineWeb = devices.filter((d) => d.platform === 'web_browser' && d.status === 'online').length;
    const revokedCount = devices.filter((d) => d.isRevoked).length;

    return NextResponse.json({
      devices: filtered,
      stats: {
        totalDevices,
        onlineDesktop,
        onlineWeb,
        revokedCount,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch devices' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as any;
    const { action, deviceId } = body || {};

    if (!deviceId) {
      return NextResponse.json({ error: 'Device ID is required' }, { status: 400 });
    }

    if (action === 'revoke') {
      const ok = revokeDevice(deviceId);
      return NextResponse.json({ success: ok, message: 'Device disconnected and revoked.' });
    }

    if (action === 'unrevoke') {
      const ok = unrevokeDevice(deviceId);
      return NextResponse.json({ success: ok, message: 'Device access restored.' });
    }

    if (action === 'delete') {
      const ok = removeDevice(deviceId);
      return NextResponse.json({ success: ok, message: 'Device record removed.' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Action failed' }, { status: 500 });
  }
}
