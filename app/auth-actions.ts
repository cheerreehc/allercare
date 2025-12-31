'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export type FormState = {
  error?: string;
} | null;

export async function registerUser(prevState: FormState, formData: FormData): Promise<FormState | void> {
  const userId = formData.get('userId') as string
  const firstName = formData.get('firstName') as string // เพิ่มบรรทัดนี้
  const lastName = formData.get('lastName') as string   // เพิ่มบรรทัดนี้
  const hn = formData.get('hn') as string
  const pdpa = formData.get('pdpa') === 'on'

  // ตอนนี้ TypeScript จะรู้จัก firstName และ lastName แล้วครับ
  if (!userId || !firstName || !lastName || !pdpa) {
    return { error: 'กรุณากรอกชื่อ นามสกุล และยอมรับ PDPA ให้ครบถ้วน' }
  }

  try {
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        firstName: firstName,
        lastName: lastName,
        hn: hn,
        pdpaConsent: pdpa
      },
      create: {
        id: userId,
        firstName: firstName,
        lastName: lastName,
        hn: hn,
        pdpaConsent: pdpa
      }
    })
  } catch (err) {
    console.error('Registration Error:', err)
    return { error: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง' }
  }

  redirect('/')
}