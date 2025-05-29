'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface MaterialDonation {
  schoolId: number;
  schoolName: string;
  item: string;
  amount: number;
  createdAt: string;
}

interface Donor {
  id: number;
  name: string;
  lastName: string;
  role: string;
  photo?: string | null;
  totalMoneyDonated: number;
  materialDonations: MaterialDonation[];
}

export default function DonorProfile() {
  const [donor, setDonor] = useState<Donor | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const userId = Number(localStorage.getItem("userId"));
    const role = localStorage.getItem("role");

    if (!userId || role !== "donor") {
      toast({
        title: "Erişim Reddedildi",
        description: "Bu sayfaya yalnızca bağışçılar erişebilir.",
        type: "error",
        open: true,
        onOpenChange: () => {},
      });
      router.push("/");
      return;
    }

    fetch(`/api/user/${userId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Veri alınamadı");
        return res.json();
      })
      .then((data) => {
        setDonor(data);
      })
      .catch((err) => {
        toast({
          title: "Hata",
          description: err.message,
          type: "error",
          open: true,
          onOpenChange: () => {},
        });
        router.push("/");
      });
  }, []);

  if (!donor) return <div className="p-8 text-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-white">
      <main className="container px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row items-start gap-6">
          <div className="flex flex-col items-center">
            <div className="mb-2 h-32 w-32 rounded-full border border-gray overflow-hidden">
              <img
                src={donor.photo || "/pfpdefault.jpg"}
                alt="Profil Fotoğrafı"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 mt-4">
            <h3 className="font-bold text-2xl text-blue-950">
              {donor.name} {donor.lastName}
            </h3>
            <p className="text-sm">{donor.role.toUpperCase()}</p>

            <div className="mt-4">
              <button
                type="button"
                className="rounded-xl border border-blue-950 py-1 px-4 text-blue-950 text-xs hover:border-black hover:text-black"
                onClick={() => router.push("/donor/edit")}
              >
                Profili Düzenle
              </button>
            </div>

            <div className="mt-6 p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
              <h4 className="text-lg font-bold underline mb-2">Bağış Yapılan Kurumlar:</h4>
              {donor.materialDonations.length > 0 ? (
                <ul className="space-y-3 list-disc list-inside">
                  {donor.materialDonations.map((donation, index) => (
                    <li key={index}>
                      <span className="font-semibold">{donation.schoolName}</span> kurumuna {donation.amount} adet {donation.item} bağışı yapıldı.
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Herhangi bir kuruma malzeme bağışı yapılmadı.</p>
              )}
            </div>
          </div>

          <div className="space-y-4 mt-6 md:mt-10">
            <div className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50 flex items-center gap-2">
              <img src="/money.png" alt="Para" className="h-6 w-6" />
              <span className="font-mono">
                Toplam Para Bağışı: <strong>{donor.totalMoneyDonated}₺</strong>
              </span>
            </div>
            <div className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50 flex items-center gap-2">
              <img src="/plant.png" alt="Fidan" className="h-6 w-6" />
              <span className="font-mono">
                Toplam Fidan: <strong>{Math.floor(donor.materialDonations.length / 5)}</strong>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
