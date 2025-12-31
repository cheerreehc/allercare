// src/app/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { startOfDay, endOfDay } from 'date-fns' // แนะนำให้ลง npm install date-fns

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
  const wheals = parseInt(formData.get('wheals') as string)
  const itch = parseInt(formData.get('itch') as string)
  const note = formData.get('note') as string
  const totalScore = wheals + itch

  const today = new Date()
  const normalizedDate = startOfDay(today) // จะได้เวลา 00:00:00.000

  // 4. บันทึกลง MySQL
  try {
    await prisma.dailyLog.upsert({
      where: {
        userId_logDate: {
          userId: userId,
          logDate: normalizedDate 
        }
      },
          update: {
            whealScore: wheals,
            itchScore: itch,
            totalScore: totalScore,
            note: note
          },
        create: {
          userId: userId,
          logDate: startOfDay(today),
          whealScore: wheals,
          itchScore: itch,
          totalScore: totalScore,
          note: note
        }
      })
      return { success: true }
    } catch (e) {
      return { error: "บันทึกข้อมูลไม่สำเร็จ" }
    }
  // 5. บันทึกเสร็จ เคลียร์ Cache และไปหน้าประวัติ
  revalidatePath('/history')
  revalidatePath('/') // เคลียร์หน้า Dashboard ด้วยเพื่อให้คะแนนอัปเดต
  redirect('/history?success=true')
}