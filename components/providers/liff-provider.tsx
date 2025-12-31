'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import liff from '@line/liff'

const LiffContext = createContext<{ profile: any | null }>({ profile: null })

export function LiffProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
        if (!liff.isLoggedIn()) {
          liff.login() // ถ้ายังไม่ Login ให้เด้งหน้า Login ของ LINE
        } else {
          const userProfile = await liff.getProfile()
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('LIFF Init Error', error)
      }
    }
    initLiff()
  }, [])

  return (
    <LiffContext.Provider value={{ profile }}>
      {children}
    </LiffContext.Provider>
  )
}

export const useLiff = () => useContext(LiffContext)