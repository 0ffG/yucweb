'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { YucLogo } from './yuc-logo'; // Eğer yukarıdaki gibi logo varsa

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
    <header className="sticky top-0 z-10 backdrop-blur-md bg-slate-900">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <YucLogo />
        </Link>

        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link
                href="/about"
                className="px-6 py-2 rounded-full bg-white/80 text-gray-700 font-medium text-sm transition-all hover:shadow-md hover:bg-white"
              >
                Hakkımızda
              </Link>
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
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium text-sm transition-all hover:shadow-md hover:bg-blue-500"
                >
                  Admin Paneli
                </Link>
              )}
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white text-sm">
                    ?
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
