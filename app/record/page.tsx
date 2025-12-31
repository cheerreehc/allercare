'use client'

import { useEffect, useState, useActionState } from 'react'
import liff from '@line/liff'
import { createLog } from '../actions' // ปรับ path ให้ตรงกับที่อยู่ไฟล์ actions.ts ของคุณ
import { ClipboardCheck, Info, AlertCircle } from 'lucide-react'

export default function RecordPage() {
  const [userId, setUserId] = useState<string>('')
  
  // แก้ขีดแดง action: ใช้ useActionState เพื่อจัดการสถานะการส่งฟอร์ม
  const [state, formAction, isPending] = useActionState(createLog, null)

  useEffect(() => {
    const initLiff = async () => {
      await liff.ready
      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile()
        setUserId(profile.userId)
      }
    }
    initLiff()
  }, [])

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 p-6 font-prompt">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-500 p-2 rounded-xl text-white">
          <ClipboardCheck size={24} />
        </div>
        <h1 className="text-xl font-bold">บันทึกอาการรายวัน</h1>
      </div>

      <form action={formAction} className="space-y-6">
        {/* ส่ง userId ไปยัง Server Action */}
        <input type="hidden" name="userId" value={userId} />

        {state?.error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-2 text-sm border border-red-100">
            <AlertCircle size={18} />
            {state.error}
          </div>
        )}

        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
          {/* ส่วนของ Input คะแนนผื่นและคัน (Wheals / Itch) ใส่ชื่อ name="wheals" และ name="itch" ให้ตรงกับ action */}
          <section>
            <label className="text-sm font-bold text-slate-700 mb-4 block">จำนวนผื่น (Wheals)</label>
            <select name="wheals" className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-green-500">
              <option value="0">0: ไม่มีผื่น</option>
              <option value="1">1: น้อยกว่า 20 จุด / 24 ชม.</option>
              <option value="2">2: 20-50 จุด / 24 ชม.</option>
              <option value="3">3: มากกว่า 50 จุด หรือผื่นใหญ่ต่อเนื่อง</option>
            </select>
          </section>

          <section>
            <label className="text-sm font-bold text-slate-700 mb-4 block">ความคัน (Itch Severity)</label>
            <select name="itch" className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-green-500">
              <option value="0">0: ไม่คัน</option>
              <option value="1">1: คันเล็กน้อย (ไม่รบกวนชีวิตประจำวัน)</option>
              <option value="2">2: คันปานกลาง (รบกวนแต่ไม่กระทบการนอน)</option>
              <option value="3">3: คันมาก (กระทบการใช้ชีวิตหรือการนอน)</option>
            </select>
          </section>

          <section>
            <label className="text-sm font-bold text-slate-700 mb-2 block">บันทึกเพิ่มเติม</label>
            <textarea 
              name="note" 
              placeholder="ระบุอาการอื่นๆ หรือปัจจัยกระตุ้น (ถ้ามี)"
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-green-500 h-24"
            />
          </section>
        </div>

        <button 
          type="submit" 
          disabled={!userId || isPending}
          className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl shadow-xl active:scale-95 disabled:opacity-50 transition-all"
        >
          {isPending ? 'กำลังบันทึกข้อมูล...' : 'บันทึกอาการวันนี้'}
        </button>
      </form>
    </div>
  )
}