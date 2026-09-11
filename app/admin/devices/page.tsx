import React from 'react';
import { DevicesManager } from '@/features/admin/devices-manager';

export const metadata = {
  title: 'Device Telemetry & Surveillance — CRM EMLY Admin',
  description: 'Real-time telemetry and machine surveillance for CRM EMLY desktop .exe and web apps.',
};

export default function AdminDevicesPage() {
  return (
    <div className="w-full">
      <DevicesManager />
    </div>
  );
}
