"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditDonorProfile() {
  const [form, setForm] = useState({ name: "", lastName: "", photo: "" });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
// handleSubmit fonksiyonu tek olarak aşağıda tanımlanmıştır, burada tekrar tanımlamaya gerek yok.

  useEffect(() => {
    const userId = Number(localStorage.getItem("userId"));
    fetch(`/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          lastName: data.lastName || "",
          photo: data.photo || "",
        });
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url && data.url !== "") {
        setForm((prev) => ({ ...prev, photo: data.url }));
      } else {
        alert("Fotoğraf yüklenemedi: URL boş döndü veya sunucu hatası.");
      }
    } catch (err) {
      alert("Fotoğraf yüklenemedi.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Fotoğraf zorunluluğu kaldırıldı
    const userId = Number(localStorage.getItem("userId"));
    const response = await fetch(`/api/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      // localStorage'daki user bilgisini güncelle
      const oldUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...oldUser,
          name: form.name,
          lastName: form.lastName,
          photo: form.photo,
        })
      );
      // Diğer sekmelerde de güncellenmesi için storage event tetikle
      window.dispatchEvent(new Event("storage"));
      router.push("/donor");
    }
  };

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit} 
        className="bg-gray-50 p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold mb-4">Profili Düzenle</h2>
        <div>
          <label className="block mb-1">Ad</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Soyad</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Profil Fotoğrafı</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded"
          />
          {form.photo && (
            <img src={form.photo} alt="Profil Fotoğrafı" className="mt-2 w-24 h-24 object-cover rounded-full border" />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}