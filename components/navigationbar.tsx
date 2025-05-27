"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { YucLogo } from "./yuc-logo";

interface LocalUser {
  id: number;
  name: string;
  role: string;
  photo?: string | null;
}

export default function NavigationBar() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const localUserRaw = localStorage.getItem("user");
    if (localUserRaw) {
      const parsedUser = JSON.parse(localUserRaw);
      setUser(parsedUser);
    } else {
      setUser(null);
    }

    // Dinleyiciler: storage ve custom event
    const handleUserChange = () => {
      const updatedUserRaw = localStorage.getItem("user");
      if (updatedUserRaw) {
        setUser(JSON.parse(updatedUserRaw));
      } else {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleUserChange);
    window.addEventListener("userChanged", handleUserChange);
    return () => {
      window.removeEventListener("storage", handleUserChange);
      window.removeEventListener("userChanged", handleUserChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("user");
      setUser(null);
      window.dispatchEvent(new Event("userChanged")); // Custom event
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
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
        {/* Sol: Logo */}
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center">
            <YucLogo />
          </Link>
        </div>

        {/* Sağ: Butonlar */}
        <div className="flex items-center gap-4">
          {/* Her zaman görünen buton */}
          <Link
            href="/about"
            className="px-6 py-2 rounded-full bg-white/80 text-gray-700 font-medium text-sm hover:bg-white"
          >
            Hakkımızda
          </Link>

          {/* Kullanıcı yoksa login/register göster */}
          {!user ? (
            <>
              <Link
                href="/register"
                className="px-6 py-2 rounded-full bg-white text-gray-800 text-sm"
              >
                Kayıt Ol
              </Link>
              <Link
                href="/login"
                className="px-6 py-2 rounded-full bg-green-800 text-white text-sm"
              >
                Giriş Yap
              </Link>
            </>
          ) : (
            <>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="px-6 py-2 rounded-full bg-blue-700 text-white text-sm"
                >
                  Yönetici Ekranı
                </Link>
              )}
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
                <span>Hoşgeldiniz, <strong>{user.name}</strong></span>
                <button onClick={goToProfile}>
                  <img
                    src={user.photo || "/pfpdefault.jpg"}
                    alt="Profil"
                    className="w-8 h-8 rounded-full border border-white"
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
