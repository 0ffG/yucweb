// app/page.tsx
export const dynamic = "force-dynamic"; // Sayfa her istekte yeniden olusturulsun

import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function MainPage() {
  const news = await prisma.news.findMany();

  const total = await prisma.moneyDonation.aggregate({
    _sum: {
      amount: true,
    },
  });

  const totalAmount = total._sum.amount || 0;
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-200 to-gray-200">
      <main className="w-full">
        <section className="relative h-[850px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70"
            style={{ backgroundImage: "url('/photo1.jpg')" }}
          ></div>

          <div className="relative text-center text-white flex flex-col items-center justify-center h-full px-4">
            <div className="bg-white/90 text-gray-900 px-6 py-3 rounded-full shadow-lg mb-6 text-sm sm:text-base">
              🎉 Toplam Bağış:{" "}
              <span className="font-semibold text-lg sm:text-xl text-green-700">
                ₺{totalAmount.toLocaleString("tr-TR")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-light mb-4">
              <span className="font-medium">YUC</span> ile Değişime Katkıda Bulun
            </h1>
            <p className="text-white/90 md:text-2xl max-w-2xl">
              Eğitimde fırsat eşitliği için el ele vererek geleceğe umut olalım
            </p>
            <Link
              href="/donate"
              className="mt-12 px-10 py-4 rounded-full bg-gray-900 text-white font-medium text-lg transition-all hover:shadow-xl hover:bg-gray-800 hover:scale-105"
            >
              BAĞIŞ YAP
            </Link>
            <Link
              href="/schools"
              className="mt-4 px-8 py-3 rounded-full bg-blue-600 text-white font-semibold text-md transition-all hover:shadow-md hover:bg-blue-500 hover:scale-105"
            >
              Okul Profillerini Görüntüle
            </Link>
          </div>
        </section>

        <section className="border-t border-gray-300" />

        {/* Haberler */}
        <section className="bg-white py-16 px-6">
          <div className="max-w-5xl mx-auto space-y-12">
            {news.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-gray-200 last:border-none"
              >
                <div className="md:w-1/2 text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                </div>
                {item.image && (
                  <div className="md:w-1/2">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 object-cover rounded-xl shadow-md"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
