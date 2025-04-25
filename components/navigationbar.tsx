'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { YucLogo } from './yuc-logo';

export default function NavigationBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      setIsLoggedIn(true);
      setIsAdmin(user.role === 'admin');
      setProfileImage(user.profileImage || null);
    }
  }, []);

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-slate-900 w-full border-b border-slate-700">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* Sol: Logo */}
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center">
            <YucLogo />
          </Link>
        </div>

        {/* Sağ: Bağlantılar */}
        <div className="flex items-center gap-4">
          {/* Hakkımızda Butonu HER ZAMAN */}
          <Link
            href="/about"
            className="px-6 py-2 rounded-full bg-white/80 text-gray-700 font-medium text-sm transition-all hover:shadow-md hover:bg-white"
          >
            Hakkımızda
          </Link>

          {/* Kullanıcı Durumuna Göre */}
          {!isLoggedIn ? (
            <>
              <Link
                href="/register"
                className="px-6 py-2 rounded-full bg-white/80 border border-gray-200 text-gray-700 font-medium text-sm transition-all hover:shadow-md hover:bg-white"
              >
                Kayıt Ol
              </Link>
              <Link
                href="/login"
                className="px-6 py-2 rounded-full bg-green-900/90 text-white font-medium text-sm transition-all hover:shadow-md hover:bg-pink-500"
              >
                Giriş Yap
              </Link>
            </>
          ) : (
            <>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium text-sm transition-all hover:shadow-md hover:bg-blue-500"
                >
                  Yönetici Ekranı
                </Link>
              ) : (
                <Link href="/donor" className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                  <img
                    src={profileImage || '/pfpdefault.jpg'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
