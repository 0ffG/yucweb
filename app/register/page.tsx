import Link from "next/link"
import NavigationBar from "@/components/navigationbar";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="container flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h2 className="mb-6 text-center text-xl font-bold">KAYIT OL</h2>

          <form className="space-y-4">
            <div>
              <input type="text" placeholder="Ad" className="w-full rounded border border-black p-2" />
            </div>
            <div>
              <input type="text" placeholder="Soyad" className="w-full rounded border border-black p-2" />
            </div>
            <div>
              <input type="email" placeholder="E-posta" className="w-full rounded border border-black p-2" />
            </div>
            <div>
              <input type="password" placeholder="Şifre" className="w-full rounded border border-black p-2" />
            </div>
            <div>
              <input type="password" placeholder="Şifre Tekrar" className="w-full rounded border border-black p-2" />
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
                KAYIT OL
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
