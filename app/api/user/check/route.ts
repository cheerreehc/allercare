// app/api/user/check/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  if (!userId) return NextResponse.json({ registered: false });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      prefix: true,
      firstName: true,
      lastName: true,
    }
  });

  return NextResponse.json({ 
    registered: !!user,
    user: user // ส่งข้อมูลชื่อกลับไปด้วย
  });
}