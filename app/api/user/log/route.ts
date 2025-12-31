import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  if (!userId) return NextResponse.json({ logs: [] });

  try {
    const logs = await prisma.dailyLog.findMany({
      where: { userId: userId },
      orderBy: { logDate: 'desc' },
      take: 7, // ดึง 7 วันล่าสุดสำหรับ UAS7
    });

    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ logs: [], error: "Failed to fetch" });
  }
}