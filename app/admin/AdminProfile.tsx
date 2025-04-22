'use client';

export default function AdminProfile() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container px-4 py-8">
        <div className="mb-6 flex gap-4">
          <div className="flex-1 rounded border border-black p-4 text-center">
            <h2 className="text-lg font-bold">OKULLARI GÖRÜNTÜLE VE EKLE/DÜZENLE</h2>
            <div className="mt-4 flex justify-center">
              <button className="rounded bg-black px-4 py-2 text-white">SİL</button>
            </div>
          </div>
          <div className="flex-1 rounded border border-black p-4 text-center">
            <h2 className="text-lg font-bold">BAĞIŞLARI GÖRÜNTÜLE VE DÜZENLE</h2>
            <div className="mt-4 flex justify-center">
              <button className="rounded bg-black px-4 py-2 text-white">BUTTON 2</button>
            </div>
          </div>
        </div>

        <div className="rounded border border-black p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black">
                <th className="p-2 text-left">KULLANICI ADI</th>
                <th className="p-2 text-left">BAĞIŞ TÜRÜ</th>
                <th className="p-2 text-left">MİKTAR</th>
                <th className="p-2 text-left">TARİH</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="border-b border-black">
                  <td className="p-2">User {item}</td>
                  <td className="p-2">Type</td>
                  <td className="p-2">Amount</td>
                  <td className="p-2">Date</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
