'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import liff from '@line/liff'
import { ClipboardList, History, Calendar, Bell, ChevronRight } from 'lucide-react'

// ข้อมูลส่วนประกอบ UI อื่นๆ (ถ้ามี) ให้ไว้นอกฟังก์ชันได้
// แต่ State ทั้งหมดต้องอยู่ข้างใน Dashboard เท่านั้น

export default function Dashboard() {
  const router = useRouter()
  
  // ประกาศ State ทั้งหมดไว้ที่นี่ (ภายในฟังก์ชัน)
  const [userData, setUserData] = useState<{
    prefix: string;
    firstName: string;
    lastName: string;
  } | null>(null)
  const [profilePic, setProfilePic] = useState<string>('')
  const [isCheckRegis, setIsCheckRegis] = useState(true)
  const [stats, setStats] = useState({ totalScore: 0, currentDay: 0 }); // เพิ่ม State สำหรับเก็บค่าสถิติ
  // เพิ่ม State สำหรับเก็บ Details
  const [details, setDetails] = useState({
    totalScore: 0,
    dayCount: 0,
    avgWheal: 0,
    avgItch: 0
  });

  useEffect(() => {
    const initApp = async () => {
      try {
        await liff.ready
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile()
          setProfilePic(profile.pictureUrl || '')

          // เช็คสถานะการลงทะเบียนจาก API
          const res = await fetch(`/api/user/check?id=${profile.userId}`)
          const data = await res.json()

            if (!data.registered) {
              router.replace('/register')
            } else {
              setUserData(data.user)
              // ปรับให้ตรงกับชื่อ 'details' ที่ส่งมาจาก API
              setDetails({
                totalScore: data.details.totalScore,
                dayCount: data.details.dayCount,
                avgWheal: data.details.avgWheal,
                avgItch: data.details.avgItch
              }); 
              setIsCheckRegis(false)
            }

        } else {
          liff.login()
        }
      } catch (error) {
        console.error('LIFF Error:', error)
      }
    }
    initApp()
  }, [router])

  // หน้าจอตอนกำลังโหลด
  if (isCheckRegis) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-prompt">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-sm">กำลังตรวจสอบสิทธิ์การใช้งาน...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 font-prompt">
      {/* Header Profile */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-8 rounded-b-[2.5rem] shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            {profilePic && (
              <img src={profilePic} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white/50" />
            )}
            <div>
              <p className="text-green-100 text-[10px] uppercase tracking-wider opacity-80">ผู้ป่วย AllerCare</p>
              <h1 className="text-lg font-bold">
                {userData?.prefix}{userData?.firstName} {userData?.lastName}
              </h1>
            </div>
          </div>
          <button className="bg-white/20 p-2 rounded-full border border-white/30 active:scale-90">
            <Bell size={20} />
          </button>
        </div>

        {/* ส่วน Card คะแนนหลักใน return */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] text-green-100 uppercase tracking-wider opacity-80 font-prompt">คะแนนรวม 7 วัน (UAS7)</p>
              <h2 className="text-4xl font-black mt-1 font-prompt">
                {details.totalScore} <span className="text-lg font-normal opacity-50">/ 42</span>
              </h2>
            </div>
            {/* แสดงจำนวนวันที่บันทึกไปแล้ว เช่น D-3 */}
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-green-600 font-bold shadow-inner border border-green-100 font-prompt">
              D-{details.dayCount || 0}
            </div>
          </div>
          
          {/* Progress Bar แสดงความคืบหน้าการบันทึก (0-100%) */}
          <div className="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-700" 
              style={{ width: `${(Math.min(details.dayCount, 7) / 7) * 100}%` }}
            ></div>
          </div>

          {/* Mini Details: ส่วนข้อมูลย่อยแยกตามอาการ */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10 font-prompt">
            <div className="text-center">
              <p className="text-[9px] text-green-100 uppercase opacity-70">เฉลี่ยจำนวนผื่น</p>
              <p className="font-bold text-sm text-white">{details.avgWheal} <span className="text-[10px] font-normal opacity-60">คะแนน</span></p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-[9px] text-green-100 uppercase opacity-70">เฉลี่ยอาการคัน</p>
              <p className="font-bold text-sm text-white">{details.avgItch} <span className="text-[10px] font-normal opacity-60">คะแนน</span></p>
            </div>
          </div>
        </div>

      {/* เมนูหลัก */}
      <div className="p-6 -mt-4 space-y-4">
        <Link href="/record" className="block transform transition-transform active:scale-95">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="bg-green-100 p-4 rounded-2xl text-green-600">
              <ClipboardList size={28} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-lg">บันทึกอาการลมพิษ</h3>
              <p className="text-xs text-slate-400">ประเมินอาการรายวัน</p>
            </div>
            <ChevronRight className="text-slate-300" />
          </div>
        </Link>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/history" className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-2 active:scale-95 transition-all">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-500"><History size={24} /></div>
            <span className="font-bold text-slate-800 text-sm">ดูประวัติ</span>
          </Link>
          <Link href="/other-allergies" className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-2 active:scale-95 transition-all">
            <div className="bg-orange-50 p-3 rounded-2xl text-orange-500"><Calendar size={24} /></div>
            <span className="font-bold text-slate-800 text-sm">แพ้อื่นๆ</span>
          </Link>
        </div>
      </div>
    </div>
    </div>
    )
}