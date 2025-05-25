"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Need {
  id: number;
  name: string;
  quantity: number;
}

interface School {
  id: number;
  name: string;
  email: string;
  location?: string;
  needs: Need[];
}

interface User {
  id: number;
  role: string;
}

export default function EditSchoolProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [school, setSchool] = useState<School | null>(null);
  const [needs, setNeeds] = useState<Need[]>([]);
  const [selectedNeedIndex, setSelectedNeedIndex] = useState<number | null>(null);
  const [needName, setNeedName] = useState("");
  const [needQuantity, setNeedQuantity] = useState("");

  const [user, setUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editLocation, setEditLocation] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (!res.ok) throw new Error();
        const userData = await res.json();
        setUser(userData);
      } catch {
        toast({
          title: "Hata",
          description: "Kullanıcı bilgisi alınamadı.",
          variant: "destructive",
        });
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const res = await fetch(`/api/schools/${id}`);
        if (!res.ok) throw new Error("Okul bulunamadı");
        const data = await res.json();
        setSchool(data);
        setEditName(data.name || "");
        setEditEmail(data.email || "");
        setEditLocation(data.location || "");
        setNeeds(data.needs);
      } catch {
        toast({
          title: "Hata",
          description: "Okul verisi alınamadı.",
          variant: "destructive",
        });
      }
    };
    fetchSchool();
  }, [id]);

  useEffect(() => {
    if (user && school) {
      const isOwner = user.role === "school" && user.id === school.id;
      setIsAuthorized(isOwner);
    }
  }, [user, school]);

  const clearForm = () => {
    setSelectedNeedIndex(null);
    setNeedName("");
    setNeedQuantity("");
  };

  const handleProfileUpdate = async () => {
    try {
      const res = await fetch(`/api/schools/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          location: editLocation,
        }),
      });

      if (!res.ok) throw new Error();
      const updated = await res.json();
      setSchool(updated);

      const localUser = localStorage.getItem("user");
      if (localUser) {
        const parsedUser = JSON.parse(localUser);
        parsedUser.name = updated.name;
        localStorage.setItem("user", JSON.stringify(parsedUser));
      }

      toast({
        title: "Başarılı",
        description: "Profil bilgileri güncellendi.",
      });
    } catch {
      toast({
        title: "Hata",
        description: "Profil güncellenemedi.",
        variant: "destructive",
      });
    }
  };

  const handleAddNeed = async () => {
    if (!needName || !needQuantity || !isAuthorized) return;

    try {
      const res = await fetch(`/api/schools/${id}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ item: needName, amount: Number(needQuantity) }),
      });
      if (!res.ok) throw new Error();
      const newNeed = await res.json();
      setNeeds(prev => [...prev, newNeed]);
      toast({
        title: "Eklendi",
        description: `${needName} başarıyla eklendi.`,
      });
      clearForm();
    } catch {
      toast({
        title: "Hata",
        description: "İhtiyaç eklenemedi.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateNeed = async () => {
    if (selectedNeedIndex === null || !isAuthorized) return;
    const need = needs[selectedNeedIndex];
    if (!need?.id) return;

    try {
      const res = await fetch(`/api/schools/${id}/inventory/${need.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ item: needName, amount: Number(needQuantity) }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      const newList = [...needs];
      newList[selectedNeedIndex] = updated;
      setNeeds(newList);
      toast({
        title: "Güncellendi",
        description: `${updated.item} başarıyla güncellendi.`,
      });
      clearForm();
    } catch {
      toast({
        title: "Hata",
        description: "Güncelleme başarısız.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNeed = async () => {
    if (selectedNeedIndex === null || !isAuthorized) return;
    const need = needs[selectedNeedIndex];
    if (!need?.id) return;

    try {
      const res = await fetch(`/api/schools/${id}/inventory/${need.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");

      setNeeds(prev => prev.filter((_, idx) => idx !== selectedNeedIndex));
      toast({
        title: "Silindi",
        description: `${need.name} kaldırıldı.`,
      });
      clearForm();
    } catch {
      toast({
        title: "Hata",
        description: "Silme işlemi başarısız.",
        variant: "destructive",
      });
    }
  };

  const handleSelectNeed = (index: number) => {
    setSelectedNeedIndex(index);
    setNeedName(needs[index].name);
    setNeedQuantity(String(needs[index].quantity));
  };

  if (!school) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{school.name} - İhtiyaç Düzenleme</h1>

      {!isAuthorized ? (
        <div className="text-red-600 font-semibold">Bu sayfayı görüntüleme yetkiniz yok.</div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {needs.map((need, index) => (
              <div
                key={index}
                onClick={() => handleSelectNeed(index)}
                className={`cursor-pointer p-3 border rounded flex justify-between ${
                  selectedNeedIndex === index ? "bg-blue-100 border-blue-500" : ""
                }`}
              >
                <span>{need.name}</span>
                <span>Adet: {need.quantity}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <input
              className="w-full p-2 border rounded"
              placeholder="İhtiyaç Adı"
              value={needName}
              onChange={(e) => setNeedName(e.target.value)}
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Adet"
              type="number"
              min={1}
              value={needQuantity}
              onChange={(e) => setNeedQuantity(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button onClick={handleAddNeed} className="px-4 py-2 bg-green-600 text-white rounded">
                Ekle
              </button>
              <button
                onClick={handleUpdateNeed}
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={selectedNeedIndex === null}
              >
                Güncelle
              </button>
              <button
                onClick={handleDeleteNeed}
                className="px-4 py-2 bg-red-600 text-white rounded"
                disabled={selectedNeedIndex === null}
              >
                Sil
              </button>
            </div>
            {selectedNeedIndex !== null && (
              <button onClick={clearForm} className="mt-2 text-sm text-gray-600 underline">
                Seçimi temizle
              </button>
            )}
          </div>

          <div className="mt-10 p-4 border rounded bg-gray-50">
            <h2 className="text-xl font-semibold mb-4">Profil Bilgilerini Güncelle</h2>
            <div className="space-y-2">
              <input
                className="w-full p-2 border rounded"
                placeholder="Okul Adı"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Konum"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
              />
              <button
                onClick={handleProfileUpdate}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Profili Kaydet
              </button>
            </div>
          </div>
        </>
      )}

      <Toaster />
    </div>
  );
}
