"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Veri tiplerini tanımlayalım (TypeScript için)
interface Need {
  name: string;
  quantity: number;
}

interface SchoolProfile {
  id: number;
  name: string;
  contact: string;
  needs: Need[];
}

// Örnek okul verileri
const initialSchoolProfiles: SchoolProfile[] = [
  {
    id: 1,
    name: "Örnek İlkokulu",
    contact: "123 Örnek Sokak, İstanbul",
    needs: [
      { name: "Kitap", quantity: 50 },
      { name: "Defter", quantity: 100 },
      { name: "Kalem", quantity: 150 },
      { name: "Bilgisayar", quantity: 5 },
    ],
  },
  {
    id: 2,
    name: "Yeni Nesil Okulu",
    contact: "456 Yeni Nesil Caddesi, Ankara",
    needs: [
      { name: "Tablet", quantity: 20 },
      { name: "Sıra", quantity: 30 },
      { name: "Tahta", quantity: 2 },
      { name: "Projeksiyon", quantity: 1 },
    ],
  },
  {
    id: 3,
    name: "Umut Ortaokulu",
    contact: "789 Umut Mahallesi, İzmir",
    needs: [
      { name: "Spor Malzemeleri", quantity: 25 },
      { name: "Sanat Malzemeleri", quantity: 40 },
      { name: "Laboratuvar Ekipmanları", quantity: 10 },
      { name: "Kütüphane Kitapları", quantity: 200 },
    ],
  },
  {
    id: 4,
    name: "Mutlu Ortaokulu",
    contact: "101 Mutlu Sokak, Bursa",
    needs: [
      { name: "Müzik Aletleri", quantity: 15 },
      { name: "Bilgisayar", quantity: 10 },
      { name: "Yazıcı", quantity: 3 },
      { name: "Kırtasiye Malzemeleri", quantity: 500 },
    ],
  },
  {
    id: 5,
    name: "Dost İlkokulu",
    contact: "202 Dost Caddesi, Antalya",
    needs: [
      { name: "Oyuncaklar", quantity: 60 },
      { name: "Eğitim Materyalleri", quantity: 75 },
      { name: "Sıcak Yemek (Günlük Öğün)", quantity: 30 },
      { name: "Mont ve Ayakkabı (Çift)", quantity: 40 },
    ],
  },
];

export default function SchoolProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const router = useRouter();
  const id = params.id as string;

  const [school, setSchool] = useState<SchoolProfile | null>(null);
  const [displayedNeeds, setDisplayedNeeds] = useState<Need[]>([]);
  //bu kismi test et !!!!!!!!!!!!
  // Eğer middleware error parametresi eklediyse uyarı göster 
  useEffect(() => {
    if (error === 'not-authorized') {
      toast({
        title: 'Yetkisiz İşlem',
        description: 'Farklı bir profili düzenleyemezsiniz.',
        type: 'error',
        open: true,
        onOpenChange: () => {},
      });
    }
  }, [error]);


  // Okul bilgilerini yükle
  useEffect(() => {
    const schoolId = Number(id);
    if (isNaN(schoolId)) {
      setSchool(null);
      setDisplayedNeeds([]);
      return;
    }
    const currentSchoolData = initialSchoolProfiles.find(s => s.id === schoolId);
    if (currentSchoolData) {
      setSchool(currentSchoolData);
      setDisplayedNeeds(currentSchoolData.needs.map(need => ({ ...need })));
    } else {
      setSchool(null);
      setDisplayedNeeds([]);
    }
  }, [id]);

  const handleEditProfile = () => {
    router.push(`/schools/${id}/edit`);
  };

  if (!school) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8">
        <h1 className="text-2xl font-bold">Okul Bulunamadı</h1>
        <p className="text-gray-600 mt-2">Belirtilen ID ile bir okul profili bulunamadı.</p>
        <Toaster />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white">
        <div
          className="h-[35vh] w-full bg-cover bg-center relative"
          style={{ backgroundImage: "url('/örnekilkokul.jpg')", backgroundColor: '#1E3A8A' }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <h1 className="text-4xl font-bold text-white text-center px-4">{school.name}</h1>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3 flex-shrink-0 rounded border border-gray-300 p-6 shadow-md bg-gray-50">
              <h2 className="mb-4 text-xl font-semibold text-center text-slate-800 border-b pb-2">İLETİŞİM BİLGİLERİ</h2>
              <p className="text-gray-700">{school.contact}</p>
              <button
                onClick={handleEditProfile}
                className="mt-6 w-full rounded bg-indigo-600 hover:bg-indigo-700 py-2.5 text-white font-semibold transition-colors duration-200"
              >
                Profili Düzenle
              </button>
            </div>

            <div className="flex-1 rounded border border-gray-300 p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold text-center text-slate-800 border-b pb-2">İHTİYAÇ LİSTESİ</h2>
              <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-2 border rounded p-3 bg-gray-50">
                {displayedNeeds.length > 0 ? (
                  displayedNeeds.map((need, index) => (
                    <div
                      key={index}
                      className="rounded border p-3 flex justify-between items-center border-gray-300 bg-white"
                    >
                      <span className="font-medium text-gray-800">{need.name}</span>
                      <span className="text-sm font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded">
                        Adet: {need.quantity}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 italic py-4">Henüz ihtiyaç eklenmemiş.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </>
  );
}
