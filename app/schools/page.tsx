import Link from "next/link"

export default function AllSchoolsPage() {
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
        <h1 className="mb-6 text-xl font-bold">OKULLARIN PROFİLİ</h1>

        <ul className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <li key={item} className="flex items-center">
              <span className="mr-2">•</span>
              <Link href={`/schools/${item}`} className="hover:underline">
                A OKULU
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
