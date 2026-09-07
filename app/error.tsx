'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Chunk load errors happen after Vercel re-deploys a new build.
    // Old JS chunk files are deleted from the CDN, but the browser still
    // has cached references to them from the previous build manifest.
    // Clicking a Next.js <Link> triggers a SPA navigation that tries to
    // fetch the old chunk → fails → "This page couldn't load" dialog.
    // A hard reload fetches the new HTML + new chunks → works fine.
    // Solution: detect chunk errors and automatically hard-reload.
    const isChunkError =
      error?.message?.includes('ChunkLoadError') ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed') ||
      error?.name === 'ChunkLoadError';

    if (isChunkError) {
      // Replace current history entry so Back button still works correctly
      window.location.reload();
      return;
    }

    // For non-chunk errors, log them
    console.error('[App Error]', error);
  }, [error]);

  return (
    // Invisible wrapper — the auto-reload above handles chunk errors silently.
    // For other errors, show a minimal message.
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Đã xảy ra lỗi
        </h2>
        <p className="text-muted-foreground mb-6 text-sm">
          Trang không thể tải được. Hãy thử tải lại trang.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors mr-3"
        >
          Tải lại trang
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-accent transition-colors"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
