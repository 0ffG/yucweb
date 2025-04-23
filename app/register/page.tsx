import Link from "next/link"
import NavigationBar from "@/components/navigationbar";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="container flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h2 className="mb-10 text-center text-4xl text-blue-950 font-bold font-sans">KAYDOL</h2>

          <form className="space-y-8">
          <div className="flex flex-col items-center space-y-10">
            <div className="flex flex-col items-center">
              <label htmlFor="profile-photo" className="cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-sm text-center text-gray-500">
                  Fotoğraf Yükle
                </div>
              </label>
              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className = " w-3/4 space-y-2">
              <div>
                <input type="text" placeholder="Ad" className="w-full rounded-xl border border-black p-2" />
              </div>
              <div>
                <input type="text" placeholder="Soyad" className="w-full rounded-xl border border-black p-2" />
              </div>
            </div>
            <div className = " w-3/4 space-y-2">
              <div>
                <input type="email" placeholder="E-posta" className="w-full rounded-xl border border-black p-2" />
              </div>
              <div>
                <input type="password" placeholder="Şifre" className="w-full rounded-xl border border-black p-2" />
              </div>
              <div>
                <input type="password" placeholder="Şifre Tekrar" className="w-full rounded-xl border border-black p-2" />
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
                  KAYDOL
                </button>
              </div>
              <div className="flex flex-col items-center">
                <Link href="/login">
                  <span className="underline text-sm text-blue-800 hover:text-blue-950">
                    Hesabın var mı? Giriş yap.
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
