// src/app/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { startOfDay } from 'date-fns'

export async function createLog(prevState: any, formData: FormData) {
  const userId = formData.get('userId') as string
  const wheals = parseInt(formData.get('wheals') as string)
  const itch = parseInt(formData.get('itch') as string)
  const note = formData.get('note') as string
  const totalScore = wheals + itch
  
  // สำคัญ: ต้องเป็นวันที่ที่ไม่มีเวลามาเกี่ยวข้อง
  const today = startOfDay(new Date())

  let success = false;

  try {
    await prisma.dailyLog.upsert({
      where: { userId_logDate: { userId, logDate: today } },
      update: { whealScore: wheals, itchScore: itch, totalScore, note },
      create: { userId, logDate: today, whealScore: wheals, itchScore: itch, totalScore, note }
    });
    success = true; // บันทึกสำเร็จ
  } catch (e) {
    console.error(e);
    return { error: "บันทึกไม่สำเร็จ" };
  }

  // ย้าย redirect มาไว้ข้างนอก try-catch เท่านั้น
    if (success) {
      revalidatePath('/')
      revalidatePath('/history')
      redirect('/?status=success') // เด้งกลับหน้าแรก
    }
}