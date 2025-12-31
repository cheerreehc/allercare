'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import liff from '@line/liff'
import { ClipboardList, History, Calendar, Bell, ChevronRight, UserCog, CheckCircle2, AlertCircle } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [profilePic, setProfilePic] = useState<string>('')
  const [details, setDetails] = useState({ 
    totalScore: 0, 
    dayCount: 0, 
    avgWheal: "0.0", 
    avgItch: "0.0",
    hasLogToday: false,
    daysLeft: 7
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'success') {
      // คุณสามารถใช้ Swal.fire() ถ้าลง sweetalert2 ไว้ หรือ alert ปกติก็ได้ครับ
      alert('บันทึกข้อมูลวันนี้เรียบร้อยแล้วค่ะ!');
      // ลบ query string ออกจาก URL เพื่อให้เวลา refresh ไม่เด้ง alert ซ้ำ
      router.replace('/');
    }

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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-prompt text-slate-400 text-sm">กำลังโหลดข้อมูล...</div>

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 font-prompt">
      
      {/* --- ส่วนสีเขียว (Header & Card) --- */}
      <div className="bg-[#10B981] text-white p-6 pb-10 rounded-b-[3rem] shadow-lg shadow-green-100">
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
          <button className="bg-white/20 p-2 rounded-full border border-white/10 active:scale-90 relative">
            <Bell size={20} />
            {!details.hasLogToday && <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full border border-green-600"></span>}
          </button>
        </div>

        {/* Dashboard Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-5 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-[10px] text-green-50 opacity-80 uppercase mb-1">ระดับความรุนแรง (UAS7)</p>
              <h2 className="text-4xl font-black">
                {details.totalScore} <span className="text-lg font-medium opacity-50">/ 42</span>
              </h2>
              {/* ส่วนแปลผล */}
              <p className="text-[11px] font-bold mt-1 px-2 py-0.5 rounded-full bg-white/20 inline-block">
                {details.totalScore >= 28 ? "🔴 อาการรุนแรง" : 
                details.totalScore >= 16 ? "🟠 อาการปานกลาง" :
                details.totalScore >= 1 ? "🟡 อาการเล็กน้อย" : "🟢 คุมอาการได้ดี"}
              </p>
            </div>
            <div className="text-center">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-green-600 font-bold text-sm shadow-sm">
                D-{details.dayCount}
              </div>
              <p className="text-[8px] mt-1 opacity-60">จำนวนวันที่บันทึก</p>
            </div>
          </div>

          {/* แถบวัดระดับความรุนแรง (แทน Progress Bar เดิม) */}
          <div className="w-full bg-slate-200/30 h-3 rounded-full overflow-hidden mb-5 flex">
            <div className="h-full bg-green-400" style={{ width: '35%' }}></div> {/* 0-15 */}
            <div className="h-full bg-orange-400" style={{ width: '30%' }}></div> {/* 16-27 */}
            <div className="h-full bg-red-500" style={{ width: '35%' }}></div> {/* 28-42 */}
            {/* เข็มชี้ตำแหน่งคะแนนปัจจุบัน */}
            <div 
              className="absolute h-5 w-1 bg-white shadow-md transform -translate-y-1 transition-all duration-1000"
              style={{ left: `${(details.totalScore / 42) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* --- ส่วนแจ้งเตือนสถานะ (Countdown) --- */}
      <div className="px-6 -mt-5 relative z-10">
        {details.hasLogToday ? (
          <div className="bg-white border border-green-100 p-4 rounded-3xl flex items-center gap-3 shadow-xl shadow-slate-200/50 group">
            <div className="bg-green-500 text-white p-2 rounded-2xl">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-800 font-bold">บันทึกอาการเรียบร้อย!</p>
              <p className="text-[10px] text-green-600 font-medium">
                {details.daysLeft > 0 
                  ? `เก่งมาก! อีกแค่ ${details.daysLeft} วัน จะครบสัปดาห์` 
                  : 'ยินดีด้วย! คุณบันทึกครบ 7 วันตามเป้าหมายแล้ว'}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-orange-100 p-4 rounded-3xl flex items-center gap-3 shadow-xl shadow-slate-200/50">
            <div className="bg-orange-500 text-white p-2 rounded-2xl animate-pulse">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-800 font-bold">วันนี้ยังไม่ได้บันทึก</p>
              <p className="text-[10px] text-orange-500 font-medium italic">อย่าลืมประเมินอาการเพื่อความต่อเนื่องนะคะ</p>
            </div>
          </div>
        )}
      </div>

      {/* --- ส่วนปุ่มแอคชั่น --- */}
      <div className="p-6 pt-8 space-y-4">
        
        {/* ปุ่มหลัก: บันทึกอาการ */}
        <Link href="/record" className="block group active:scale-[0.98] transition-all">
          <div className={`p-5 rounded-[2rem] shadow-sm border flex items-center gap-4 transition-colors ${
            details.hasLogToday 
              ? 'bg-slate-50 border-slate-100 opacity-80' 
              : 'bg-white border-green-100'
          }`}>
            <div className={`p-3 rounded-2xl transition-all ${
              details.hasLogToday ? 'bg-slate-200 text-slate-500' : 'bg-green-50 text-green-500 group-hover:bg-green-500 group-hover:text-white'
            }`}>
              <ClipboardList size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-md">
                {details.hasLogToday ? 'แก้ไขบันทึกวันนี้' : 'บันทึกอาการลมพิษ'}
              </h3>
              <p className="text-[10px] text-slate-400">ประเมินคะแนนประจำวันนี้</p>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </div>
        </Link>

        {/* ปุ่มรอง: ดูประวัติ และ บัญชีของฉัน */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/history" className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center gap-2 active:scale-95 transition-all group">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all font-bold">
              <History size={22} />
            </div>
            <span className="font-bold text-slate-700 text-xs tracking-tight">ดูประวัติ</span>
          </Link>
          
          <Link href="/register" className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center gap-2 active:scale-95 transition-all group">
            <div className="bg-purple-50 p-3 rounded-2xl text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all font-bold">
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