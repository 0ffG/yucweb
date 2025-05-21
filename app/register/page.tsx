"use client";
import NavigationBar from "@/components/navigationbar";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    photoUrl: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Şifreler uyuşmuyor.");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          photoUrl: formData.photoUrl || undefined
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Kayıt başarılı!");
      } else {
        alert(`🚫 Kayıt başarısız: ${data.error}`);
      }
    } catch (err) {
      alert("Sunucu hatası.");
      console.error(err);
    }
  };

  const isSchool = formData.role === "Okul";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="container flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h2 className="mb-10 text-center text-4xl text-blue-950 font-bold font-sans">KAYDOL</h2>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center space-y-10">

              <input
                type="text"
                name="name"
                placeholder={isSchool ? "Okul Adı" : "Ad"}
                value={formData.name}
                onChange={handleChange}
                className="w-3/4 rounded-xl border border-black p-2"
              />

              {!isSchool && (
                <input
                  type="text"
                  name="surname"
                  placeholder="Soyad"
                  value={formData.surname}
                  onChange={handleChange}
                  className="w-3/4 rounded-xl border border-black p-2"
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="E-posta"
                value={formData.email}
                onChange={handleChange}
                className="w-3/4 rounded-xl border border-black p-2"
              />
              <input
                type="password"
                name="password"
                placeholder="Şifre"
                value={formData.password}
                onChange={handleChange}
                className="w-3/4 rounded-xl border border-black p-2"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Şifre Tekrar"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-3/4 rounded-xl border border-black p-2"
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-3/4 rounded-xl border border-black p-2"
                required
              >
                <option value="" disabled>Kullanıcı Türü</option>
                <option>Bağışçı</option>
                <option>Okul</option>
                <option>Admin</option>
              </select>

              <input
                type="text"
                name="photoUrl"
                placeholder="Fotoğraf URL"
                value={formData.photoUrl}
                onChange={handleChange}
                className="w-3/4 rounded-xl border border-black p-2"
              />
            </div>

            <div className="flex flex-col items-center">
              <button
                type="submit"
                className="w-1/2 rounded-2xl bg-blue-950 py-3 text-white font-bold hover:bg-green-800"
              >
                KAYDOL
              </button>
              <Link href="/login">
                <span className="underline text-sm text-blue-800 hover:text-blue-950 mt-2">
                  Hesabın var mı? Giriş yap.
                </span>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
