const { PrismaClient } = require('@prisma/client');
const { fakerTR: faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  const userIdsByRole = {
    admin: [],
    donor: [],
    school: []
  };

  let userIdCounter = 1;

  const roles = ['admin', 'donor', 'school'];

  for (const role of roles) {
    for (let i = 0; i < 5; i++) {
      const user = await prisma.user.create({
        data: {
          name: faker.person.firstName(),
          lastName: faker.person.lastName(),
          location: faker.location.city(),
          photo: null,
          email: `${role}${userIdCounter}@example.com`,
          password: 'password123',
          role: role,
          totalMoneyDonated: role === 'donor' ? faker.number.int({ min: 0, max: 10000 }) : 0
        }
      });
      userIdsByRole[role].push(user.id);
      userIdCounter++;
    }
  }

  // 15 material donation
  for (let i = 0; i < 15; i++) {
    await prisma.materialDonation.create({
      data: {
        item: faker.commerce.product(),
        amount: faker.number.int({ min: 1, max: 50 }),
        donorId: faker.helpers.arrayElement(userIdsByRole.donor),
        schoolId: faker.helpers.arrayElement(userIdsByRole.school),
      }
    });
  }

  const moneyDonationIds = [];

  // 15 money donation
  for (let i = 0; i < 15; i++) {
    const donation = await prisma.moneyDonation.create({
      data: {
        amount: faker.number.int({ min: 100, max: 1000 }),
        donorId: faker.helpers.arrayElement(userIdsByRole.donor),
      }
    });
    moneyDonationIds.push(donation.id);
  }

  // 15 money distribution
  for (let i = 0; i < 15; i++) {
    await prisma.moneyDistribution.create({
      data: {
        amount: faker.number.int({ min: 100, max: 500 }),
        schoolId: faker.helpers.arrayElement(userIdsByRole.school),
        moneyDonationId: faker.helpers.arrayElement(moneyDonationIds),
      }
    });
  }

  // 15 inventory
  for (let i = 0; i < 15; i++) {
    await prisma.inventory.create({
      data: {
        item: faker.commerce.product(),
        amount: faker.number.int({ min: 5, max: 100 }),
        schoolId: faker.helpers.arrayElement(userIdsByRole.school),
      }
    });
  }

  // 15 news
  for (let i = 0; i < 15; i++) {
    await prisma.news.create({
      data: {
        title: faker.lorem.sentence(),
        image: Math.random() < 0.3 ? null : faker.image.url()
      }
    });
  }

  console.log('✅ Seed işlemi tamamlandı.');
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
