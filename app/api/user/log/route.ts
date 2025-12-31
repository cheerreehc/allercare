// src/app/api/user/logs/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    // ถ้าไม่มี id ส่งมา ให้ส่งตารางว่างกลับไป
    if (!userId) return NextResponse.json({ logs: [] });

    const logs = await prisma.dailyLog.findMany({
      where: { 
        userId: userId.trim() // ป้องกันช่องว่างที่ติดมาจาก LIFF
      },
      orderBy: { 
        logDate: 'desc' 
      },
      take: 7,
    });

    // ส่งข้อมูลออกไป และบังคับให้เป็น JSON เสมอ
    return NextResponse.json({ logs }, {
      headers: { 'Cache-Control': 'no-store' } // บังคับไม่ให้จำ Cache เก่า
    });
  } catch (error) {
    console.error('History API Error:', error);
    return NextResponse.json({ logs: [], error: "Internal Server Error" }, { status: 500 });
  }
}