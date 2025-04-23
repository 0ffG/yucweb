
export default function DonorProfile() {
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
              <h3 className="font-bold text-2xl text-blue-950 ">AD SOYAD</h3>
                <p className="text-sm">BAĞIŞÇI</p>
            </div>
            <div className="mt-4">
              <button type="button" className=" rounded-xl border border-blue-950 py-1 px-4 text-blue-950 text-xs hover:border-black hover:text-black">
                Profili Düzenle</button>
            </div>
            <div className="mt-6 p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50 lex-grow">
              <h4 className=" text-lg font-bold underline">Bağış Yapılan Kurumlar:</h4>
              <ul className="mt-2 space-y-3 list-disc list-inside">
                <li className=""><button type="button">Umut Ortaokulu</button></li>
                <li className=""><button type="button">Dost Ortaokulu</button></li>
                <li className=""><button type="button">Örnek İlkokulu</button></li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
          <div className="mt-10 p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50 flex-shrink">
            <div className="flex items-center space-x-2">
              <img src="/money.png" alt="Money" className="h-7 w-7" />
              <h4 className=" font-mono">Yapılan toplam para bağışı: 1000₺</h4>
            </div>
          </div>
          <div className="mt-10 p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50 flex-shrink">
          <div className="flex items-center space-x-2">
            <img src="/plant.png" alt="Plant" className="h-7 w-7" />
            <h4 className="font-mono">Dikilen toplam fidan sayısı: 2</h4>
          </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  )
}
