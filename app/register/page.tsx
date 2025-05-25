"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    photoUrl: "",
    location: ""
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
          surname: formData.role === "donor" ? formData.surname : undefined,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          photoUrl: formData.photoUrl || undefined,
          location: formData.role === "school" ? formData.location : undefined
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Kayıt başarılı!");
        router.push("/");
      } else {
        alert(`🚫 Kayıt başarısız: ${data.error}`);
      }
    } catch (err) {
      alert("Sunucu hatası.");
      console.error(err);
    }
  };

  const isSchool = formData.role === "school";
  const isDonor = formData.role === "donor";

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

              {isDonor && (
                <input
                  type="text"
                  name="surname"
                  placeholder="Soyad"
                  value={formData.surname}
                  onChange={handleChange}
                  className="w-3/4 rounded-xl border border-black p-2"
                />
              )}

              {isSchool && (
                <input
                  type="text"
                  name="location"
                  placeholder="Adres"
                  value={formData.location}
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
                <option value="donor">Bağışçı</option>
                <option value="school">Okul</option>
                <option value="admin">Admin</option>
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formDataUpload = new FormData();
                  formDataUpload.append("file", file);

                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formDataUpload,
                  });

                  const data = await res.json();
                  if (res.ok && data.url) {
                    setFormData((prev) => ({ ...prev, photoUrl: data.url }));
                    alert("Fotoğraf yüklendi!");
                  } else {
                    alert("Fotoğraf yüklenemedi.");
                  }
                }}
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
