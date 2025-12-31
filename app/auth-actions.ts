'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export type FormState = {
  error?: string;
  success?: boolean; // เพิ่ม success เข้ามา
} | null;

// แก้ไข Return Type ให้เป็น Promise<FormState> เท่านั้น (เอา | void ออก)
export async function registerUser(prevState: FormState, formData: FormData): Promise<FormState> {
  const userId = formData.get('userId') as string
  const prefix = formData.get('prefix') as string    // เพิ่ม
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const gender = formData.get('gender') as string    // เพิ่ม
  const hn = formData.get('hn') as string
  const pdpa = formData.get('pdpa') === 'on'

  if (!userId || !prefix || !firstName || !lastName || !gender || !pdpa) {
    return { error: 'กรุณากรอกข้อมูลส่วนตัวและยอมรับ PDPA ให้ครบถ้วน' }
  }

  try {
    await prisma.user.upsert({
      where: { id: userId },
      update: { prefix, firstName, lastName, gender, hn, pdpaConsent: pdpa },
      create: { id: userId, prefix, firstName, lastName, gender, hn, pdpaConsent: pdpa }
    })
  } catch (err) {
    return { error: 'ไม่สามารถบันทึกข้อมูลได้' }
  }
  redirect('/')
}