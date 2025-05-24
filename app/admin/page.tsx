// 📁 app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";

export default function AdminProfile() {
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [donationTotal, setDonationTotal] = useState("");
  const [hours, setHours] = useState("24");
  const [newsTitle, setNewsTitle] = useState("");
  const [newsImage, setNewsImage] = useState("");
  const [newsList, setNewsList] = useState([]);
  const [moneyDonations, setMoneyDonations] = useState([]);
  const [materialDonations, setMaterialDonations] = useState([]);
  const [amount, setAmount] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [moneyDonationId, setMoneyDonationId] = useState("");

  useEffect(() => {
    fetch("/api/admin/money-donations").then(res => res.json()).then(setMoneyDonations);
    fetch("/api/admin/material-donations").then(res => res.json()).then(setMaterialDonations);
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNewsList(data);
    } catch (err) {
      console.error("Haberler çekilemedi", err);
    }
  };

  const handleDeleteUser = async () => {
    if (!userIdToDelete) return;
    try {
      await fetch(`/api/users/${userIdToDelete}`, { method: "DELETE" });
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
      await fetch(`/api/news/${id}`, { method: "DELETE" });
      fetchNews();
    } catch (err) {
      console.error("Haber silinemedi", err);
    }
  };

  const handleDistributeMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/admin/distribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          schoolId: Number(schoolId),
          moneyDonationId: moneyDonationId ? Number(moneyDonationId) : null,
        }),
      });
      alert("Para dağıtımı yapıldı!");
      setAmount("");
      setSchoolId("");
      setMoneyDonationId("");
    } catch (err) {
      console.error("Para dağıtılamadı", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        {/* Kullanıcı Silme ve Bağış Güncelleme */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-center">Kullanıcı Sil</h2>
            <input type="text" value={userIdToDelete} onChange={(e) => setUserIdToDelete(e.target.value)} placeholder="User ID" className="w-full border p-2 mt-4" />
            <button onClick={handleDeleteUser} className="w-full bg-red-500 text-white p-2 mt-2 rounded">Sil</button>
          </div>

          <div className="rounded-2xl bg-white shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-center">Toplam Bağışı Güncelle</h2>
            <input type="number" value={donationTotal} onChange={(e) => setDonationTotal(e.target.value)} placeholder="Bağış Sayısı" className="w-full border p-2 mt-4" />
            <button onClick={handleUpdateTotalDonation} className="w-full bg-blue-600 text-white p-2 mt-2 rounded">Güncelle</button>
          </div>
        </div>

        {/* Para Bağışları Tablosu */}
        <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Para Bağışları</h2>
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Kullanıcı</th>
                <th className="p-2">Miktar</th>
                <th className="p-2">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {moneyDonations.map((d: any, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2">{d.donor?.name}</td>
                  <td className="p-2">₺{d.amount}</td>
                  <td className="p-2">{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Eşya Bağışları Tablosu */}
        <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Eşya Bağışları</h2>
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Kullanıcı</th>
                <th className="p-2">Eşya</th>
                <th className="p-2">Adet</th>
                <th className="p-2">Okul</th>
                <th className="p-2">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {materialDonations.map((d: any, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2">{d.donor?.name}</td>
                  <td className="p-2">{d.item}</td>
                  <td className="p-2">{d.amount}</td>
                  <td className="p-2">{d.school?.name}</td>
                  <td className="p-2">{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Para Gönderme Formu */}
        <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Para Dağıtımı</h2>
          <form onSubmit={handleDistributeMoney}>
            <input type="number" placeholder="Miktar" value={amount} onChange={(e) => setAmount(e.target.value)} className="border p-2 w-full mb-2" />
            <input type="number" placeholder="Okul ID" value={schoolId} onChange={(e) => setSchoolId(e.target.value)} className="border p-2 w-full mb-2" />
            <input type="number" placeholder="Bağış ID (isteğe bağlı)" value={moneyDonationId} onChange={(e) => setMoneyDonationId(e.target.value)} className="border p-2 w-full mb-2" />
            <button className="bg-green-600 text-white p-2 w-full rounded">Gönder</button>
          </form>
        </div>

        {/* Haber Yönetimi */}
        <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Haber Yönetimi</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input type="text" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} placeholder="Haber Başlığı" className="flex-1 border rounded p-2" />
            <input type="text" value={newsImage} onChange={(e) => setNewsImage(e.target.value)} placeholder="Haber Görsel URL" className="flex-1 border rounded p-2" />
            <button onClick={handleAddNews} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Ekle</button>
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
