import Link from "next/link"

export default function LoginPage() {
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

      <main className="container flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h2 className="mb-6 text-center text-xl font-bold">GİRİŞ YAP</h2>

          <form className="space-y-4">
            <div>
              <input type="email" placeholder="E-posta" className="w-full rounded border border-black p-2" />
            </div>
            <div>
              <input type="password" placeholder="Şifre" className="w-full rounded border border-black p-2" />
            </div>
            <div>
              <select className="w-full rounded border border-black p-2">
                <option>Kullanıcı Türü</option>
                <option>Bağışçı</option>
                <option>Admin</option>
              </select>
            </div>
            <div>
              <button type="submit" className="w-full rounded bg-black py-2 text-white">
                GİRİŞ YAP
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
