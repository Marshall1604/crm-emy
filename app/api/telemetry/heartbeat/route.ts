import { NextRequest, NextResponse } from 'next/server';
import { registerOrUpdateDevice } from '@/lib/telemetry/device-store';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as any;
    const { userId, userEmail, userName, telemetry } = body || {};

    if (!telemetry || !telemetry.deviceId) {
      return NextResponse.json({ error: 'Invalid telemetry payload' }, { status: 400 });
    }

    // Extract real client IP address
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';

    const recorded = registerOrUpdateDevice(
      userId,
      userEmail,
      userName,
      ipAddress,
      telemetry
    );

    return NextResponse.json({
      success: true,
      deviceId: recorded.deviceId,
      status: recorded.status,
      isRevoked: recorded.isRevoked,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Telemetry failure' }, { status: 500 });
  }
}
