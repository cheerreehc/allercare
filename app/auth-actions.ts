'use server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

// 1. เพิ่ม export type เพื่อให้หน้า page.tsx เรียกใช้ได้
export type FormState = {
  error?: string;
} | null;

// 2. ปรับโครงสร้าง parameter ให้ตรงตามมาตรฐาน Next.js
export async function registerUser(prevState: FormState, formData: FormData): Promise<FormState> {
  const userId = formData.get('userId') as string
  const name = formData.get('name') as string
  const hn = formData.get('hn') as string
  const pdpa = formData.get('pdpa') === 'on'

  if (!userId || !name || !pdpa) {
    return { error: 'กรุณากรอกข้อมูลให้ครบถ้วนและยอมรับเงื่อนไข' }
  }

  try {
    await prisma.user.upsert({
      where: { id: userId },
      update: { name, hn, pdpaConsent: pdpa },
      create: { id: userId, name, hn, pdpaConsent: pdpa }
    })
  } catch (err) {
    console.error(err)
    return { error: 'ไม่สามารถบันทึกข้อมูลลงฐานข้อมูลได้' }
  }

  redirect('/')
}