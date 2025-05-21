const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seed işlemi başlatıldı...");

  // USERS
  await prisma.user.createMany({
    data: [
      { name: "Admin1", lastName: "Yılmaz", email: "admin1@example.com", password: "admin", role: "admin" },
      { name: "Admin2", lastName: "Demir", email: "admin2@example.com", password: "admin", role: "admin" },

      { name: "Donor1", lastName: "Kaya", email: "donor1@example.com", password: "donor", role: "donor" },
      { name: "Donor2", lastName: "Koç", email: "donor2@example.com", password: "donor", role: "donor" },
      { name: "Donor3", lastName: "Aydın", email: "donor3@example.com", password: "donor", role: "donor" },
      { name: "Donor4", lastName: "Şimşek", email: "donor4@example.com", password: "donor", role: "donor" },

      { name: "School1", lastName: "İlkokulu", email: "school1@example.com", password: "school", role: "school" },
      { name: "School2", lastName: "Ortaokulu", email: "school2@example.com", password: "school", role: "school" },
      { name: "School3", lastName: "Lisesi", email: "school3@example.com", password: "school", role: "school" },
      { name: "School4", lastName: "Teknik", email: "school4@example.com", password: "school", role: "school" }
    ]
  });

  const donors = await prisma.user.findMany({ where: { role: "donor" } });
  const schools = await prisma.user.findMany({ where: { role: "school" } });

  // DONATIONS
  for (let i = 0; i < 10; i++) {
    await prisma.donation.create({
      data: {
        donorId: donors[i % donors.length].id,
        schoolId: schools[i % schools.length].id,
        amount: Math.floor(Math.random() * 9000 + 1000),
        donationType: i % 2 === 0 ? "money" : "goods",
        description: `Donation ${i + 1}`
      }
    });
  }

  // INVENTORIES
  for (let i = 0; i < 10; i++) {
    await prisma.inventory.create({
      data: {
        schoolId: schools[i % schools.length].id,
        item: `Item ${i + 1}`,
        count: Math.floor(Math.random() * 100 + 1)
      }
    });
  }

  // NEWS
  for (let i = 0; i < 10; i++) {
    await prisma.news.create({
      data: {
        title: `Haber Başlığı ${i + 1}`,
        image: `https://picsum.photos/seed/news${i}/300/200`
      }
    });
  }

  // MATERIAL DONATIONS
  for (let i = 0; i < 10; i++) {
    await prisma.materialDonation.create({
      data: {
        userId: donors[i % donors.length].id,
        schoolId: schools[i % schools.length].id
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
