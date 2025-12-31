// src/app/api/user/check/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  if (!userId) return NextResponse.json({ registered: false });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      logs: {
        orderBy: { logDate: 'desc' },
        take: 7 // ดึง 7 วันล่าสุดมาคำนวณ
      }
    }
  });

  if (!user) return NextResponse.json({ registered: false });

  // คำนวณสถิติ
  const totalScore = user.logs.reduce((sum, log) => sum + log.totalScore, 0);
  const avgWheal = user.logs.length > 0 
    ? (user.logs.reduce((sum, log) => sum + log.whealScore, 0) / user.logs.length).toFixed(1) 
    : 0;
  const avgItch = user.logs.length > 0 
    ? (user.logs.reduce((sum, log) => sum + log.itchScore, 0) / user.logs.length).toFixed(1) 
    : 0;

  return NextResponse.json({ 
    registered: true,
    user: {
      prefix: user.prefix,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    details: {
      totalScore,
      dayCount: user.logs.length,
      avgWheal,
      avgItch,
      lastLog: user.logs[0] || null
    }
  });
}