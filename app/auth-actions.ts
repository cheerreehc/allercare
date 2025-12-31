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
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const hn = formData.get('hn') as string
  const pdpa = formData.get('pdpa') === 'on'

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

  // หลังจากบันทึกสำเร็จ ให้ redirect ไปหน้าแรก
  // ใน Next.js การ redirect จะโยน error พิเศษออกมา 
  // ซึ่งจะทำให้ฟังก์ชันหยุดทำงานและเปลี่ยนหน้าทันที
  redirect('/')
}