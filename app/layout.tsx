import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'StreetSignals',
  description: 'Live analyst upgrade tracker powered by Finnhub',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0b0f14', color: '#e5e7eb' }}>
        {children}
      </body>
    </html>
  );
}
