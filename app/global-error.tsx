'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <head>
        <title>CRM Emy — Lỗi tải trang</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          background: '#0f172a',
          color: '#f8fafc',
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '90%',
            padding: '2.5rem 2rem',
            background: '#1e293b',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            textAlign: 'center',
            border: '1px solid #334155',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              fontSize: '28px',
              fontWeight: 'bold',
            }}
          >
            !
          </div>

          <h1
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              margin: '0 0 0.5rem',
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            Không thể tải trang lúc này
          </h1>

          <p
            style={{
              fontSize: '0.875rem',
              color: '#94a3b8',
              lineHeight: 1.6,
              margin: '0 0 1.75rem',
            }}
          >
            Đã xảy ra sự cố khi kết nối hoặc đồng bộ dữ liệu. Vui lòng bấm tải lại hoặc quay về trang chủ.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => {
                try {
                  sessionStorage.clear();
                } catch (_) {}
                window.location.reload();
              }}
              style={{
                padding: '0.65rem 1.25rem',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                transition: 'background 0.2s',
              }}
            >
              🔄 Tải lại trang
            </button>

            <button
              onClick={() => {
                try {
                  sessionStorage.clear();
                } catch (_) {}
                window.location.href = '/dashboard';
              }}
              style={{
                padding: '0.65rem 1.25rem',
                background: 'transparent',
                color: '#cbd5e1',
                border: '1px solid #475569',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Vào Dashboard
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
