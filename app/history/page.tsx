'use client'

import { useEffect, useState } from 'react'
import liff from '@line/liff'
import { ChevronLeft, CalendarDays, Loader2, Info } from 'lucide-react'
import Link from 'next/link'

interface DailyLog {
  id: string;
  logDate: string;
  whealScore: number;
  itchScore: number;
  totalScore: number;
  note?: string;
}

export default function HistoryPage() {
  const [logs, setLogs] = useState<DailyLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        await liff.ready
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile()
          // ใช้ /logs (มี s) ตามที่เราตกลงกัน และเติม timestamp กัน cache
          const res = await fetch(`/api/user/logs?id=${profile.userId}&t=${Date.now()}`)
          const data = await res.json()
          setLogs(data.logs || [])
        }
      } catch (error) {
        console.error('Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const totalUAS7 = logs.reduce((sum, log) => sum + log.totalScore, 0)

  // ฟังก์ชันแปลผลคะแนน UAS7 ตามมาตรฐานแพทย์
  const getInterpretation = (score: number) => {
    if (score === 0) return { label: "คุมโรคได้สมบูรณ์", color: "bg-emerald-500", text: "text-emerald-500" };
    if (score <= 6) return { label: "คุมโรคได้ดีมาก", color: "bg-green-500", text: "text-green-500" };
    if (score <= 15) return { label: "อาการเล็กน้อย", color: "bg-yellow-500", text: "text-yellow-600" };
    if (score <= 27) return { label: "อาการปานกลาง", color: "bg-orange-500", text: "text-orange-500" };
    return { label: "อาการรุนแรง", color: "bg-red-500", text: "text-red-500" };
  }

  const status = getInterpretation(totalUAS7);

  if (loading) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col items-center justify-center font-prompt">
        <Loader2 className="animate-spin text-green-500 mb-2" size={32} />
        <p className="text-slate-400 text-sm">กำลังดึงข้อมูลประวัติ...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 font-prompt pb-10">
      {/* Header */}
      <div className="p-6 bg-white flex items-center gap-4 border-b border-slate-100 sticky top-0 z-20">
        <Link href="/" className="p-2 bg-slate-50 rounded-xl active:scale-90 transition-transform">
          <ChevronLeft size={20} className="text-slate-600" />
        </Link>
        <h1 className="text-xl font-bold text-slate-800">ประวัติอาการ 7 วัน</h1>
      </div>

      <div className="p-4">
        {/* Card สรุปคะแนนรวมและการแปลผล */}
        <div className={`${status.color} text-white p-6 rounded-[2.5rem] mb-6 shadow-lg shadow-green-100 relative overflow-hidden transition-colors duration-500`}>
          <div className="relative z-10">
            <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold mb-1">คะแนนรวม UAS7 (7 วันล่าสุด)</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-5xl font-black">{totalUAS7}</h2>
              <span className="text-lg opacity-70">/ 42</span>
            </div>
            
            {/* ป้ายแปลผลสถานะ */}
            <div className="mt-3 inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-bold">{status.label}</span>
            </div>
          </div>
          <CalendarDays size={80} className="absolute -right-4 -bottom-4 opacity-10 rotate-12" />
        </div>

        {/* ตารางประวัติ */}
        <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm mb-6">
          <table className="w-full text-center border-collapse">
            <thead className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 border-b">วันที่</th>
                <th className="py-4 border-b">ผื่น (0-3)</th>
                <th className="py-4 border-b">คัน (0-3)</th>
                <th className="py-4 border-b bg-slate-100/50 text-slate-600">รวม</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {logs.length > 0 ? (
                logs.map((log) => {
                  const dateObj = new Date(log.logDate);
                  return (
                    <tr key={log.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-5 text-slate-500 font-medium">
                        {dateObj.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="py-5 text-slate-700 font-semibold">{log.whealScore}</td>
                      <td className="py-5 text-slate-700 font-semibold">{log.itchScore}</td>
                      <td className="py-4 bg-slate-50/30">
                        <span className={`inline-block px-3 py-1 rounded-full font-bold text-xs ${
                           log.totalScore >= 5 ? 'bg-red-100 text-red-600' : 
                           log.totalScore >= 3 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-700'
                        }`}>
                          {log.totalScore}
                        </span>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-20 text-slate-300 italic">ยังไม่มีข้อมูลบันทึกใน 7 วันนี้</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* คำอธิบายเกณฑ์คะแนน (อ้างอิงตามเอกสารคุณหมอ) */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-5">
           <div className="flex items-center gap-2 mb-3 text-blue-600">
              <Info size={18} />
              <h3 className="text-sm font-bold">เกณฑ์การแปลผลคะแนนรวม</h3>
           </div>
           <div className="space-y-3">
              {[
                { range: "0", label: "คุมโรคได้สมบูรณ์", color: "bg-emerald-500" },
                { range: "1-6", label: "คุมโรคได้ดีมาก", color: "bg-green-500" },
                { range: "7-15", label: "อาการเล็กน้อย", color: "bg-yellow-500" },
                { range: "16-27", label: "อาการปานกลาง", color: "bg-orange-500" },
                { range: "28-42", label: "อาการรุนแรง", color: "bg-red-500" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-slate-600">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-400">{item.range} คะแนน</span>
                </div>
              ))}
           </div>
        </div>

        {/* หมายเหตุเพิ่มเติม */}
        {logs.some(l => l.note) && (
          <div className="mt-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase ml-2 mb-3 tracking-widest">บันทึกเพิ่มเติม</h3>
            <div className="space-y-3">
              {logs.filter(l => l.note).map((log) => (
                <div key={`note-${log.id}`} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-blue-500 font-bold mb-1">
                    {new Date(log.logDate).toLocaleDateString('th-TH', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed italic">"{log.note}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}