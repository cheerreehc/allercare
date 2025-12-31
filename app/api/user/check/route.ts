// src/app/api/user/check/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  if (!userId) return NextResponse.json({ registered: false });

  // ดึงข้อมูล User พร้อมกับสรุปคะแนน 7 วันล่าสุด
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      logs: {
        orderBy: { logDate: 'desc' },
        take: 7 // ดึงแค่ 7 วันล่าสุด
      }
    }
  });

  if (!user) return NextResponse.json({ registered: false });

  // คำนวณคะแนนรวม UAS7 (Wheal + Itch) ของ 7 วันล่าสุด
  const totalUAS7 = user.logs.reduce((sum, log) => sum + log.totalScore, 0);
  const dayCount = user.logs.length; // จำนวนวันที่บันทึกไปแล้ว

  return NextResponse.json({ 
    registered: true,
    user: {
      prefix: user.prefix,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    stats: {
      totalScore: totalUAS7,
      currentDay: dayCount
    }
  });
}