'use client'

import { useEffect, useState, useActionState } from 'react'
import liff from '@line/liff'
import { createLog } from '../actions'
import { Send, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function RecordPage() {
  const [userId, setUserId] = useState<string>('')
  
  // State สำหรับเก็บค่าที่คนเลือกจาก Card
  const [whealScore, setWhealScore] = useState<number | null>(null)
  const [itchScore, setItchScore] = useState<number | null>(null)
  
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
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 font-prompt">
      {/* Header สีเขียวสดใส */}
      <div className="bg-[#10B981] text-white p-6 rounded-b-[2.5rem] shadow-lg">
        <div className="flex items-center gap-4 mb-2">
           <Link href="/" className="p-2 bg-white/20 rounded-xl"><ChevronLeft size={20}/></Link>
           <div>
             <h1 className="text-xl font-bold">บันทึกอาการวันนี้</h1>
             <p className="text-[10px] opacity-80 uppercase tracking-wider">UAS7 Diary • AllerCare</p>
           </div>
        </div>
      </div>

      <form action={formAction} className="p-6 pb-32 space-y-8">
        {/* Hidden Inputs สำหรับส่งค่าไปยัง Server Action */}
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="wheals" value={whealScore ?? ''} />
        <input type="hidden" name="itch" value={itchScore ?? ''} />

        {/* 1. ส่วนเลือกจำนวนผื่น (Selection Cards) */}
        <section>
          <div className="flex items-baseline gap-2 mb-4">
            <h2 className="text-sm font-bold text-slate-700">1. จำนวนผื่นนูนแดง</h2>
            <span className="text-[10px] text-slate-400 font-normal">(ใน 24 ชม.)</span>
          </div>
          <div className="space-y-3">
            {[
              { val: 0, label: 'ไม่มีผื่น', desc: 'ผิวปกติ' },
              { val: 1, label: '< 20 ผื่น', desc: 'เล็กน้อย' },
              { val: 2, label: '20 - 50 ผื่น', desc: 'ปานกลาง' },
              { val: 3, label: '> 50 ผื่น', desc: 'เยอะมาก / เป็นปื้น' }
            ].map((item) => (
              <div 
                key={item.val}
                onClick={() => setWhealScore(item.val)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${
                  whealScore === item.val ? 'border-green-500 bg-green-50 shadow-sm' : 'border-white bg-white shadow-sm'
                }`}
              >
                <div>
                  <p className={`font-bold text-sm ${whealScore === item.val ? 'text-green-700' : 'text-slate-600'}`}>{item.label}</p>
                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                </div>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  whealScore === item.val ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>{item.val}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. ส่วนเลือกความรุนแรงอาการคัน (Emoji Rating) */}
        <section>
          <h2 className="text-sm font-bold text-slate-700 mb-4">2. ความรุนแรงอาการคัน</h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { val: 0, icon: '😊', label: 'ไม่คัน' },
              { val: 1, icon: '😐', label: 'น้อย' },
              { val: 2, icon: '😟', label: 'กลาง' },
              { val: 3, icon: '😫', label: 'มาก' }
            ].map((item) => (
              <div 
                key={item.val}
                onClick={() => setItchScore(item.val)}
                className={`py-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                  itchScore === item.val ? 'border-green-500 bg-green-50' : 'border-white bg-white'
                }`}
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className={`text-[10px] font-bold ${itchScore === item.val ? 'text-green-600' : 'text-slate-400'}`}>{item.val}</div>
              </div>
            ))}
          </div>
          {itchScore !== null && (
             <p className="text-center mt-3 text-[10px] text-green-600 font-medium">
               {['ไม่มีอาการคัน', 'คันเล็กน้อย(ไม่รบกวนการดำเนินชีวิต)', 'คันปานกลาง(ระบบชีวิตประจำวันหรือการนอนหลับบางเวลา))', 'คันมาก(รบกวนชีวิตประจำวันมากจนทำกิจวัตรไม่ได้หรือนอนไม่หลับตลอดเวลา)'][itchScore]}
             </p>
          )}
        </section>

        {/* 3. บันทึกเพิ่มเติม */}
        <section>
          <h2 className="text-sm font-bold text-slate-700 mb-2">บันทึกเพิ่มเติม</h2>
          <textarea 
            name="note" 
            placeholder="ระบุอาการอื่นๆ หรือปัจจัยกระตุ้น (ถ้ามี)"
            className="w-full p-4 rounded-2xl bg-white border border-slate-100 outline-none focus:ring-2 focus:ring-green-500 h-24 text-sm"
          />
        </section>

        {/* Footer: สรุปคะแนนและปุ่มบันทึก (Sticky Bottom) */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-slate-100 flex items-center justify-between max-w-md mx-auto z-50">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">คะแนนรวมวันนี้</p>
            <p className="text-2xl font-black text-[#10B981]">
              {(whealScore ?? 0) + (itchScore ?? 0)} <span className="text-sm font-normal text-slate-300">/ 6</span>
            </p>
          </div>
          <button 
            type="submit" 
            disabled={!userId || isPending || whealScore === null || itchScore === null}
            className="bg-[#10B981] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-green-100 active:scale-95 disabled:opacity-30 transition-all"
          >
            {isPending ? '...' : <><Send size={18} /> บันทึก</>}
          </button>
        </div>
      </form>
    </div>
  )
}