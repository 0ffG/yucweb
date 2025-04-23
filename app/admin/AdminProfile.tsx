'use client';

export default function AdminProfile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        {/* Form Alanları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* USER SİLME */}
          <div className="rounded-2xl bg-white shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              Kullanıcı Sil
            </h2>
            <p className="text-sm text-gray-500 text-center mt-1">
              Silmek istediğiniz kullanıcının ID’sini giriniz
            </p>
            <div className="mt-6">
              <input
                type="text"
                placeholder="User ID"
                className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <button className="mt-4 w-full rounded-lg bg-red-500 px-4 py-2 text-white font-semibold transition-all hover:bg-red-600 hover:shadow">
                Sil
              </button>
            </div>
          </div>

          {/* BAĞIŞ SAYISI GÜNCELLEME */}
          <div className="rounded-2xl bg-white shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              Toplam Bağışı Güncelle
            </h2>
            <p className="text-sm text-gray-500 text-center mt-1">
              Yeni toplam bağış sayısını giriniz
            </p>
            <div className="mt-6">
              <input
                type="number"
                placeholder="Bağış Sayısı"
                className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold transition-all hover:bg-blue-700 hover:shadow">
                Güncelle
              </button>
            </div>
          </div>
        </div>

        {/* TABLO */}
        <div className="rounded-2xl bg-white shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Bağış Geçmişi</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-gray-700 font-medium">
                <tr>
                  <th className="p-3">Kullanıcı Adı</th>
                  <th className="p-3">Bağış Türü</th>
                  <th className="p-3">Miktar</th>
                  <th className="p-3">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} className="hover:bg-gray-50">
                    <td className="p-3 font-medium">User {item}</td>
                    <td className="p-3">Eşya</td>
                    <td className="p-3">₺500</td>
                    <td className="p-3">2025-04-21</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
