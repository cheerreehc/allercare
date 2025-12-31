// app/api/user/check/route.ts
import { prisma } from '@/lib/prisma'; // ต้องชี้ไปที่ไฟล์ที่เราเขียนตัวแปร prisma ไว้
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  if (!userId) return NextResponse.json({ registered: false });

  // ถ้าทำข้อ 1 แล้ว ตรงนี้ขีดแดงจะหายไปเมื่อรันบน Vercel ครับ
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return NextResponse.json({ registered: !!user });
}