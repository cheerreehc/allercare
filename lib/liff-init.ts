import liff from '@line/liff';

export const initLiff = async () => {
  if (typeof window === 'undefined') return; // ป้องกันการรันบน Server

  try {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
    if (!liffId) {
      console.error('Missing NEXT_PUBLIC_LIFF_ID in .env');
      return;
    }

    await liff.init({ liffId });
    
    if (!liff.isLoggedIn()) {
      liff.login(); 
    }
  } catch (error) {
    console.error('LIFF Init Error:', error);
  }
};