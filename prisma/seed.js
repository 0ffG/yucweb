import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seed işlemi başlatıldı...");

  // USERS (admin, donor, school)
  await prisma.user.createMany({
    data: [
      { name: "Admin1", email: "admin1@example.com", password: "admin", role: "admin" },
      { name: "Admin2", email: "admin2@example.com", password: "admin", role: "admin" },

      { name: "Donor1", email: "donor1@example.com", password: "donor", role: "donor" },
      { name: "Donor2", email: "donor2@example.com", password: "donor", role: "donor" },
      { name: "Donor3", email: "donor3@example.com", password: "donor", role: "donor" },
      { name: "Donor4", email: "donor4@example.com", password: "donor", role: "donor" },

      { name: "School1", email: "school1@example.com", password: "school", role: "school" },
      { name: "School2", email: "school2@example.com", password: "school", role: "school" },
      { name: "School3", email: "school3@example.com", password: "school", role: "school" },
      { name: "School4", email: "school4@example.com", password: "school", role: "school" }
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
  for (let i = 0; i < 10; i++) {
    await prisma.materialDonation.create({
      data: {
        item: `Malzeme ${i + 1}`,
        amount: Math.floor(Math.random() * 50 + 1),
        donorId: donors[i % donors.length].id,
        schoolId: schools[i % schools.length].id,
      }
    });
  }

  // INVENTORIES
  for (let i = 0; i < 10; i++) {
    await prisma.inventory.create({
      data: {
        item: `Envanter Ürünü ${i + 1}`,
        amount: Math.floor(Math.random() * 100 + 1),
        schoolId: schools[i % schools.length].id,
      }
    });
  }

  // NEWS
  for (let i = 0; i < 10; i++) {
    await prisma.news.create({
      data: {
        title: `Haber Başlığı ${i + 1}`,
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
