'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface Donor {
  id: number;
  name: string;
  lastName: string;
  photo?: string | null;
}

export default function EditDonorProfile() {
  const [donor, setDonor] = useState<Donor | null>(null);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      router.push('/');
      return;
    }
    fetch(`/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setDonor(data);
        setName(data.name);
        setLastName(data.lastName);
        setPhoto(data.photo || null);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const userId = Number(localStorage.getItem('userId'));
    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, lastName, photo }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Güncelleme başarısız');
      toast({ title: 'Başarılı', description: 'Profil güncellendi.', type: 'success', open: true, onOpenChange: () => {} });
      // --- localStorage güncelleme ve event tetikleme ---
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const userObj = JSON.parse(userRaw);
        const updatedUser = {
          ...userObj,
          name,
          lastName,
          photo,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('userChanged'));
      }
      // --- ---
      router.push('/donor');
    } catch (err: any) {
      toast({ title: 'Hata', description: err.message, type: 'error', open: true, onOpenChange: () => {} });
    } finally {
      setLoading(false);
    }
  };

  if (!donor) return <div className="p-8 text-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-lg shadow-md w-full max-w-md space-y-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-blue-950 mb-4">Profili Düzenle</h2>
        <div className="flex flex-col items-center">
          <div className="mb-2 h-24 w-24 rounded-full border border-gray overflow-hidden">
            <img src={photo || '/pfpdefault.jpg'} alt="Profil Fotoğrafı" className="h-full w-full object-cover" />
          </div>
          {/* Sadece fotoğraf dosyası yükleme butonu */}
          <label className="mt-2 w-full">
            <span className="block mb-1 text-sm font-medium">Fotoğraf Yükle</span>
            <input
              type="file"
              accept="image/*"
              className="border rounded px-2 py-1 text-sm w-full cursor-pointer"
              style={{ display: 'block' }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append('file', file);
                try {
                  const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                  });
                  const data = await res.json();
                  if (res.ok && data.url) {
                    setPhoto(data.url);
                    toast({ title: 'Başarılı', description: 'Fotoğraf yüklendi.', type: 'success', open: true, onOpenChange: () => {} });
                  } else {
                    toast({ title: 'Hata', description: data.error || 'Fotoğraf yüklenemedi.', type: 'error', open: true, onOpenChange: () => {} });
                  }
                } catch (err) {
                  toast({ title: 'Hata', description: 'Fotoğraf yüklenemedi.', type: 'error', open: true, onOpenChange: () => {} });
                }
              }}
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ad</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Soyad</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-xl bg-blue-950 text-white font-semibold hover:bg-black transition"
          disabled={loading}
        >
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>
    </div>
  );
}
