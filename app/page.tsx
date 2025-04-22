'use client';

import Link from 'next/link';

export default function MainPage() {
  const news = [
    {
      id: 1,
      title: 'Haber 1',
      description: 'Bu birinci haberin açıklamasıdır.',
      image: '/photo2.jpg',
    },
    {
      id: 2,
      title: 'Haber 2',
      description: 'Bu ikinci haberin açıklamasıdır.',
      image: '/photo2.jpg',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-200 to-gray-200">
      <main className="w-full">
{/* Hero Section */}
<section className="relative h-[750px] overflow-hidden">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-70"
    style={{ backgroundImage: "url('/photo1.jpg')" }}
  ></div>

  {/* Hero Content */}
  <div className="relative text-center text-white flex flex-col items-center justify-center h-full px-4">
    
    {/* Toplam Bağış – yukarıda */}
    <p className="text-lg font-light mb-4 mt-[-40px]">
      Toplam Bağış: <span className="font-bold text-2xl">₺50,000</span>
    </p>

    {/* Başlık + Açıklama Kutusu */}
      <h1 className="text-4xl md:text-5xl font-light mb-4">
        <span className="font-medium">YUC</span> ile Değişime Katkıda Bulun
      </h1>
      <p className="text-white/90 md:text-2xl">
        Eğitimde fırsat eşitliği için el ele vererek geleceğe umut olalım
      </p>

    {/* Buton – kutunun altında */}
    <Link
      href="/donate"
      className="mt-16 px-10 py-4 rounded-full bg-gray-900 text-white font-medium text-lg transition-all hover:shadow-xl hover:bg-gray-800 hover:scale-105"
    >
      BAĞIŞ YAP
    </Link>
  </div>
</section>



        {/* İnce Border: Hero'dan sonra */}
        <section className="border-t border-gray-300" />

        {/* News Section */}
        <section className="bg-white py-12 px-6">
          {news.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto py-8 ${
                index !== news.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              {/* Text */}
              <div className="md:w-1/2 text-center md:text-left">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>

              {/* Image */}
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
        </section>
        
      </main>
    </div>
  );
}
