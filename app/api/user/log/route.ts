import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('id')

  if (!userId) return NextResponse.json({ logs: [] })

  const logs = await prisma.dailyLog.findMany({
    where: { userId: userId },
    orderBy: { logDate: 'asc' }, // เรียงจากวันที่เก่าไปใหม่ตามตาราง
    take: 7
  })

  return NextResponse.json({ logs })
}