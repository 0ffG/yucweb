"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
// useToast ve Toaster'ı projenizdeki doğru yoldan import edin
import { useToast } from "@/hooks/use-toast"; // Varsayılan yol, gerekirse değiştirin
import { Toaster } from "@/components/ui/toaster"; // Varsayılan yol, gerekirse değiştirin

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

// Başlangıç verileri (Önceki gibi)
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
  const id = params.id as string; // Parametreleri string olarak alıyoruz
  const { toast } = useToast(); // Toast hook'unu kullanıma al

  // State tanımlamaları
  // Okul verisi null olabilir, bu yüzden SchoolProfile | null tipini kullanıyoruz
  const [school, setSchool] = useState<SchoolProfile | null>(null);
  const [needs, setNeeds] = useState<Need[]>([]); // İhtiyaç listesi state'i
  const [selectedNeedIndex, setSelectedNeedIndex] = useState<number | null>(null); // Seçili index (null olabilir)
  const [needName, setNeedName] = useState<string>(''); // İhtiyaç adı input'u
  const [needQuantity, setNeedQuantity] = useState<string>(''); // İhtiyaç adedi input'u (string olarak alıp sayıya çevireceğiz)

  // Okul verisini ve ihtiyaçları yükleme / güncelleme
  useEffect(() => {
    const schoolId = Number(id);
    if (isNaN(schoolId)) {
        setSchool(null); // Geçersiz ID ise okulu null yap
        setNeeds([]);
        return;
    }
    const currentSchoolData = initialSchoolProfiles.find(s => s.id === schoolId);
    if (currentSchoolData) {
        setSchool(currentSchoolData);
        // Derin kopyalama yaparak orijinal veriyi değiştirmemeyi garantileyelim
        setNeeds(currentSchoolData.needs.map(need => ({ ...need })));
    } else {
        setSchool(null); // Okul bulunamazsa null yap
        setNeeds([]);
    }
    // Okul değiştiğinde seçimi ve inputları sıfırla
    setSelectedNeedIndex(null);
    setNeedName('');
    setNeedQuantity('');
  }, [id]); // Bağımlılık olarak id eklendi

  // Okul bulunamadı durumu
  if (!school) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8">
        <h1 className="text-2xl font-bold">Okul Bulunamadı</h1>
        <p className="text-gray-600 mt-2">Belirtilen ID ile bir okul profili bulunamadı.</p>
         {/* Toaster'ı hata durumunda da göstermek için buraya da ekleyebiliriz */}
         <Toaster />
      </div>
    );
  }

  // İhtiyaç seçme fonksiyonu
  const handleSelectNeed = (index: number) => { // index türü: number
    setSelectedNeedIndex(index);
    setNeedName(needs[index].name);
    setNeedQuantity(needs[index].quantity.toString());
  };

  // Seçimi temizleme ve inputları sıfırlama
   const clearSelectionAndInputs = () => {
    setSelectedNeedIndex(null);
    setNeedName('');
    setNeedQuantity('');
   };

  // İhtiyaç ekleme fonksiyonu
  const handleAddNeed = () => {
    const quantity = Number(needQuantity);
    if (needName.trim() && !isNaN(quantity) && quantity > 0) {
      const newNeed: Need = { name: needName.trim(), quantity: quantity };
      setNeeds([...needs, newNeed]);
      clearSelectionAndInputs();
      toast({ // Başarı toast'ı
        title: "Başarılı!",
        description: `"${newNeed.name}" ihtiyacı listeye eklendi.`,
        type: "success",
        open: true,
        onOpenChange: () => {},
      });
    } else {
      toast({ // Hata toast'ı
        title: "Hata!",
        description: "Lütfen geçerli bir ihtiyaç adı ve pozitif bir adet girin.",
        type: "error", 
        open: true,
        onOpenChange: () => {},
      });
    }
  };

  // İhtiyaç güncelleme fonksiyonu
  const handleUpdateNeed = () => {
    const quantity = Number(needQuantity);
    if (selectedNeedIndex !== null && needName.trim() && !isNaN(quantity) && quantity > 0) {
      const updatedNeeds = [...needs];
      const updatedNeed: Need = { name: needName.trim(), quantity: quantity };
      updatedNeeds[selectedNeedIndex] = updatedNeed;
      setNeeds(updatedNeeds);
      clearSelectionAndInputs();
       toast({ // Başarı toast'ı
        title: "Başarılı!",
        description: `İhtiyaç "${updatedNeed.name}" olarak güncellendi.`,
        type: "success",
        open: true, // Added missing property
        onOpenChange: () => {}, // Added missing property
      });
    } else {
       toast({ // Hata toast'ı
        title: "Hata!",
        description: "Lütfen güncellenecek bir ihtiyaç seçin ve geçerli bilgiler girin.",
        type: "error",
        open: true, // Added missing property
        onOpenChange: () => {}, // Added missing property
      });
    }
  };

  // İhtiyaç çıkarma fonksiyonu
  const handleRemoveNeed = () => {
    if (selectedNeedIndex !== null) {
      const removedNeedName = needs[selectedNeedIndex].name;
      const updatedNeeds = needs.filter((_, index: number) => index !== selectedNeedIndex); // index türü: number
      setNeeds(updatedNeeds);
      clearSelectionAndInputs();
       toast({ // Başarı toast'ı
        title: "Başarılı!",
        description: `"${removedNeedName}" ihtiyacı listeden çıkarıldı.`,
        type: "success", // Changed from variant
        open: true,
        onOpenChange: () => {},
      });
    } else {
      toast({ // Hata toast'ı
        title: "Hata!",
        description: "Lütfen çıkarılacak bir ihtiyaç seçin.",
        type: "error", // Changed from variant
        open: true,
        onOpenChange: () => {},
      });
    }
  };

  return (
    <> {/* Fragment kullanarak Toaster'ı ve ana içeriği sarmalayalım */}
      <div className="flex min-h-screen flex-col bg-white">
        {/* Üstte arka plan resmi */}
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
            {/* İletişim Bilgileri Kutusu */}
            <div className="lg:w-1/3 flex-shrink-0 rounded border border-gray-300 p-6 shadow-md bg-gray-50">
              <h2 className="mb-4 text-xl font-semibold text-center text-slate-800 border-b pb-2">İLETİŞİM BİLGİLERİ</h2>
              <p className="text-gray-700">{school.contact}</p>
            </div>

            {/* İhtiyaçlar Bölümü */}
            <div className="flex-1 rounded border border-gray-300 p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold text-center text-slate-800 border-b pb-2">İHTİYAÇ LİSTESİ</h2>

              {/* İhtiyaç Listesi */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 border rounded p-3 bg-gray-50">
                {needs.length > 0 ? (
                  needs.map((need: Need, index: number) => ( // need ve index türleri belirtildi
                    <div
                      key={index}
                      className={`rounded border p-3 flex justify-between items-center cursor-pointer transition-all duration-200 ${
                        selectedNeedIndex === index
                          ? "bg-blue-100 border-blue-500 ring-2 ring-blue-300" // Daha belirgin seçim stili
                          : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                      }`}
                      onClick={() => handleSelectNeed(index)}
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

              {/* İhtiyaç Ekleme/Güncelleme Formu */}
              <div className="rounded border border-gray-300 p-4 bg-gray-50 mt-4">
                <h3 className="text-lg font-semibold mb-3 text-slate-700">
                  {selectedNeedIndex !== null ? 'İhtiyacı Düzenle' : 'Yeni İhtiyaç Ekle'}
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                  <input
                    type="text"
                    value={needName}
                    onChange={(e) => setNeedName(e.target.value)}
                    className="flex-1 rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="İhtiyaç adı"
                    aria-label="İhtiyaç adı" // Erişilebilirlik
                  />
                  <input
                    type="number"
                    value={needQuantity}
                    onChange={(e) => setNeedQuantity(e.target.value)}
                    min="1"
                    className="sm:w-1/4 rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Adet"
                    aria-label="İhtiyaç adedi" // Erişilebilirlik
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={handleAddNeed}
                    className="w-full rounded bg-green-600 hover:bg-green-700 py-2 text-white font-bold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={selectedNeedIndex !== null}
                  >
                    Ekle
                  </button>
                  <button
                    onClick={handleUpdateNeed}
                    className="w-full rounded bg-blue-600 hover:bg-blue-700 py-2 text-white font-bold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={selectedNeedIndex === null}
                  >
                    Güncelle
                  </button>
                  <button
                    onClick={handleRemoveNeed}
                    className="w-full rounded bg-red-600 hover:bg-red-700 py-2 text-white font-bold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={selectedNeedIndex === null}
                  >
                    Çıkar
                  </button>
                </div>
                {/* Seçimi Temizle Butonu */}
                {selectedNeedIndex !== null && (
                   <button
                     onClick={clearSelectionAndInputs}
                     className="mt-3 w-full rounded bg-gray-500 hover:bg-gray-600 py-2 text-white font-bold transition-colors duration-200 text-sm"
                   >
                     Seçimi Temizle / Yeni Ekleme Modu
                   </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Toaster bileşenini sayfanın sonunda render et */}
      <Toaster />
    </>
  );
}