'use client'

import { Prompt } from "next/font/google";
import { useEffect } from 'react';
import { initLiff } from '@/lib/liff-init';
import "./globals.css";

// ใช้ Font Prompt เพื่อความอ่านง่ายของภาษาไทยสำหรับผู้ป่วย
const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-prompt",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // เรียกใช้งาน LIFF Initialization เมื่อแอปโหลด
    const startLiff = async () => {
      await initLiff();
    };
    startLiff();
  }, []);

  return (
    <html lang="th" className={`${prompt.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}