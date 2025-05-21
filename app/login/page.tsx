"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const user = data.user;

        // ✅ localStorage'a ayrı ayrı yaz (DonorProfile, Navbar, MainPage için gerekli)
        localStorage.setItem("userId", user.id.toString());
        localStorage.setItem("userName", user.name);
        localStorage.setItem("role", user.role.toLowerCase());
        localStorage.setItem("photo", user.photo || "public/pfpdefault.jpg");

        // ✅ opsiyonel: tüm kullanıcıyı da tutmak istersen
        localStorage.setItem("user", JSON.stringify(user));

        // Depolama değiştiğini diğer bileşenlere bildir
        window.dispatchEvent(new Event("storage"));

        toast({
          type: "success",
          title: "Giriş başarılı!",
          description: "Yönlendiriliyorsunuz...",
          open: true,
          onOpenChange: () => {},
        });
        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Sunucu hatası");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="container flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h2 className="mb-6 text-center text-4xl text-blue-950 font-bold font-sans">GİRİŞ YAP</h2>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center">
              <div className="w-3/4 space-y-1">
                <input
                  type="email"
                  name="email"
                  placeholder="E-posta"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-black p-2"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Şifre"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-black p-2"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex flex-col items-center">
                <button
                  type="submit"
                  className="w-1/2 rounded-2xl bg-blue-950 py-3 text-white font-bold hover:bg-green-800"
                >
                  GİRİŞ YAP
                </button>
              </div>
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              <div className="flex flex-col items-center mt-2">
                <Link href="/register">
                  <span className="underline text-sm text-blue-800 hover:text-blue-950">
                    Hesabın yok mu? Kaydol.
                  </span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
