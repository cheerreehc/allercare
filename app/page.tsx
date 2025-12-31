'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import liff from '@line/liff'
import { ClipboardList, History, Calendar, Bell, ChevronRight, UserCog, CheckCircle2, AlertCircle, Info } from 'lucide-react'

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
              <p className="text-green-100 text-[10px] uppercase tracking-tighter opacity-80">ALLER CARE -</p>
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

        {/* Dashboard Card - เปลี่ยนเป็นสีขาวทึบเพื่อให้ตัวหนังสือชัดเจน */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-green-900/20 text-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                ระดับความรุนแรง (UAS7)
              </p>
              <div className="flex items-baseline gap-1">
                <h2 className="text-4xl font-black text-slate-800">{details.totalScore}</h2>
                <span className="text-lg font-medium text-slate-300">/ 42</span>
              </div>
              
              {/* ส่วนแปลผลตามมาตรฐานแพทย์ */}
              <div className="mt-2 flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${
                  details.totalScore >= 28 ? "bg-red-500" : 
                  details.totalScore >= 16 ? "bg-orange-500" :
                  details.totalScore >= 1 ? "bg-yellow-500" : "bg-green-500"
                }`}></div>
                <p className="text-[11px] font-bold text-slate-600">
                  {details.totalScore >= 28 ? "อาการรุนแรง (ควรพบแพทย์)" : 
                  details.totalScore >= 16 ? "อาการปานกลาง" :
                  details.totalScore >= 1 ? "อาการเล็กน้อย" : "คุมอาการได้ดีมาก"}
                </p>
              </div>
            </div>
            
            <div className="bg-green-50 px-3 py-1.5 rounded-2xl text-center">
              <p className="text-[10px] text-green-600 font-bold leading-none">DAY</p>
              <p className="text-lg font-black text-green-700 leading-tight">{details.dayCount}</p>
            </div>
          </div>

          {/* แถบเกจวัดความรุนแรง (ยิ่งน้อยยิ่งดี) */}
          <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6 flex">
            <div className="h-full bg-green-400/40 border-r border-white" style={{ width: '35%' }}></div>
            <div className="h-full bg-yellow-400/40 border-r border-white" style={{ width: '30%' }}></div>
            <div className="h-full bg-red-400/40" style={{ width: '35%' }}></div>
            
            {/* เข็มชี้ตำแหน่งคะแนน */}
            <div 
              className="absolute top-0 h-full w-1.5 bg-slate-800 rounded-full transition-all duration-1000 shadow-sm"
              style={{ left: `calc(${(details.totalScore / 42) * 100}% - 3px)` }}
            ></div>
          </div>

          {/* สถิติเฉลี่ย */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
            <div className="text-left">
              <p className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">เฉลี่ยผื่น</p>
              <p className="text-sm font-bold text-slate-700">{details.avgWheal} <span className="text-[10px] font-normal text-slate-400">คะแนน</span></p>
            </div>
            <div className="text-left border-l border-slate-100 pl-4">
              <p className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">เฉลี่ยคัน</p>
              <p className="text-sm font-bold text-slate-700">{details.avgItch} <span className="text-[10px] font-normal text-slate-400">คะแนน</span></p>
            </div>
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

        {/* --- ส่วนคำแนะนำในการดูแลตนเอง (อ้างอิงตามเอกสารแพทย์) --- */}
        <div className="mt-8 px-2">
          <div className="flex items-center gap-2 mb-4 text-slate-800">
            <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600">
              <Info size={18} />
            </div>
            <h3 className="font-bold text-sm">วิธีการดูแลตนเองเมื่อเกิดโรคลมพิษ</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 1, text: "หลีกเลี่ยงสาเหตุที่ทำให้เกิดผื่นลมพิษ" },
              { id: 2, text: "ใช้ยาต้านฮีสตามีนตามสั่งหรือแก้แพ้ชนิดที่ไม่ง่วง เพื่อหลีกเลี่ยงผลข้างเคียง" },
              { id: 3, text: "ดูแลผิวไม่ให้ผิวแห้ง หมั่นทาครีมหรือโลชั่นที่ไร้น้ำหอม เพื่อลดความไวของผิวหนัง" },
              { id: 4, text: "หลีกเลี่ยงการกระตุ้นผิวหนัง เช่น แกะเกา ขีดข่วน ใส่เสื้อรัด เสียดสี สะพายของหนัก เป็นต้น" }
            ].map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-3 shadow-sm items-start">
                <span className="bg-blue-50 text-blue-500 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  {item.id}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <p className="text-[9px] text-slate-400 mt-4 text-center italic tracking-tight">
            *อ้างอิงจากแนวทางการดูแลรักษาโรคลมพิษ 2557
          </p>
        </div>
      </div>
    </div>

  )
}