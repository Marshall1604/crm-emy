'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { collectDeviceTelemetry } from '@/lib/telemetry/device-telemetry';

export function DeviceTelemetryTracker() {
  const { user, profile } = useAuth();
  const lastPingRef = useRef<number>(0);

  useEffect(() => {
    // Only track if active session exists or in demo mode
    const sendHeartbeat = async () => {
      const now = Date.now();
      // Throttle pings to at most once per 60 seconds
      if (now - lastPingRef.current < 60000) return;
      lastPingRef.current = now;

      try {
        const telemetry = collectDeviceTelemetry();
        await fetch('/api/telemetry/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id || profile?.id || 'guest_user',
            userEmail: user?.email || profile?.email || 'unregistered@client.local',
            userName: profile?.full_name || 'CRM User',
            telemetry,
          }),
        });
      } catch {
        // Silently ignore telemetry failure in offline mode
      }
    };

    // Initial ping on mount
    sendHeartbeat();

    // Recurring heartbeat every 3 minutes
    const interval = setInterval(sendHeartbeat, 3 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user?.id, user?.email, profile?.full_name, profile?.id, profile?.email]);

  return null;
}
