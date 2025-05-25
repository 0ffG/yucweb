// Dosya: page.tsx (Kullanıcı tarafından sağlanan admin paneli sayfası)
"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // Link komponentini import ediyoruz

export default function AdminProfile() {
  const [userIdToDelete, setUserIdToDelete] = useState("");
  // const [donationTotal, setDonationTotal] = useState(""); // Bu state kullanılmıyorsa kaldırılabilir
  const [moneyHours, setMoneyHours] = useState("24");
  const [materialHours, setMaterialHours] = useState("24");
  const [newsTitle, setNewsTitle] = useState("");
  const [newsImage, setNewsImage] = useState("");
  const [newsList, setNewsList] = useState<any[]>([]); // Tip belirlemesi iyileştirilebilir
  const [moneyDonations, setMoneyDonations] = useState<any[]>([]); // Tip belirlemesi iyileştirilebilir
  const [materialDonations, setMaterialDonations] = useState<any[]>([]); // Tip belirlemesi iyileştirilebilir
  const [amount, setAmount] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [moneyDonationId, setMoneyDonationId] = useState("");

  const [allUsers, setAllUsers] = useState<any[]>([]); // Kullanıcı listesi için state
  const [moneyDistributions, setMoneyDistributions] = useState<any[]>([]); // Para dağıtım geçmişi için state
  const [schools, setSchools] = useState<any[]>([]); // Okullar için state

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok) {
        setAllUsers(data);
      } else {
        console.error("Kullanıcılar çekilemedi:", data.error);
        setAllUsers([]);
      }
    } catch (err) {
      console.error("Kullanıcılar fetch hatası:", err);
      setAllUsers([]);
    }
  };

  useEffect(() => {
    const queryParams = moneyHours ? `?hours=${moneyHours}` : "";
    fetch(`/api/admin/money-donations${queryParams}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.message) {
          setMoneyDonations(data);
        } else {
          console.error("Para bağışları çekilemedi:", data.message);
          setMoneyDonations([]);
        }
      })
      .catch(err => {
        console.error("Para bağışları fetch hatası:", err);
        setMoneyDonations([]);
      });
  }, [moneyHours]);

  useEffect(() => {
    const queryParams = materialHours ? `?hours=${materialHours}` : "";
    fetch(`/api/admin/material-donations${queryParams}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.message) {
          setMaterialDonations(data);
        } else {
          console.error("Eşya bağışları çekilemedi:", data.message);
          setMaterialDonations([]);
        }
      })
      .catch(err => {
        console.error("Eşya bağışları fetch hatası:", err);
        setMaterialDonations([]);
      });

    fetchNews();
    fetchUsers(); // Kullanıcıları çekmek için çağrı
  }, [materialHours]); // materialHours değiştiğinde de kullanıcıları çekmek mantıklı olmayabilir, ayrı bir useEffect'e alınabilir veya bağımlılıklardan çıkarılabilir. Sadece component mount olduğunda çekmek için boş dependency array [] ile ayrı bir useEffect kullanılabilir.
  
  // Kullanıcıları sadece component mount olduğunda çekmek için:
  useEffect(() => {
    fetchUsers();
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
      const response = await fetch(`/api/user/${userIdToDelete}`, { method: "DELETE" });
      if (response.ok) {
        alert("Kullanıcı silindi");
        setUserIdToDelete(""); // Input'u temizle
        fetchUsers(); // Kullanıcı listesini güncelle
      } else {
        const data = await response.json();
        alert(`Kullanıcı silinemedi: ${data.error || response.statusText}`);
      }
    } catch (error) {
      console.error("Kullanıcı silinemedi", error);
      alert("Kullanıcı silinirken bir hata oluştu.");
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

  useEffect(() => {
    fetch("/api/admin/money-distribution")
      .then(res => res.json())
      .then(data => setMoneyDistributions(data))
      .catch(err => {
        console.error("Para dağıtım geçmişi çekilemedi", err);
        setMoneyDistributions([]);
      });
  }, []);

  useEffect(() => {
    fetch("/api/schools")
      .then(res => res.json())
      .then(data => setSchools(data))
      .catch(err => {
        console.error("Okullar çekilemedi", err);
        setSchools([]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        <div className="rounded-2xl bg-white shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-center">Kullanıcı Sil</h2>
            <input type="text" value={userIdToDelete} onChange={(e) => setUserIdToDelete(e.target.value)} placeholder="User ID" className="w-full border p-2 mt-4" />
            <button onClick={handleDeleteUser} className="w-full bg-red-500 text-white p-2 mt-2 rounded">Sil</button>
        </div>

        {/* Kayıtlı Kullanıcılar Tablosu */}
        <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Kayıtlı Kullanıcılar</h2>
          <div className="max-h-[400px] overflow-y-auto mt-4">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Ad Soyad</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Rol</th>
                  <th className="p-2 text-center">Fotoğraf</th>
                  <th className="p-2 text-center">Profil</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 border-b">
                    <td className="p-2">{user.id}</td>
                    <td className="p-2">{user.name} {user.lastName}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2 flex justify-center">
                      {user.photo ? (
                        <img src={user.photo} alt={`${user.name} ${user.lastName}`} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <span className="text-xs text-gray-500">Yok</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <Link href={`/donor/${user.id}`} legacyBehavior>
                        <a className="text-blue-600 hover:text-blue-800 hover:underline">Görüntüle</a>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {allUsers.length === 0 && <p className="text-center text-gray-500 py-4">Kayıtlı kullanıcı bulunamadı.</p>}
          </div>
        </div>

        {/* Para Bağışları Tablosu */}
        <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-200 relative">
          <h2 className="text-xl font-semibold mb-4">Para Bağışları</h2>
          <div className="absolute right-6 top-6">
            <select value={moneyHours} onChange={(e) => setMoneyHours(e.target.value)} className="border p-2 rounded">
              <option value="">Tüm Zamanlar</option>
              <option value="1">Son 1 Saat</option>
              <option value="24">Son 24 Saat</option>
              <option value="168">Son 7 Gün</option>
              <option value="720">Son 30 Gün</option>
            </select>
          </div>
          <div className="max-h-[400px] overflow-y-auto mt-4">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Kullanıcı</th>
                  <th className="p-2 text-left">Miktar</th>
                  <th className="p-2 text-left">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {moneyDonations.map((d: any, i) => (
                  <tr key={i} className="hover:bg-gray-50 border-b">
                    <td className="p-2">{d.donor?.name || 'Bilinmiyor'}</td>
                    <td className="p-2">₺{d.amount}</td>
                    <td className="p-2">{new Date(d.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
             {moneyDonations.length === 0 && <p className="text-center text-gray-500 py-4">Filtreye uygun para bağışı bulunamadı.</p>}
          </div>
        </div>

        {/* Eşya Bağışları Tablosu */}
        <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-200 relative">
          <h2 className="text-xl font-semibold mb-4">Eşya Bağışları</h2>
          <div className="absolute right-6 top-6">
            <select value={materialHours} onChange={(e) => setMaterialHours(e.target.value)} className="border p-2 rounded">
              <option value="">Tüm Zamanlar</option>
              <option value="1">Son 1 Saat</option>
              <option value="24">Son 24 Saat</option>
              <option value="168">Son 7 Gün</option>
              <option value="720">Son 30 Gün</option>
            </select>
          </div>
          <div className="max-h-[400px] overflow-y-auto mt-4">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Kullanıcı</th>
                  <th className="p-2 text-left">Eşya</th>
                  <th className="p-2 text-left">Adet</th>
                  <th className="p-2 text-left">Okul</th>
                  <th className="p-2 text-left">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {materialDonations.map((d: any, i) => (
                  <tr key={i} className="hover:bg-gray-50 border-b">
                    <td className="p-2">{d.donor?.name || 'Bilinmiyor'}</td>
                    <td className="p-2">{d.item}</td>
                    <td className="p-2">{d.amount}</td>
                    <td className="p-2">{d.school?.name || 'Bilinmiyor'}</td>
                    <td className="p-2">{new Date(d.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {materialDonations.length === 0 && <p className="text-center text-gray-500 py-4">Filtreye uygun eşya bağışı bulunamadı.</p>}
          </div>
        </div>

        {/* Para Gönderme Formu */}
        <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Para Dağıtımı</h2>
          <form onSubmit={handleDistributeMoney}>
            <input type="number" placeholder="Miktar" value={amount} onChange={(e) => setAmount(e.target.value)} className="border p-2 w-full mb-2 rounded" required />
            <input type="number" placeholder="Okul ID" value={schoolId} onChange={(e) => setSchoolId(e.target.value)} className="border p-2 w-full mb-2 rounded" required />
            <input type="number" placeholder="Bağış ID (isteğe bağlı)" value={moneyDonationId} onChange={(e) => setMoneyDonationId(e.target.value)} className="border p-2 w-full mb-2 rounded" />
            <button type="submit" className="bg-green-600 text-white p-2 w-full rounded hover:bg-green-700">Gönder</button>
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
              <li key={news.id} className="flex justify-between items-center border p-3 rounded hover:bg-gray-50">
                <span>{news.title}</span>
                <button onClick={() => handleDeleteNews(news.id)} className="text-red-600 hover:underline">Sil</button>
              </li>
            ))}
          </ul>
          {newsList.length === 0 && <p className="text-center text-gray-500 py-4">Gösterilecek haber bulunmuyor.</p>}
        </div>

        {/* Para Dağıtım Geçmişi Tablosu */}
        <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Para Dağıtım Geçmişi</h2>
          <div className="max-h-[400px] overflow-y-auto mt-4">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Okul</th>
                  <th className="p-2 text-left">Okul ID</th>
                  <th className="p-2 text-left">Miktar</th>
                  <th className="p-2 text-left">Bağış ID</th>
                  <th className="p-2 text-left">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {moneyDistributions.map((d: any, i) => (
                  <tr key={i} className="hover:bg-gray-50 border-b">
                    <td className="p-2">{d.school?.name || 'Bilinmiyor'}</td>
                    <td className="p-2">{d.schoolId || '-'}</td>
                    <td className="p-2">₺{d.moneyDonation?.amount || d.amount}</td>
                    <td className="p-2">{d.moneyDonationId || '-'}</td>
                    <td className="p-2">{new Date(d.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {moneyDistributions.length === 0 && <p className="text-center text-gray-500 py-4">Para dağıtım kaydı bulunamadı.</p>}
          </div>
        </div>

        {/* Okullar Tablosu */}
        <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Kayıtlı Okullar</h2>
          <div className="max-h-[400px] overflow-y-auto mt-4">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Okul Adı</th>
                  <th className="p-2 text-center">Profil</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school: any) => (
                  <tr key={school.id} className="hover:bg-gray-50 border-b">
                    <td className="p-2">{school.id}</td>
                    <td className="p-2">{school.name}</td>
                    <td className="p-2 text-center">
                      <Link href={`/schools/${school.id}`} legacyBehavior>
                        <a className="text-blue-600 hover:text-blue-800 hover:underline">Görüntüle</a>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {schools.length === 0 && <p className="text-center text-gray-500 py-4">Kayıtlı okul bulunamadı.</p>}
          </div>
        </div>

      </main>
    </div>
  );
}