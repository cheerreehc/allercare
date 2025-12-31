'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // เพิ่ม useRouter สำหรับการเปลี่ยนหน้า
import Link from 'next/link'
import liff from '@line/liff'
import { ClipboardList, History, Calendar, Bell, ChevronRight } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState<string>('คุณคนไข้')
  const [profilePic, setProfilePic] = useState<string>('')
  const [isCheckRegis, setIsCheckRegis] = useState(true) // ใช้สำหรับ Loading หน้าจอขณะเช็คข้อมูล

  useEffect(() => {
    const initAndCheckUser = async () => {
      try {
        await liff.ready;
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile()
          setDisplayName(profile.displayName)
          setProfilePic(profile.pictureUrl || '')

          // 1. เช็คสถานะการลงทะเบียนจาก API
          const res = await fetch(`/api/user/check?id=${profile.userId}`)
          const data = await res.json()

          // 2. ถ้ายังไม่ลงทะเบียน ให้ดีดไปหน้า Register
          if (!data.registered) {
            router.replace('/register')
          } else {
            setIsCheckRegis(false) // ลงทะเบียนแล้ว ให้แสดงหน้า Dashboard
          }
        } else {
          liff.login()
        }
      } catch (error) {
        console.error('LIFF Init Error:', error)
      }
    }
    initAndCheckUser()
  }, [router])

  // ขณะกำลังเช็คข้อมูลให้แสดงหน้า Loading สวยๆ
  if (isCheckRegis) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-prompt text-sm">กำลังเตรียมข้อมูลสุขภาพของคุณ...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50">
      {/* ส่วนบน: Profile & Summary */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-b-[2.5rem] shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            {profilePic && (
              <img src={profilePic} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white/50" />
            )}
            <div>
              <h1 className="text-xl font-bold font-prompt">สวัสดีครับ {displayName}!</h1>
              <p className="text-green-100 text-xs opacity-90">วันนี้อาการภูมิแพ้เป็นอย่างไรบ้าง?</p>
            </div>
          </div>
          <button className="bg-white/20 p-2 rounded-full border border-white/30">
            <Bell size={20} />
          </button>
        </div>

        {/* คะแนนปัจจุบัน (UAS7 Summary) */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] text-green-100 uppercase tracking-wider">คะแนนรวม 7 วัน (UAS7)</p>
              <h2 className="text-4xl font-black mt-1 font-prompt">0 <span className="text-lg font-normal">/ 42</span></h2>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-inner text-green-600 font-bold">
              D-1
            </div>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full mt-4">
            <div className="bg-white h-2 rounded-full w-[15%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          </div>
        </div>
      </div>

      {/* เมนูหลัก */}
      <div className="p-6 -mt-4 space-y-4">
        {/* ปุ่มบันทึกลมพิษ (Highlight) */}
        <Link href="/record" className="block transform transition-transform active:scale-95">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 relative overflow-hidden group font-prompt">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110"></div>
            <div className="bg-green-100 p-4 rounded-2xl text-green-600 relative z-10">
              <ClipboardList size={28} />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-bold text-slate-800 text-lg">บันทึกอาการลมพิษ</h3>
              <p className="text-xs text-slate-400">แบบฟอร์ม UAS7 รายวัน</p>
            </div>
            <ChevronRight className="text-slate-300 relative z-10" />
          </div>
        </Link>

        {/* เมนูย่อยอื่นๆ */}
        <div className="grid grid-cols-2 gap-4 font-prompt">
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
        <div className="pt-4 font-prompt">
          <h4 className="text-sm font-bold text-slate-500 mb-3 px-2">คำแนะนำการดูแลตนเอง</h4>
          <div className="bg-slate-800 text-white p-5 rounded-3xl shadow-lg flex items-start gap-4">
             <div className="bg-slate-700 p-2 rounded-lg text-lg">💡</div>
             <p className="text-[11px] leading-relaxed opacity-90 font-light">
                หากมีอาการผื่นบวมแดงร่วมกับอาการแน่นหน้าอก หรือหายใจไม่ออก กรุณาพบแพทย์ทันที
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}