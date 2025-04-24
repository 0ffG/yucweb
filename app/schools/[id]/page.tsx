"use client";

import { useParams } from "next/navigation"

const schoolProfiles = [
  {
    name: "Örnek İlkokulu",
    contact: "123 Örnek Sokak, İstanbul",
    needs: ["Kitap", "Defter", "Kalem", "Bilgisayar"],
  },
  {
    name: "Yeni Nesil Okulu",
    contact: "456 Yeni Nesil Caddesi, Ankara",
    needs: ["Tablet", "Sıra", "Tahta", "Projeör"],
  },
  {
    name: "Umut Ortaokulu",
    contact: "789 Umut Mahallesi, İzmir",
    needs: ["Spor Malzemeleri", "Sanat Malzemeleri", "Laboratuvar Ekipmanları", "Kütüphane Kitapları"],
  },
  {
    name: "Mutlu Ortaokulu",
    contact: "101 Mutlu Sokak, Bursa",
    needs: ["Müzik Aletleri", "Bilgisayar", "Yazıcı", "Kırtasiye Malzemeleri"],
  },
  {
    name: "Dost İlkokulu",
    contact: "202 Dost Caddesi, Antalya",
    needs: ["Oyuncaklar", "Eğitim Materyalleri", "Sıcak Yemek", "Mont ve Ayakkabı"],
  },
]

export default function SchoolProfilePage() {
  const params = useParams()
  const id = params.id
  const school = schoolProfiles[Number(id) - 1]

  if (!school) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8">
        <h1 className="text-2xl font-bold">Okul Bulunamadı</h1>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Üstte arka plan resmi */}
      <div className="h-[35vh] w-full bg-cover bg-center relative" style={{ backgroundImage: "url('/örnekilkokul.jpg')", backgroundColor: '#1E3A8A' }}>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <h1 className="text-4xl font-bold text-white">{school.name}</h1>
        </div>
      </div>

      <main className="container px-4 py-8">
        <div className="flex flex-row gap-4">
          <div className="flex-1 rounded border border-black p-4">
            <button className="mb-4 w-full rounded bg-slate-900 py-2 text-white font-bold">İLETİŞİM BİLGİLERİ</button>
            <p>{school.contact}</p>
          </div>

          <div className="flex-1 rounded border border-black p-4">
            <button className="mb-4 w-full rounded bg-slate-900 py-2 text-white font-bold">İHTİYAÇLAR</button>
            <div className="grid grid-cols-2 gap-4">
              {school.needs.map((need, index) => (
                <div key={index} className="rounded border border-black p-4 flex justify-between">
                  <p>{need}</p>
                  <span>{Math.floor(Math.random() * 100) + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
