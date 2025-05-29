"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        const user = data.user;
        localStorage.setItem("userId", user.id.toString());
        localStorage.setItem("userName", user.name);
        localStorage.setItem("role", user.role.toLowerCase());
        localStorage.setItem("photo", user.photo || "public/pfpdefault.jpg");
        localStorage.setItem("user", JSON.stringify(user));
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
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/login-bg.jpg')" }} // `public/login-bg.jpg` içine bir arka plan koyabilirsin.
    >
      <main className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="mb-6 text-center text-4xl text-blue-950 font-bold font-sans">GİRİŞ YAP</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
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

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <div className="flex flex-col items-center gap-2">
            <button
              type="submit"
              className="w-1/2 rounded-2xl bg-blue-950 py-3 text-white font-bold hover:bg-green-800"
            >
              GİRİŞ YAP
            </button>
            <Link href="/reset-password" className="text-sm text-blue-700 hover:text-blue-950 underline">
              Şifremi unuttum
            </Link>
            <Link href="/register" className="text-sm text-blue-700 hover:text-blue-950 underline">
              Hesabın yok mu? Kaydol.
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
