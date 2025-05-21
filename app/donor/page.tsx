'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface MaterialDonation {
  schoolName: string;
}

interface Donor {
  id: number;
  name: string;
  lastName: string;
  role: string;
  totalMoneyDonated: number;
  totalSaplingsDonated: number;
  materialDonations: MaterialDonation[];
}

export default function DonorProfile() {
  const [donor, setDonor] = useState<Donor | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const userId = Number(localStorage.getItem("userId"));
    const role = localStorage.getItem("role");
    console.log("userId:", localStorage.getItem("userId")); // "1" olmalı

    if (!userId || role !== "donor") {
      toast({
        title: "Erişim Reddedildi",
        description: "Bu sayfaya yalnızca bağışçılar erişebilir.",
        variant: "destructive",
      });
      router.push("/");
      return;
    }

    fetch(`/api/user/${userId}`, {
      method: "GET",
      credentials: "include", // 🔥 Cookie gönderir (token varsa)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Veri alınamadı");
        return res.json();
      })
      .then((data: Donor) => {
        if (data.id !== userId) {
          toast({
            title: "Yetkisiz",
            description: "Sadece kendi profilinizi görüntüleyebilirsiniz.",
            variant: "destructive",
          });
          router.push("/");
          return;
        }
        setDonor(data);
      })
      .catch((err) => {
        toast({
          title: "Hata",
          description: err.message,
          variant: "destructive",
        });
        router.push("/");
      });
    
  }, []);

  if (!donor) {
    return <div className="p-8 text-center">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="container px-4 py-8">
        <div className="mb-8 flex items-start gap-6">
          <div className="flex flex-col items-center">
            <div className="mb-2 h-32 w-32 rounded-full border border-gray overflow-hidden">
              <img src="/pfpdefault.jpg" alt="Profile" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="flex-1 mt-4">
            <div className="space-y-1">
              <h3 className="font-bold text-2xl text-blue-950">
                {donor.name} {donor.lastName}
              </h3>
              <p className="text-sm">{donor.role.toUpperCase()}</p>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="rounded-xl border border-blue-950 py-1 px-4 text-blue-950 text-xs hover:border-black hover:text-black"
              >
                Profili Düzenle
              </button>
            </div>

            <div className="mt-6 p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
              <h4 className="text-lg font-bold underline">Bağış Yapılan Kurumlar:</h4>
              <ul className="mt-2 space-y-3 list-disc list-inside">
                {donor.materialDonations.length > 0 ? (
                  donor.materialDonations.map((donation, index) => (
                    <li key={index}>
                      <button type="button">{donation.schoolName}</button>
                    </li>
                  ))
                ) : (
                  <li>Herhangi bir kuruma malzeme bağışı yapılmadı.</li>
                )}
              </ul>

            </div>
          </div>

          <div className="space-y-2">
            <div className="mt-10 p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
              <div className="flex items-center space-x-2">
                <img src="/money.png" alt="Money" className="h-7 w-7" />
                <h4 className="font-mono">
                  Yapılan toplam para bağışı: {donor.totalMoneyDonated}₺
                </h4>
              </div>
            </div>
            <div className="mt-10 p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
              <div className="flex items-center space-x-2">
                <img src="/plant.png" alt="Plant" className="h-7 w-7" />
                <h4 className="font-mono">
                  Dikilen toplam fidan sayısı: {donor.totalSaplingsDonated}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
