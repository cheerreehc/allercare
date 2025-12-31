// src/app/api/user/logs/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      console.log("History API: No UserID provided");
      return NextResponse.json({ logs: [] });
    }

    const logs = await prisma.dailyLog.findMany({
      where: { 
        userId: userId.trim() // ใช้ trim() เพื่อป้องกันช่องว่างที่อาจติดมา
      },
      orderBy: { logDate: 'desc' },
      take: 7,
    });

    console.log(`History API: Found ${logs.length} logs for user ${userId}`);
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('History API Error:', error);
    return NextResponse.json({ logs: [], error: "Database Connection Error" });
  }
}