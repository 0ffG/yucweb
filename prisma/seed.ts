import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seed işlemi başlatıldı...");

  // USERS (admin, donor, school)
  await prisma.user.createMany({
    data: [
      {
        name: "Gizem",
        lastName: "Yılmaz",
        location: "Ankara",
        photo: "https://randomuser.me/api/portraits/women/1.jpg",
        email: "admin1@example.com",
        password: "admin",
        role: "admin"
      },
      {
        name: "Kerem",
        lastName: "Demir",
        location: "İstanbul",
        photo: "https://randomuser.me/api/portraits/men/2.jpg",
        email: "admin2@example.com",
        password: "admin",
        role: "admin"
      },

      {
        name: "Ayşe",
        lastName: "Kaya",
        location: "İzmir",
        photo: "https://randomuser.me/api/portraits/women/3.jpg",
        email: "donor1@example.com",
        password: "donor",
        role: "donor"
      },
      {
        name: "Burak",
        lastName: "Koç",
        location: "Adana",
        photo: "https://randomuser.me/api/portraits/men/4.jpg",
        email: "donor2@example.com",
        password: "donor",
        role: "donor"
      },
      {
        name: "Cemre",
        lastName: "Aydın",
        location: "Eskişehir",
        photo: "https://randomuser.me/api/portraits/women/5.jpg",
        email: "donor3@example.com",
        password: "donor",
        role: "donor"
      },
      {
        name: "Deniz",
        lastName: "Şahin",
        location: "Antalya",
        photo: "https://randomuser.me/api/portraits/men/6.jpg",
        email: "donor4@example.com",
        password: "donor",
        role: "donor"
      },

      {
        name: "Mehmet",
        lastName: "Okur",
        location: "Mardin",
        photo: "https://randomuser.me/api/portraits/men/7.jpg",
        email: "school1@example.com",
        password: "school",
        role: "school"
      },
      {
        name: "Elif",
        lastName: "Balcı",
        location: "Trabzon",
        photo: "https://randomuser.me/api/portraits/women/8.jpg",
        email: "school2@example.com",
        password: "school",
        role: "school"
      },
      {
        name: "Ali",
        lastName: "Yüce",
        location: "Erzurum",
        photo: "https://randomuser.me/api/portraits/men/9.jpg",
        email: "school3@example.com",
        password: "school",
        role: "school"
      },
      {
        name: "Zeynep",
        lastName: "Çelik",
        location: "Van",
        photo: "https://randomuser.me/api/portraits/women/10.jpg",
        email: "school4@example.com",
        password: "school",
        role: "school"
      }
    ]
  });

  const donors = await prisma.user.findMany({ where: { role: 'donor' } });
  const schools = await prisma.user.findMany({ where: { role: 'school' } });

  // MONEY DONATIONS
  for (let i = 0; i < 10; i++) {
    await prisma.moneyDonation.create({
      data: {
        amount: Math.floor(Math.random() * 9000 + 1000),
        donorId: donors[i % donors.length].id,
      }
    });
  }

  const moneyDonations = await prisma.moneyDonation.findMany();

  // MONEY DISTRIBUTIONS
  for (let i = 0; i < 10; i++) {
    await prisma.moneyDistribution.create({
      data: {
        amount: Math.floor(Math.random() * 5000 + 500),
        moneyDonationId: moneyDonations[i % moneyDonations.length].id,
        schoolId: schools[i % schools.length].id,
      }
    });
  }

  // MATERIAL DONATIONS
  const materialItems = ["Sırt Çantası", "Defter Seti", "Kalem Kutusu", "Mont", "Ayakkabı", "Süt Paketi", "Tablet", "Kitap Seti", "Oyuncak", "Hijyen Kiti"];
  for (let i = 0; i < 10; i++) {
    await prisma.materialDonation.create({
      data: {
        item: materialItems[i],
        amount: Math.floor(Math.random() * 50 + 1),
        donorId: donors[i % donors.length].id,
        schoolId: schools[i % schools.length].id,
      }
    });
  }

  // INVENTORIES
  const inventoryItems = ["Masa", "Sandalye", "Yazıcı", "Projeksiyon", "Bilgisayar", "Tahta", "Kütüphane Ünitesi", "Kırtasiye Seti", "Su Sebili", "Temizlik Malzemesi"];
  for (let i = 0; i < 10; i++) {
    await prisma.inventory.create({
      data: {
        item: inventoryItems[i],
        amount: Math.floor(Math.random() * 100 + 1),
        schoolId: schools[i % schools.length].id,
      }
    });
  }

  // NEWS
  for (let i = 0; i < 10; i++) {
    await prisma.news.create({
      data: {
        title: `Bağış Başarısı: ${i + 1}. Yardım Kampanyası`,
        image: `https://picsum.photos/seed/news${i}/300/200`,
      }
    });
  }

  console.log("✅ Seed işlemi başarıyla tamamlandı.");
}

main()
  .catch((e) => {
    console.error("❌ Seed sırasında hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
