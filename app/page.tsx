'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import liff from '@line/liff'
import { ClipboardList, History, Calendar, Bell, ChevronRight, UserCog } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [profilePic, setProfilePic] = useState<string>('')
  const [details, setDetails] = useState({ totalScore: 0, dayCount: 0, avgWheal: 0, avgItch: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initApp = async () => {
      try {
        await liff.ready
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile()
          setProfilePic(profile.pictureUrl || '')
          const res = await fetch(`/api/user/check?id=${profile.userId}`)
          const data = await res.json()
          if (!data.registered) {
            router.replace('/register')
          } else {
            setUserData(data.user)
            setDetails(data.details)
            setLoading(false)
          }
        } else { liff.login() }
      } catch (error) { console.error(error) }
    }
    initApp()
  }, [router])

  if (loading) return <div className="min-h-screen flex items-center justify-center font-prompt text-slate-400">กำลังโหลด...</div>

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 font-prompt">
      
      {/* --- ส่วนสีเขียว (กรอบสีแดงตามที่คุณต้องการ) --- */}
      <div className="bg-[#10B981] text-white p-6 pb-10 rounded-b-[3rem] shadow-lg">
        {/* Profile Section */}
        <div className="flex justify-between items-start mb-6 pt-4">
          <div className="flex items-center gap-3">
            <img src={profilePic} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white/20 shadow-sm" />
            <div>
              <p className="text-green-100 text-[10px] uppercase tracking-tighter opacity-80">ผู้ป่วย ALLERCARE</p>
              <h1 className="text-lg font-bold leading-tight">
                {userData?.prefix}{userData?.firstName} {userData?.lastName}
              </h1>
            </div>
          </div>
          <button className="bg-white/20 p-2 rounded-full border border-white/10 active:scale-90">
            <Bell size={20} />
          </button>
        </div>

        {/* Dashboard Card (ส่วนที่แสดงคะแนนและค่าเฉลี่ย) */}
        <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-5 border border-white/20 shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-[10px] text-green-50 opacity-80 uppercase tracking-wider mb-1">คะแนนรวม 7 วัน (UAS7)</p>
              <h2 className="text-4xl font-black">
                {details.totalScore} <span className="text-lg font-medium opacity-50">/ 42</span>
              </h2>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-green-600 font-bold shadow-sm text-sm">
              D-{details.dayCount || 1}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-green-900/20 h-2 rounded-full overflow-hidden mb-5">
            <div 
              className="bg-white h-full transition-all duration-1000 ease-out" 
              style={{ width: `${(Math.min(details.dayCount, 7) / 7) * 100}%` }}
            ></div>
          </div>

          {/* ค่าเฉลี่ยแยกตามอาการ */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-[9px] text-green-50 uppercase opacity-60 mb-0.5">เฉลี่ยจำนวนผื่น</p>
              <p className="text-sm font-bold">{details.avgWheal} <span className="text-[10px] font-normal opacity-70">คะแนน</span></p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-[9px] text-green-50 uppercase opacity-60 mb-0.5">เฉลี่ยอาการคัน</p>
              <p className="text-sm font-bold">{details.avgItch} <span className="text-[10px] font-normal opacity-70">คะแนน</span></p>
            </div>
          </div>
        </div>
      </div>
      {/* --- สิ้นสุดส่วนสีเขียว --- */}

      {/* --- ส่วนปุ่มแอคชั่น (อยู่นอกสีเขียว บนพื้นสีเทาอ่อน) --- */}
      <div className="p-6 space-y-4">
        
        {/* ปุ่มหลัก: บันทึกอาการ */}
        <Link href="/record" className="block group active:scale-95 transition-all">
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-2xl text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
              <ClipboardList size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-md">บันทึกอาการลมพิษ</h3>
              <p className="text-[10px] text-slate-400">ประเมินคะแนนประจำวันนี้</p>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </div>
        </Link>

        {/* ปุ่มรอง: ดูประวัติ และ บัญชีของฉัน */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/history" className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center gap-2 active:scale-95 transition-all group">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <History size={22} />
            </div>
            <span className="font-bold text-slate-700 text-xs tracking-tight">ดูประวัติ</span>
          </Link>
          
          <Link href="/register" className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center gap-2 active:scale-95 transition-all group">
            <div className="bg-purple-50 p-3 rounded-2xl text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
              <UserCog size={22} />
            </div>
            <span className="font-bold text-slate-700 text-xs tracking-tight">บัญชีของฉัน</span>
          </Link>
        </div>

        {/* ปุ่มจิ๋ว: แพ้อื่นๆ */}
        <Link href="/other-allergies" className="flex items-center justify-center gap-2 py-3 text-slate-400 hover:text-orange-400 transition-colors">
          <Calendar size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">บันทึกอาการแพ้อื่นๆ</span>
        </Link>
      </div>

    </div>
  )
}