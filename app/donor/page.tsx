
export default function DonorProfile() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container px-4 py-8">
        <div className="mb-8 flex items-start gap-6">
          <div className="flex flex-col items-center">
            <div className="mb-2 h-24 w-24 rounded-full border border-black"></div>
            <h3 className="font-bold">İSİM SOYİSİM</h3>
            <p className="text-sm">BAĞIŞÇI</p>
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <h3 className="font-bold">BAĞIŞ GEÇMİŞİ GÖRÜNTÜLEME</h3>
            </div>
            <div className="mb-4">
              <button className="rounded bg-black px-4 py-2 text-white">BAĞIŞ YAP</button>
            </div>
            <div className="rounded border border-black p-4">
              <div className="h-32"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
