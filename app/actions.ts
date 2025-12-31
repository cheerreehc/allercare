// src/app/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createLog(prevState: any, formData: FormData) {
  // 1. รับค่า userId จริงจากฟอร์ม (ที่ส่งมาจาก LIFF)
  const userId = formData.get('userId') as string
  
  // 2. ตรวจสอบว่ามี User นี้ในระบบจริงไหม (ป้องกัน Error Foreign Key)
  const userExists = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!userExists) {
    throw new Error("ไม่พบข้อมูลผู้ใช้งานในระบบ กรุณาลงทะเบียนก่อน")
  }

  // 3. รับคะแนนและคำนวณ
  const whealScore = Number(formData.get('wheals')) // เช็คหน้า page.tsx ว่าตั้งชื่อ name="wheals" หรือไม่
  const itchScore = Number(formData.get('itch'))
  const note = formData.get('note') as string
  const totalScore = whealScore + itchScore

  // 4. บันทึกลง MySQL
  try {
    await prisma.dailyLog.create({
      data: {
        userId: userId,
        logDate: new Date(), 
        whealScore: whealScore,
        itchScore: itchScore,
        totalScore: totalScore,
        note: note,
      },
    })
  } catch (error) {
    console.error("Database Error:", error)
    return { error: "ไม่สามารถบันทึกข้อมูลได้" }
  }

  // 5. บันทึกเสร็จ เคลียร์ Cache และไปหน้าประวัติ
  revalidatePath('/history')
  revalidatePath('/') // เคลียร์หน้า Dashboard ด้วยเพื่อให้คะแนนอัปเดต
  redirect('/history?success=true')
}