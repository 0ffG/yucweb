import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="container flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h2 className="mb-6 text-center text-4xl text-blue-950 font-bold font-sans">GİRİŞ YAP</h2>

          <form className="space-y-8">
            <div className="flex flex-col items-center">
              <div className = " w-3/4 space-y-1">
                <div>
                  <input type="email" placeholder="E-posta" className="w-full rounded-xl border border-black p-2" />
                </div>
                <div>
                  <input type="password" placeholder="Şifre" className="w-full rounded-xl border border-black p-2" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <select className="w-3/4 rounded-xl border border-black p-1">
                <option disabled selected>Kullanıcı Türü</option>
                <option>Bağışçı</option>
                <option>Okul</option>
                <option>Admin</option>
              </select>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex flex-col items-center">
                <button type="submit" className="w-1/2 rounded-2xl bg-blue-950  py-3 text-white font-bold hover:bg-green-800">
                  GİRİŞ YAP
                </button>
              </div>
              <div className="flex flex-col items-center">
                <button type="button" className="underline text-sm text-blue-800 hover:text-blue-950">
                  Şifremi unuttum
                </button>
              </div>
              <div className="flex flex-col items-center">
                <Link href="/register">
                  <span className="underline text-sm text-blue-800 hover:text-blue-950">
                    Hesabın yok mu? Kaydol.
                  </span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
