import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const logs = await prisma.dailyLog.findMany({
      where: { userId: userId },
      orderBy: { logDate: 'desc' },
      take: 7, // ดึงเฉพาะ 7 วันล่าสุดตามมาตรฐาน UAS7
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}