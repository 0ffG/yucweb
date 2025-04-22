import Link from "next/link"

export default function SchoolProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-black">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">YUC</span>
          </Link>
          <Link href="/" className="text-2xl">
            ⌂
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mb-8">
          <div className="mb-4 rounded border border-black p-4">
            <h2 className="text-xl font-bold">A OKULU</h2>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <h3 className="mb-2 font-bold">İLETİŞİM BİLGİLERİ</h3>
            <div className="rounded border border-black p-4">
              <div className="h-32"></div>
            </div>
          </div>

          <div className="col-span-2">
            <h3 className="mb-2 font-bold">İHTİYAÇLAR</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded border border-black p-4">
                <div className="h-32"></div>
              </div>
              <div className="rounded border border-black p-4">
                <div className="h-32"></div>
              </div>
              <div className="rounded border border-black p-4">
                <div className="h-32"></div>
              </div>
              <div className="rounded border border-black p-4">
                <div className="h-32"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
