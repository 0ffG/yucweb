"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { YucLogo } from './yuc-logo';
import { useRouter } from 'next/navigation';

interface LocalUser {
  id: number;
  name: string;
  role: string;
  photo?: string;
}

export default function NavigationBar() {
  const router = useRouter();
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const localUser = localStorage.getItem("user");
      if (localUser) {
        setUser(JSON.parse(localUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();

    const handleStorage = () => {
      const newUser = localStorage.getItem("user");
      if (newUser) {
        setUser(JSON.parse(newUser));
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem("user");
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  };

  const goToProfile = () => {
    if (!user) return;

    switch (user.role) {
      case "donor":
        router.push("/donor");
        break;
      case "admin":
        router.push("/admin");
        break;
      case "school":
        router.push(`/schools/${user.id}`);
        break;
      default:
        alert("Geçersiz rol");
    }
  };

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-slate-900 w-full border-b border-slate-700">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center">
            <YucLogo />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="px-6 py-2 rounded-full bg-white/80 text-gray-700 font-medium text-sm transition-all hover:shadow-md hover:bg-white"
          >
            Hakkımızda
          </Link>

          {loading ? null : !user ? (
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
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
                <span>Hoşgeldiniz, <span className="font-semibold">{user.name}</span></span>
                <button onClick={goToProfile} className="ml-2">
                  <img
                    src={user.photo || '/pfpdefault.jpg'}
                    alt="Profil"
                    className="w-8 h-8 rounded-full border border-white shadow-sm hover:scale-105 transition"
                  />
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-red-600 text-white text-sm hover:bg-red-700"
              >
                Çıkış Yap
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
