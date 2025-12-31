'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createLog(formData: FormData) {
  // รับค่าจาก Form
  const rawFormData = {
    userId: 'U12345678', // TODO: เดี๋ยวเราค่อยมาแก้ให้รับค่าจาก LIFF จริงๆ
    logDate: new Date(), // บันทึกเป็นวันนี้
    whealScore: Number(formData.get('wheals')),
    itchScore: Number(formData.get('itch')),
    note: formData.get('note') as string,
  }

  // คำนวณคะแนนรวม
  const totalScore = rawFormData.whealScore + rawFormData.itchScore

  // บันทึกลง MySQL ผ่าน Prisma
  await prisma.dailyLog.create({
    data: {
      userId: rawFormData.userId,
      logDate: rawFormData.logDate,
      whealScore: rawFormData.whealScore,
      itchScore: rawFormData.itchScore,
      totalScore: totalScore,
      note: rawFormData.note,
    },
  })

  // บันทึกเสร็จ ให้รีเฟรชหน้าและเด้งไปหน้าประวัติ
  revalidatePath('/history')
  redirect('/history?success=true')
}