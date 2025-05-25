const { PrismaClient } = require('@prisma/client');
const { fakerTR: faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Mevcut veriler siliniyor...');

  // Silme sırası önemli: ilişkili tablolarda bağımlılıklar vardır
  await prisma.moneyDistribution.deleteMany();
  await prisma.moneyDonation.deleteMany();
  await prisma.materialDonation.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.news.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧪 Yeni veriler ekleniyor...');

  const donors = [];
  const schools = [];

  console.log('➡️ Kullanıcılar ekleniyor...');

  // Adminler
  for (let i = 0; i < 5; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: `admin${i}@example.com`,
        password: 'password123',
        role: 'admin',
        location: faker.location.city(),
      }
    });
  }

  // Donörler
  for (let i = 0; i < 5; i++) {
    const donor = await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: `donor${i}@example.com`,
        password: 'password123',
        role: 'donor',
        location: faker.location.city(),
        totalMoneyDonated: faker.number.int({ min: 500, max: 5000 }),
      }
    });
    donors.push(donor);
  }

  // Okullar
  for (let i = 0; i < 5; i++) {
    const school = await prisma.user.create({
      data: {
        name: faker.company.name(),
        email: `school${i}@example.com`,
        password: 'password123',
        role: 'school',
        location: faker.location.city(),
      }
    });
    schools.push(school);
  }

  console.log('➡️ Para bağışları ve dağıtımları ekleniyor...');

  // Para bağışları ve dağıtımları
  for (let i = 0; i < 15; i++) {
    const donor = faker.helpers.arrayElement(donors);
    const donation = await prisma.moneyDonation.create({
      data: {
        amount: faker.number.int({ min: 100, max: 1000 }),
        donorId: donor.id,
      }
    });

    const school = faker.helpers.arrayElement(schools);

    await prisma.moneyDistribution.create({
      data: {
        amount: donation.amount,
        schoolId: school.id,
        moneyDonationId: donation.id,
      }
    });
  }

  console.log('➡️ Eşya bağışları ekleniyor...');

  // Eşya bağışları
  for (let i = 0; i < 15; i++) {
    const donor = faker.helpers.arrayElement(donors);
    const school = faker.helpers.arrayElement(schools);

    await prisma.materialDonation.create({
      data: {
        item: faker.commerce.product(),
        amount: faker.number.int({ min: 1, max: 50 }),
        donorId: donor.id,
        schoolId: school.id,
      }
    });
  }

  console.log('➡️ Okul envanterleri ekleniyor...');

  // Envanterler
  for (let i = 0; i < 15; i++) {
    const school = faker.helpers.arrayElement(schools);

    await prisma.inventory.create({
      data: {
        item: faker.commerce.product(),
        amount: faker.number.int({ min: 5, max: 100 }),
        schoolId: school.id,
      }
    });
  }

  console.log('➡️ Haberler ekleniyor...');

  // Haberler
  for (let i = 0; i < 15; i++) {
    await prisma.news.create({
      data: {
        title: faker.lorem.sentence(),
        image: Math.random() < 0.4 ? null : faker.image.url()
      }
    });
  }

  console.log('✅ Tüm seed verileri başarıyla eklendi!');
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
