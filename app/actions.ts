// src/app/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { startOfDay, endOfDay } from 'date-fns' // แนะนำให้ลง npm install date-fns

export async function createLog(prevState: any, formData: FormData) {
  const userId = formData.get('userId') as string
  const wheals = parseInt(formData.get('wheals') as string)
  const itch = parseInt(formData.get('itch') as string)
  const note = formData.get('note') as string
  const totalScore = wheals + itch
  const today = startOfDay(new Date())

  let success = false;

  // 4. บันทึกลง MySQL
  try {
    await prisma.dailyLog.upsert({
      where: {
        userId_logDate: { userId, logDate: today }
      },
      update: { whealScore: wheals, itchScore: itch, totalScore, note },
      create: { userId, logDate: today, whealScore: wheals, itchScore: itch, totalScore, note }
    })
    success = true;
  } catch (e) {
    console.error(e)
    return { error: "ไม่สามารถบันทึกข้อมูลได้" }
  }

 // ย้าย redirect ออกมานอก try-catch เพื่อความเสถียร
  if (success) {
    revalidatePath('/')
    revalidatePath('/history')
    // ส่งกลับหน้าแรกพร้อมบอกว่าบันทึกสำเร็จ
    redirect('/?status=success')
  }
}