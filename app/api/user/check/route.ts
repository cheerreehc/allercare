import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { startOfDay } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  if (!userId) return NextResponse.json({ registered: false });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      logs: {
        orderBy: { logDate: 'desc' },
        take: 7 // ดึง 7 วันล่าสุดมาคำนวณ UAS7
      }
    }
  });

  if (!user) return NextResponse.json({ registered: false });

  // 1. กำหนดค่าเริ่มต้นของเวลาวันนี้ (00:00) เพื่อใช้เปรียบเทียบ
  const todayStart = startOfDay(new Date());

  // 2. เช็คว่าใน logs มีอันไหนที่เป็นของ "วันนี้" หรือไม่
  const hasLogToday = user.logs.some(log => {
    const logDate = startOfDay(new Date(log.logDate));
    return logDate.getTime() === todayStart.getTime();
  });

  // 3. คำนวณสถิติพื้นฐาน
  const dayCount = user.logs.length;
  const totalScore = user.logs.reduce((sum, log) => sum + log.totalScore, 0);
  
  const avgWheal = dayCount > 0 
    ? (user.logs.reduce((sum, log) => sum + log.whealScore, 0) / dayCount).toFixed(1) 
    : "0.0";
    
  const avgItch = dayCount > 0 
    ? (user.logs.reduce((sum, log) => sum + log.itchScore, 0) / dayCount).toFixed(1) 
    : "0.0";

  // 4. ส่งข้อมูลกลับไปยัง Dashboard
  return NextResponse.json({ 
    registered: true,
    user: {
      prefix: user.prefix,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    details: {
      totalScore,
      dayCount: dayCount,           // จำนวนวันที่บันทึกไปแล้ว (1-7)
      daysLeft: Math.max(0, 7 - dayCount), // จำนวนวันทื่เหลือจนครบสัปดาห์
      hasLogToday: hasLogToday,     // สถานะ: วันนี้บันทึกหรือยัง (true/false)
      avgWheal,
      avgItch,
      lastLog: user.logs[0] || null
    }
  });
}