"use client";

import Link from "next/link"
import { useState } from "react";


export default function LoginPage() {

  
  const [showModal, setShowModal] = useState(false);

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
                <button type="button" className="underline text-sm text-blue-800 hover:text-blue-950" onClick={() => setShowModal(true)}>
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
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">E-posta Adresinizi Girin</h3>
            <input
              type="email"
              placeholder="E-posta"
              className="w-full rounded-lg border border-gray-300 p-2 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                İptal
              </button>
              <button className="px-4 py-2 bg-blue-950 text-white rounded-lg">
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
