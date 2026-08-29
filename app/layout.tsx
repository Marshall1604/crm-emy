import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CrmShell } from '@/components/crm-shell';
import { AuthProvider } from '@/lib/auth/auth-context';
import { LanguageProvider } from '@/lib/i18n/language-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EMLY CUSTOMER LIST — Tax Office Client Management',
  description: 'Modern tax preparation office client management SaaS with RBAC & subscription system.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <AuthProvider>
            <CrmShell>{children}</CrmShell>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
