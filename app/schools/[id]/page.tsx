"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Need {
  name: string;
  quantity: number;
}

interface SchoolProfile {
  id: number;
  name: string;
  email: string;
  contact?: string;
  location?: string;
  needs: Need[];
}

export default function SchoolProfilePage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const router = useRouter();

  const [school, setSchool] = useState<SchoolProfile | null>(null);
  const [displayedNeeds, setDisplayedNeeds] = useState<Need[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (error === "not-authorized") {
      toast({
        title: "Yetkisiz İşlem",
        description: "Farklı bir profili düzenleyemezsiniz.",
        variant: "destructive",
      });
    }
  }, [error]);

  useEffect(() => {
    const fetchSchool = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/schools/${id}`);
        if (!res.ok) throw new Error("Okul verisi alınamadı");
        const data = await res.json();
        setSchool(data);
        setDisplayedNeeds(data.needs);
      } catch (err) {
        console.error("Hata:", err);
        setSchool(null);
        setDisplayedNeeds([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchSchool();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8">
        <h1 className="text-2xl font-bold">Yükleniyor...</h1>
        <Toaster />
      </div>
    );
  }

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
          style={{ backgroundImage: "url('/örnekilkokul.jpg')" }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <h1 className="text-4xl font-bold text-white text-center px-4">{school.name}</h1>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3 rounded border border-gray-300 p-6 shadow-md bg-gray-50">
              <h2 className="mb-4 text-xl font-semibold text-center text-slate-800 border-b pb-2">
                İLETİŞİM BİLGİLERİ
              </h2>
              <p className="text-gray-700">
                <strong>Email:</strong> {school.email}
              </p>
              <p className="text-gray-700">
                <strong>Konum:</strong> {school.location || "Konum belirtilmedi"}
              </p>
              <button
                onClick={() => router.push(`/schools/${school.id}/edit`)}
                className="mt-6 w-full rounded bg-indigo-600 hover:bg-indigo-700 py-2.5 text-white font-semibold transition-colors duration-200"
              >
                Profili Düzenle
              </button>
            </div>

            <div className="flex-1 rounded border border-gray-300 p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold text-center text-slate-800 border-b pb-2">
                İHTİYAÇ LİSTESİ
              </h2>
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
                  <p className="text-center text-gray-500 italic py-4">
                    Henüz ihtiyaç eklenmemiş.
                  </p>
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
