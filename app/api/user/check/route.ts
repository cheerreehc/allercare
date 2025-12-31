import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  if (!userId) return NextResponse.json({ registered: false });

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return NextResponse.json({ registered: !!user });
}