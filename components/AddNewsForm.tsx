"use client";

import { useState } from "react";

export default function AddNewsForm() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, image }),
    });

    if (res.ok) {
      setTitle("");
      setImage("");
      setMessage("✅ Haber başarıyla eklendi!");
    } else {
      const data = await res.json();
      setMessage(data.error || "Bir hata oluştu");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-8">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Başlık"
        className="w-full border border-gray-400 p-2 rounded"
        required
      />
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Görsel URL (opsiyonel)"
        className="w-full border border-gray-400 p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800"
      >
        Haber Ekle
      </button>
      {message && <p className="text-sm text-green-700">{message}</p>}
    </form>
  );
}