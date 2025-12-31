// src/app/record/page.tsx
'use client'

import { useState } from 'react'
import { createLog } from '../actions' // เรียกใช้ฟังก์ชันจากข้อ 2
import { Send, AlertCircle } from 'lucide-react'

export default function RecordPage() {
  const [wheals, setWheals] = useState(0)
  const [itch, setItch] = useState(0)
  const totalScore = wheals + itch

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-green-500 text-white p-6 rounded-b-3xl shadow-sm">
        <h1 className="text-xl font-bold">บันทึกอาการวันนี้</h1>
        <p className="text-green-100 text-sm opacity-90">UAS7 Diary • AllerCare</p>
      </div>

      <form action={createLog} className="p-5 space-y-6">
        
        {/* 1. จำนวนผื่น */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <label className="font-semibold text-slate-800 mb-4 block flex items-center gap-2">
            1. จำนวนผื่นนูนแดง <span className="text-xs text-slate-400 font-normal">(ใน 24 ชม.)</span>
          </label>
          
          <div className="space-y-3">
            {[
              { val: 0, label: "ไม่มีผื่น", desc: "ผิวปกติ" },
              { val: 1, label: "< 20 ผื่น", desc: "เล็กน้อย" },
              { val: 2, label: "20 - 50 ผื่น", desc: "ปานกลาง" },
              { val: 3, label: "> 50 ผื่น", desc: "เยอะมาก / เป็นปื้น" },
            ].map((option) => (
              <label key={option.val} className={`relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${wheals === option.val ? 'border-green-500 bg-green-50' : 'border-slate-100 hover:border-slate-200'}`}>
                <input 
                  type="radio" 
                  name="wheals" 
                  value={option.val} 
                  className="sr-only" 
                  onChange={() => setWheals(option.val)}
                  checked={wheals === option.val}
                />
                <div>
                  <div className={`font-medium ${wheals === option.val ? 'text-green-700' : 'text-slate-700'}`}>{option.label}</div>
                  <div className="text-xs text-slate-400">{option.desc}</div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${wheals === option.val ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {option.val}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 2. อาการคัน */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <label className="font-semibold text-slate-800 mb-4 block">
            2. ความรุนแรงอาการคัน
          </label>
          
          <div className="grid grid-cols-4 gap-2">
             {[0, 1, 2, 3].map((val) => (
               <label key={val} className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${itch === val ? 'border-green-500 bg-green-50' : 'border-slate-100'}`}>
                 <input 
                    type="radio" 
                    name="itch" 
                    value={val} 
                    className="sr-only" 
                    onChange={() => setItch(val)} 
                  />
                 <span className={`text-xl mb-1 ${itch === val ? 'scale-110' : 'grayscale opacity-50'}`}>
                   {val === 0 ? '🙂' : val === 1 ? '😐' : val === 2 ? '😣' : '😫'}
                 </span>
                 <span className={`text-sm font-bold ${itch === val ? 'text-green-600' : 'text-slate-400'}`}>{val}</span>
               </label>
             ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-3">
            {itch === 0 && "ไม่มีอาการคัน"}
            {itch === 1 && "คันเล็กน้อย ไม่รำคาญ"}
            {itch === 2 && "คันปานกลาง รำคาญบ้าง"}
            {itch === 3 && "คันมาก รบกวนชีวิต/การนอน"}
          </p>
        </div>

        {/* Note */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <label className="text-sm font-medium text-slate-600 mb-2 block">หมายเหตุ</label>
          <textarea 
            name="note" 
            rows={3} 
            placeholder="เช่น ทานอาหารทะเล, อากาศร้อน..."
            className="w-full text-sm p-3 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-green-500 outline-none resize-none"
          ></textarea>
        </div>

        {/* Footer Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between max-w-md mx-auto">
          <div className="flex flex-col">
             <span className="text-xs text-slate-500">คะแนนรวม</span>
             <span className={`text-2xl font-bold ${totalScore >= 4 ? 'text-red-500' : 'text-green-500'}`}>
               {totalScore} <span className="text-sm text-slate-300 font-normal">/ 6</span>
             </span>
          </div>
          <button 
            type="submit" 
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-green-200 flex items-center gap-2 transition-transform active:scale-95"
          >
            <Send size={18} />
            บันทึก
          </button>
        </div>

      </form>
    </div>
  )
}