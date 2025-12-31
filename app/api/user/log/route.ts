// src/app/api/user/logs/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) return NextResponse.json({ logs: [] });

    const logs = await prisma.dailyLog.findMany({
      where: { 
        userId: String(userId).trim() // บังคับเป็น String และลบช่องว่าง
      },
      orderBy: { logDate: 'desc' },
      take: 7,
    });

    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ logs: [] });
  }
}