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

  let isSuccess = false;

  try {
    await prisma.dailyLog.upsert({
      where: {
        userId_logDate: {
          userId: userId,
          logDate: today
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
        logDate: today,
        whealScore: wheals,
        itchScore: itch,
        totalScore: totalScore,
        note: note
      }
    });
    isSuccess = true;
  } catch (e) {
    console.error("Save Error:", e);
    return { error: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่" };
  }

  if (isSuccess) {
    // ล้าง Cache เพื่อให้หน้า Dashboard และ History เห็นข้อมูลใหม่ทันที
    revalidatePath('/')
    revalidatePath('/history')
    // ดีดกลับไปหน้า Dashboard พร้อมส่งพารามิเตอร์ว่าสำเร็จ
    redirect('/?status=success')
  }
}