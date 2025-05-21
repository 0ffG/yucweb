// 📁 app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";

export default function AdminProfile() {
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [donationTotal, setDonationTotal] = useState("");
  type Donation = {
    donor?: { name?: string };
    donationType: string;
    amount: number;
    createdAt: string;
  };
  const [donations, setDonations] = useState<Donation[]>([]);
  const [hours, setHours] = useState("24");
  const [newsTitle, setNewsTitle] = useState("");
  const [newsImage, setNewsImage] = useState("");
  const [newsList, setNewsList] = useState([]);

  const fetchDonations = async () => {
    try {
      const res = await fetch(`/api/donations?hours=${hours}`);
      const data = await res.json();
      setDonations(data);
    } catch (error) {
      console.error("Bağışlar çekilemedi", error);
    }
  };

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNewsList(data);
    } catch (err) {
      console.error("Haberler çekilemedi", err);
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchNews();
  }, [hours]);

  const handleDeleteUser = async () => {
    if (!userIdToDelete) return;
    try {
      await fetch(`/api/users/${userIdToDelete}`, {
        method: "DELETE",
      });
      alert("Kullanıcı silindi");
    } catch (error) {
      console.error("Kullanıcı silinemedi", error);
    }
  };

  const handleUpdateTotalDonation = async () => {
    if (!donationTotal) return;
    try {
      await fetch(`/api/admin/donations`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total: Number(donationTotal) }),
      });
      alert("Toplam bağış güncellendi");
    } catch (error) {
      console.error("Güncellenemedi", error);
    }
  };

  const handleAddNews = async () => {
    if (!newsTitle) return;
    try {
      await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newsTitle, image: newsImage }),
      });
      alert("Haber eklendi");
      setNewsTitle("");
      setNewsImage("");
      fetchNews();
    } catch (err) {
      console.error("Haber eklenemedi", err);
    }
  };

  const handleDeleteNews = async (id: number) => {
    try {
      await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });
      fetchNews();
    } catch (err) {
      console.error("Haber silinemedi", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kullanıcı Silme */}
          <div className="rounded-2xl bg-white shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 text-center">Kullanıcı Sil</h2>
            <div className="mt-6">
              <input
                type="text"
                value={userIdToDelete}
                onChange={(e) => setUserIdToDelete(e.target.value)}
                placeholder="User ID"
                className="w-full rounded-lg border border-gray-300 p-2"
              />
              <button onClick={handleDeleteUser} className="mt-4 w-full rounded-lg bg-red-500 px-4 py-2 text-white font-semibold">
                Sil
              </button>
            </div>
          </div>

          {/* Bağış Sayısı Güncelleme */}
          <div className="rounded-2xl bg-white shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 text-center">Toplam Bağışı Güncelle</h2>
            <div className="mt-6">
              <input
                type="number"
                value={donationTotal}
                onChange={(e) => setDonationTotal(e.target.value)}
                placeholder="Bağış Sayısı"
                className="w-full rounded-lg border border-gray-300 p-2"
              />
              <button onClick={handleUpdateTotalDonation} className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold">
                Güncelle
              </button>
            </div>
          </div>
        </div>

        {/* Bağış Geçmişi */}
        <div className="rounded-2xl bg-white shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
            Bağış Geçmişi
            <select
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="ml-4 border rounded px-2 py-1 text-sm"
            >
              <option value="24">Son 24 saat</option>
              <option value="48">Son 48 saat</option>
              <option value="168">Son 7 gün</option>
              <option value="720">Son 30 gün</option>
              <option value="8760">Tümü</option>
            </select>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-gray-700 font-medium">
                <tr>
                  <th className="p-3">Kullanıcı Adı</th>
                  <th className="p-3">Bağış Türü</th>
                  <th className="p-3">Miktar</th>
                  <th className="p-3">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {donations.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3 font-medium">{d.donor?.name}</td>
                    <td className="p-3">{d.donationType}</td>
                    <td className="p-3">₺{d.amount}</td>
                    <td className="p-3">{new Date(d.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Haber Ekleme ve Listeleme */}
        <div className="rounded-2xl bg-white shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Haber Yönetimi</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              value={newsTitle}
              onChange={(e) => setNewsTitle(e.target.value)}
              placeholder="Haber Başlığı"
              className="flex-1 border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              value={newsImage}
              onChange={(e) => setNewsImage(e.target.value)}
              placeholder="Haber Görsel URL"
              className="flex-1 border border-gray-300 rounded p-2"
            />
            <button onClick={handleAddNews} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Ekle
            </button>
          </div>
          <ul className="space-y-3">
            {newsList.map((news: any) => (
              <li key={news.id} className="flex justify-between items-center border p-3 rounded">
                <span>{news.title}</span>
                <button onClick={() => handleDeleteNews(news.id)} className="text-red-600 hover:underline">Sil</button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
