'use client'

import { useEffect, useState, useActionState } from 'react'
import { registerUser, type FormState } from '../auth-actions' // Import Type มาด้วย
import { ShieldCheck, Info, ClipboardCheck } from 'lucide-react'

export default function RegisterPage() {
  const [userId, setUserId] = useState('')
  
  // ระบุ Type กำกับไว้ที่ Hook เพื่อแก้ขีดแดง
  const [state, formAction, isPending] = useActionState<FormState, FormData>(registerUser, null);

  useEffect(() => {
    const initLiff = async () => {
      // ใช้ Dynamic Import เพื่อป้องกัน Error ตอน Build
      const liff = (await import('@line/liff')).default
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile()
          setUserId(profile.userId)
        }
      } catch (err) {
        console.error('LIFF Error:', err)
      }
    }
    initLiff()
  }, [])

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 p-6 pb-20 font-prompt text-slate-900">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-500 p-2 rounded-xl text-white">
          <ClipboardCheck size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold font-prompt">ลงทะเบียน AllerCare</h1>
          <p className="text-slate-400 text-xs">ข้อมูลสำหรับแพทย์ติดตามอาการ</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-5 rounded-3xl mb-6 shadow-sm">
        <div className="flex items-center gap-2 text-blue-700 font-bold mb-2 text-sm">
          <Info size={18} />
          <span>คำแนะนำ</span>
        </div>
        <p className="text-[11px] text-blue-600 leading-relaxed opacity-90">
          กรุณาบันทึกอาการในหน้าถัดไปวันละ 1 ครั้ง โดยประเมินอาการที่เกิดขึ้นในรอบ 24 ชั่วโมงที่ผ่านมา
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {/* ส่ง userId ที่ได้จาก LINE ไปด้วย */}
        <input type="hidden" name="userId" value={userId} />

        {/* ขีดแดงที่ state.error จะหายไปเพราะเราบอก Type แล้ว */}
        {state?.error && (
          <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl border border-red-100 font-medium">
            ⚠️ {state.error}
          </div>
        )}

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">ชื่อ - นามสกุล</label>
            <input 
              name="name" 
              placeholder="ระบุชื่อ-นามสกุล" 
              required 
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">เลขประจำตัวผู้ป่วย (HN)</label>
            <input 
              name="hn" 
              placeholder="เลข HN (ถ้าทราบ)" 
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex gap-3 items-start">
            <input 
              type="checkbox" 
              name="pdpa" 
              id="pdpa" 
              required 
              className="mt-1 h-5 w-5 rounded-lg border-slate-300 text-green-500 focus:ring-green-500" 
            />
            <label htmlFor="pdpa" className="text-[10px] text-slate-500 leading-relaxed font-light">
              ยินยอมให้ระบบ AllerCare จัดเก็บและใช้ข้อมูลส่วนบุคคลและข้อมูลสุขภาพ เพื่อติดตามอาการตามนโยบาย PDPA
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={!userId || isPending}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all font-prompt"
        >
          {isPending ? 'กำลังบันทึกข้อมูล...' : (
            <>
              <ShieldCheck size={20} className="text-green-400" />
              ยืนยันการลงทะเบียน
            </>
          )}
        </button>
      </form>
    </div>
  )
}