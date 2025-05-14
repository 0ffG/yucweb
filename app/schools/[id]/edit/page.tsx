// Dosya Yolu: app/school/[id]/edit/page.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast"; // Varsayılan yol, gerekirse değiştirin
import { Toaster } from "@/components/ui/toaster"; // Varsayılan yol, gerekirse değiştirin

// Veri tiplerini tanımlayalım
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

// Başlangıç verileri (Bu verinin global bir state'ten veya API'den gelmesi daha iyi olur)
// Şimdilik demo amacıyla burada tekrar tanımlıyoruz.
// GERÇEK BİR UYGULAMADA: Bu veriyi ya API'den çekin ya da bir state management çözümü kullanın.
// Bu statik listenin doğrudan değiştirilmesi, state yönetimi için iyi bir pratik değildir.
// Değişikliklerin kalıcı olması için backend'e istek atılmalı veya global state güncellenmelidir.
let initialSchoolProfiles: SchoolProfile[] = [
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

export default function EditSchoolProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { toast } = useToast();

  const [school, setSchool] = useState<SchoolProfile | null>(null);
  const [needs, setNeeds] = useState<Need[]>([]);
  const [selectedNeedIndex, setSelectedNeedIndex] = useState<number | null>(null);
  const [needName, setNeedName] = useState<string>('');
  const [needQuantity, setNeedQuantity] = useState<string>('');

  useEffect(() => {
    const schoolId = Number(id);
    if (isNaN(schoolId)) {
        setSchool(null);
        setNeeds([]);
        toast({ title: "Hata", description: "Geçersiz okul ID'si.", type: "error", open: true, onOpenChange: () => {} });
        return;
    }
    const currentSchoolData = initialSchoolProfiles.find(s => s.id === schoolId);
    if (currentSchoolData) {
        setSchool(currentSchoolData);
        setNeeds(currentSchoolData.needs.map(need => ({ ...need }))); // Derin kopyalama
    } else {
        setSchool(null);
        setNeeds([]);
        toast({ title: "Hata", description: "Okul profili bulunamadı.", type: "error", open: true, onOpenChange: () => {} });
    }
    setSelectedNeedIndex(null);
    setNeedName('');
    setNeedQuantity('');
  }, [id, toast]); // toast'ı bağımlılıklara ekledik

  const handleSelectNeed = (index: number) => {
    setSelectedNeedIndex(index);
    setNeedName(needs[index].name);
    setNeedQuantity(needs[index].quantity.toString());
  };

  const clearSelectionAndInputs = () => {
    setSelectedNeedIndex(null);
    setNeedName('');
    setNeedQuantity('');
  };

  // ÖNEMLİ NOT: Veri Kalıcılığı Hakkında
  // Aşağıdaki handleAddNeed, handleUpdateNeed, handleRemoveNeed fonksiyonları `initialSchoolProfiles`
  // dizisini doğrudan günceller. Bu, SADECE DEMO AMAÇLIDIR ve değişikliklerin aynı session içinde
  // sayfalar arası geçişte görünmesini sağlar. Gerçek bir uygulamada, bu tür güncellemeler
  // bir API'ye gönderilmeli ve global state (örn: Redux, Zustand, React Context + SWR/React Query)
  // buna göre güncellenmelidir. Statik bir array'in `let` ile tanımlanıp mutate edilmesi iyi bir pratik değildir.

  const updateInitialProfiles = (updatedNeedsList: Need[]) => {
    if (school) {
        const schoolIndex = initialSchoolProfiles.findIndex(s => s.id === school.id);
        if (schoolIndex !== -1) {
            // Bu satır initialSchoolProfiles'ı mutate eder, dikkatli olun!
            initialSchoolProfiles[schoolIndex].needs = [...updatedNeedsList];
        }
    }
  };


  const handleAddNeed = () => {
    const quantity = Number(needQuantity);
    if (needName.trim() && !isNaN(quantity) && quantity > 0) {
      const newNeed: Need = { name: needName.trim(), quantity: quantity };
      const updatedNeeds = [...needs, newNeed];
      setNeeds(updatedNeeds);
      updateInitialProfiles(updatedNeeds); // Demo için statik veriyi güncelle
      clearSelectionAndInputs();
      toast({
        title: "Başarılı!",
        description: `"${newNeed.name}" ihtiyacı listeye eklendi.`,
        type: "success", open: true, onOpenChange: () => {},
      });
    } else {
      toast({
        title: "Hata!",
        description: "Lütfen geçerli bir ihtiyaç adı ve pozitif bir adet girin.",
        type: "error", open: true, onOpenChange: () => {},
      });
    }
  };

  const handleUpdateNeed = () => {
    const quantity = Number(needQuantity);
    if (selectedNeedIndex !== null && needName.trim() && !isNaN(quantity) && quantity > 0) {
      const updatedNeeds = [...needs];
      const updatedNeed: Need = { name: needName.trim(), quantity: quantity };
      updatedNeeds[selectedNeedIndex] = updatedNeed;
      setNeeds(updatedNeeds);
      updateInitialProfiles(updatedNeeds); // Demo için statik veriyi güncelle
      clearSelectionAndInputs();
       toast({
        title: "Başarılı!",
        description: `İhtiyaç "${updatedNeed.name}" olarak güncellendi.`,
        type: "success", open: true, onOpenChange: () => {},
      });
    } else {
       toast({
        title: "Hata!",
        description: "Lütfen güncellenecek bir ihtiyaç seçin ve geçerli bilgiler girin.",
        type: "error", open: true, onOpenChange: () => {},
      });
    }
  };

  const handleRemoveNeed = () => {
    if (selectedNeedIndex !== null) {
      const removedNeedName = needs[selectedNeedIndex].name;
      const updatedNeeds = needs.filter((_, index: number) => index !== selectedNeedIndex);
      setNeeds(updatedNeeds);
      updateInitialProfiles(updatedNeeds); // Demo için statik veriyi güncelle
      clearSelectionAndInputs();
       toast({
        title: "Başarılı!",
        description: `"${removedNeedName}" ihtiyacı listeden çıkarıldı.`,
        type: "success", open: true, onOpenChange: () => {},
      });
    } else {
      toast({
        title: "Hata!",
        description: "Lütfen çıkarılacak bir ihtiyaç seçin.",
        type: "error", open: true, onOpenChange: () => {},
      });
    }
  };

  if (!school) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8">
        <h1 className="text-2xl font-bold">Okul Profili Düzenleme Sayfası</h1>
        <p className="text-gray-600 mt-2">Okul verisi yükleniyor veya bulunamadı...</p>
        <button
            onClick={() => router.back()}
            className="mt-4 rounded bg-gray-500 hover:bg-gray-600 px-4 py-2 text-white font-semibold transition-colors duration-200"
        >
            Geri Dön
        </button>
        <Toaster />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-100">
        <header className="bg-indigo-700 shadow-md p-4 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Profili Düzenle: {school.name}</h1>
                <button
                    onClick={() => router.push(`/school/${id}`)} // Profil görüntüleme sayfasına geri dön
                    className="rounded bg-blue-500 hover:bg-blue-600 px-3 py-1.5 sm:px-4 sm:py-2 text-white font-semibold transition-colors duration-200 text-sm sm:text-base"
                >
                    Düzenlemeyi Bitir
                </button>
            </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="w-full max-w-3xl mx-auto rounded border border-gray-300 p-6 shadow-lg bg-white">
            <h2 className="mb-6 text-2xl font-semibold text-center text-slate-800 border-b pb-3">
              İHTİYAÇ LİSTESİNİ DÜZENLE
            </h2>

            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 border rounded p-3 bg-gray-50">
              {needs.length > 0 ? (
                needs.map((need: Need, index: number) => (
                  <div
                    key={index}
                    className={`rounded border p-3 flex justify-between items-center cursor-pointer transition-all duration-200 ${
                      selectedNeedIndex === index
                        ? "bg-blue-100 border-blue-500 ring-2 ring-blue-300"
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
                  aria-label="İhtiyaç adı"
                />
                <input
                  type="number"
                  value={needQuantity}
                  onChange={(e) => setNeedQuantity(e.target.value)}
                  min="1"
                  className="sm:w-1/4 rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Adet"
                  aria-label="İhtiyaç adedi"
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
        </main>
      </div>
      <Toaster />
    </>
  );
}