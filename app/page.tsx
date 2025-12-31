// src/app/page.tsx
import Link from 'next/link'
import { ClipboardList, History, Calendar, Bell, ChevronRight } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50">
      {/* ส่วนบน: Profile & Summary */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-b-[2.5rem] shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">สวัสดีครับ!</h1>
            <p className="text-green-100 text-sm">วันนี้อาการภูมิแพ้เป็นอย่างไรบ้าง?</p>
          </div>
          <button className="bg-white/20 p-2 rounded-full border border-white/30">
            <Bell size={20} />
          </button>
        </div>

        {/* คะแนนปัจจุบัน (UAS7 Summary) */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-green-100 uppercase tracking-wider">คะแนนรวม 7 วัน (UAS7)</p>
              <h2 className="text-4xl font-black mt-1">12 <span className="text-lg font-normal">/ 42</span></h2>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-inner text-green-600 font-bold">
              D-4
            </div>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full mt-4">
            <div className="bg-white h-2 rounded-full w-[60%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          </div>
        </div>
      </div>

      {/* เมนูหลัก */}
      <div className="p-6 -mt-4 space-y-4">
        
        {/* ปุ่มบันทึกลมพิษ (Highlight) */}
        <Link href="/record" className="block transform transition-transform active:scale-95">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110"></div>
            <div className="bg-green-100 p-4 rounded-2xl text-green-600 relative z-10">
              <ClipboardList size={28} />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-bold text-slate-800 text-lg">บันทึกอาการลมพิษ</h3>
              <p className="text-xs text-slate-400">แบบฟอร์ม UAS7 มาตรฐานการแพทย์</p>
            </div>
            <ChevronRight className="text-slate-300 relative z-10" />
          </div>
        </Link>

        {/* เมนูย่อยอื่นๆ */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/history" className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-3 active:scale-95 transition-all">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-500">
              <History size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">ดูประวัติ</p>
              <p className="text-[10px] text-slate-400">ย้อนหลัง 7-30 วัน</p>
            </div>
          </Link>

          <Link href="/other-allergies" className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-3 active:scale-95 transition-all">
            <div className="bg-orange-50 p-3 rounded-2xl text-orange-500">
              <Calendar size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">แพ้อื่นๆ</p>
              <p className="text-[10px] text-slate-400">จาม, คัดจมูก, ผื่นแพ้</p>
            </div>
          </Link>
        </div>

        {/* Tips การดูแลตัวเอง */}
        <div className="pt-4">
          <h4 className="text-sm font-bold text-slate-500 mb-3 px-2">คำแนะนำการดูแลตนเอง</h4>
          <div className="bg-slate-800 text-white p-5 rounded-3xl shadow-lg flex items-start gap-4">
             <div className="bg-slate-700 p-2 rounded-lg">💡</div>
             <p className="text-xs leading-relaxed opacity-90">
                หากมีอาการผื่นบวมแดงร่วมกับอาการแน่นหน้าอก หรือหายใจไม่ออก กรุณาพบแพทย์ทันที
             </p>
          </div>
        </div>

      </div>
    </div>
  )
}