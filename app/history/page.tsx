'use client'

import { useEffect, useState } from 'react'
import liff from '@line/liff'
import { ChevronLeft, CalendarDays, Loader2 } from 'lucide-react'
import Link from 'next/link'

// 1. กำหนด Interface เพื่อบอก TypeScript ว่า Log หน้าตาเป็นยังไง
interface DailyLog {
  id: string;
  logDate: string;
  whealScore: number;
  itchScore: number;
  totalScore: number;
  note?: string;
}

export default function HistoryPage() {
  // 2. ระบุ Type ให้กับ State
  const [logs, setLogs] = useState<DailyLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        await liff.ready
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile()
          
          // เพิ่ม timestamp ต่อท้าย url เพื่อป้องกัน Browser จำค่าเก่า (Cache Busting)
          const res = await fetch(`/api/user/logs?id=${profile.userId}&t=${Date.now()}`)
          const data = await res.json()
          
          console.log("Data from API:", data) // ตรวจสอบใน Console ของมือถือ/คอม
          
          if (data.logs && Array.isArray(data.logs)) {
            setLogs(data.logs)
          }
        }
      } catch (error) {
        console.error('Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  // 3. คำนวณคะแนนรวม 7 วัน
  const totalUAS7 = logs.reduce((sum, log) => sum + log.totalScore, 0)

  if (loading) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col items-center justify-center font-prompt">
        <Loader2 className="animate-spin text-green-500 mb-2" size={32} />
        <p className="text-slate-400 text-sm">กำลังดึงข้อมูลประวัติ...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white font-prompt pb-10">
      {/* Header */}
      <div className="p-6 bg-slate-50 flex items-center gap-4 border-b border-slate-100">
        <Link href="/" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 active:scale-90 transition-transform">
          <ChevronLeft size={20} className="text-slate-600" />
        </Link>
        <h1 className="text-xl font-bold text-slate-800">ประวัติอาการ (UAS7)</h1>
      </div>

      <div className="p-4">
        {/* Card สรุปคะแนนรวม */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-[2.5rem] mb-6 shadow-lg shadow-green-100 flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold mb-1">คะแนนรวม 7 วันล่าสุด</p>
            <h2 className="text-5xl font-black">
              {totalUAS7} <span className="text-lg font-normal opacity-70">/ 42</span>
            </h2>
          </div>
          <CalendarDays size={60} className="absolute -right-2 -bottom-2 opacity-20 rotate-12" />
        </div>

        {/* ตารางประวัติ */}
        <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
          <table className="w-full text-center border-collapse">
            <thead className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 border-b">วันที่</th>
                <th className="py-4 border-b">ผื่น</th>
                <th className="py-4 border-b">คัน</th>
                <th className="py-4 border-b bg-green-50 text-green-600">รวม</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 text-slate-500 font-medium">
                      {new Date(log.logDate).toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="py-5 text-slate-700 font-semibold">{log.whealScore}</td>
                    <td className="py-5 text-slate-700 font-semibold">{log.itchScore}</td>
                    <td className="py-4 bg-green-50/30">
                      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-xs">
                        {log.totalScore}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-20 text-slate-300 italic">ยังไม่มีข้อมูลบันทึกใน 7 วันนี้</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* หมายเหตุเพิ่มเติม (ถ้ามี) */}
        {logs.some(l => l.note) && (
          <div className="mt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase ml-2 mb-2 tracking-widest">บันทึกเพิ่มเติม</h3>
            <div className="space-y-2">
              {logs.filter(l => l.note).map((log) => (
                <div key={`note-${log.id}`} className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold mb-1">
                    {new Date(log.logDate).toLocaleDateString('th-TH')}:
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">{log.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}