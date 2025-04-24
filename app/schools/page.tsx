import Link from "next/link"

export default function AllSchoolsPage() {
  return (
    <div
      className="flex min-h-screen flex-col bg-cover bg-center bg-[url('/arkaplan.jpg')] bg-opacity-50"
    >
      <header className="px-4 py-4 bg-white/80">
        <h1 className="text-xl font-bold uppercase">OKUL PROFİLLERİ</h1>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-8 py-8">
        <ul className="space-y-6 w-full max-w-2xl">
          {[
            "Örnek İlkokulu",
            "Yeni Nesil Okulu",
            "Umut Ortaokulu",
            "Mutlu Ortaokulu",
            "Dost İlkokulu",
          ].map((school, index) => (
            <li key={index}>
              <Link
                href={`/schools/${index + 1}`}
                className="flex w-full items-center space-x-4 rounded-2xl border border-gray-300 bg-white px-6 py-4 shadow hover:bg-gray-100"
              >
                {/* Sol tarafta resim */}
                <div className="h-20 w-20 flex-shrink-0 rounded bg-gray-200">
                  <img
                    src="/classroom.jpg"
                    alt={`${school} resmi`}
                    className="h-full w-full rounded object-cover"
                  />
                </div>
                {/* Okul adı ve yazı */}
                <div className="flex flex-col flex-grow">
                  <span className="text-lg font-bold text-black">{school}</span>
                  <span className="text-sm text-gray-700">Profili Gör</span>
                </div>
                <div className="text-gray-500">&gt;</div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
