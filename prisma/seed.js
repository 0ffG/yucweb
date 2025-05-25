const { PrismaClient } = require('@prisma/client');
const { fakerTR: faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

const schoolSupplies = [
  'Kurşun Kalem (1 Düzine)', 'Kırmızı Kurşun Kalem (1 Düzine)', 'Silgi (10 adet)', 'Kalemtıraş (5 adet)', 'Çizgili Defter (Büyük Boy, 5 adet)',
  'Kareli Defter (Büyük Boy, 5 adet)', 'Resim Defteri (Orta Boy, 3 adet)', 'Pastel Boya (12 Renk)', 'Kuru Boya Kalemleri (24 Renk)',
  'Sulu Boya (12 Renk)', 'Cetvel Seti (30cm cetvel, gönye, iletki)', 'Makas (Küt Uçlu, 5 adet)', 'Yapıştırıcı (Stick, 5 adet)',
  'Sırt Çantası', 'Beslenme Çantası', 'Suluk', 'A4 Kağıdı (1 Top)', 'Fon Kartonu (Karışık Renk, 50 adet)',
  'Elişi Kağıdı (Karışık Renk, 100 adet)', 'Oyun Hamuru Seti'
];

const schoolFurniture = [
  'Öğrenci Sırası (Çift Kişilik)', 'Öğrenci Sandalyesi', 'Öğretmen Masası', 'Öğretmen Sandalyesi', 'Yazı Tahtası (Beyaz)',
  'Yazı Tahtası Kalemi (Siyah, 4 adet)', 'Yazı Tahtası Silgisi', 'Kitaplık (5 Raflı)', 'Malzeme Dolabı (Kilitli)',
  'Askılık (Duvar Tipi)', 'Çöp Kovası (Sınıf Tipi)', 'Projeksiyon Cihazı', 'Projeksiyon Perdesi', 'Akıllı Tahta',
  'Bilgisayar Masası', 'Dizüstü Bilgisayar (Öğrenci Kullanımı İçin)', 'Tablet (Öğrenci Kullanımı İçin)'
];

const schoolNamePrefixes = ['Atatürk', 'Cumhuriyet', 'Fatih Sultan Mehmet', 'Mimar Sinan', 'Yavuz Selim', 'İnönü', 'Kazım Karabekir', 'Ziya Gökalp'];
const schoolNameCores = ['Bilgi', 'Gelecek', 'Umut', 'Başarı', 'Yıldız', 'Güneş', 'Çınar', 'Papatya', 'Kardelen'];
const schoolNameSuffixes = ['İlkokulu', 'Ortaokulu', 'Lisesi', 'Anadolu Lisesi', 'Fen Lisesi', 'Meslek Lisesi', 'İmam Hatip Lisesi', 'Koleji', 'Eğitim Kampüsü'];

async function main() {
  console.log('🧹 Mevcut veriler siliniyor...');
  await prisma.moneyDistribution.deleteMany();
  await prisma.moneyDonation.deleteMany();
  await prisma.materialDonation.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.news.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧪 Yeni veriler ekleniyor...');

  const donors = [];
  const schools = [];

  for (let i = 0; i < 3; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: `admin${i + 1}@example.com`,
        password: 'password123',
        role: 'admin',
        location: faker.location.city(),
        photo: faker.image.avatar(),
      }
    });
  }

  for (let i = 0; i < 10; i++) {
    const donor = await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: `donor${i + 1}@example.com`,
        password: 'password123',
        role: 'donor',
        location: faker.location.city(),
        totalMoneyDonated: faker.number.int({ min: 50, max: 10000 }),
        photo: faker.image.avatar(),
      }
    });
    donors.push(donor);
  }

  for (let i = 0; i < 7; i++) {
    const city = faker.location.city();
    const schoolName = `${city} ${faker.helpers.arrayElement(schoolNamePrefixes)} ${faker.helpers.arrayElement(schoolNameSuffixes)}`;
    const school = await prisma.user.create({
      data: {
        name: schoolName,
        email: `okul${i + 1}@example.com`,
        password: 'password123',
        role: 'school',
        location: `${faker.location.streetAddress(true)}, ${city}`,
        photo: faker.image.urlLoremFlickr({ category: 'school,building', width: 200, height: 200 }),
      }
    });
    schools.push(school);
  }

  for (let i = 0; i < 25; i++) {
    if (donors.length === 0 || schools.length === 0) continue;
    const donor = faker.helpers.arrayElement(donors);
    const donationAmount = faker.number.int({ min: 20, max: 2500 });
    const donation = await prisma.moneyDonation.create({
      data: {
        amount: donationAmount,
        donorId: donor.id,
        createdAt: faker.date.past({ years: 2 })
      }
    });

    const school = faker.helpers.arrayElement(schools);
    await prisma.moneyDistribution.create({
      data: {
        amount: donation.amount,
        schoolId: school.id,
        moneyDonationId: donation.id,
        createdAt: faker.date.between({ from: donation.createdAt, to: new Date() })
      }
    });
  }

  for (let i = 0; i < 30; i++) {
    if (donors.length === 0 || schools.length === 0) continue;
    const donor = faker.helpers.arrayElement(donors);
    const school = faker.helpers.arrayElement(schools);
    const donatedItem = faker.helpers.arrayElement(schoolSupplies);

    await prisma.materialDonation.create({
      data: {
        item: donatedItem,
        amount: faker.number.int({ min: 1, max: 20 }),
        donorId: donor.id,
        schoolId: school.id,
        createdAt: faker.date.past({ years: 1 })
      }
    });
  }

  for (const school of schools) {
    for (let i = 0; i < faker.number.int({ min:5, max:15 }); i++) {
      const inventoryItem = faker.helpers.arrayElement([...schoolSupplies, ...schoolFurniture]);
      await prisma.inventory.create({
        data: {
          item: inventoryItem,
          amount: faker.number.int({ min: 5, max: (inventoryItem.includes('Sırası') || inventoryItem.includes('Dolabı') ? 20 : 100) }),
          schoolId: school.id
        }
      });
    }
  }

  const newsCategories = ['Eğitim', 'Bağış Kampanyası', 'Okul Etkinliği', 'Gönüllülük', 'Teknoloji ve Eğitim'];
  for (let i = 0; i < 10; i++) {
    await prisma.news.create({
      data: {
        title: `${faker.helpers.arrayElement(newsCategories)}: ${faker.lorem.sentence(5)}`,
        image: Math.random() < 0.2 ? null : faker.image.urlLoremFlickr({ category: 'education,school,children,community', width: 800, height: 450 })
      }
    });
  }

  console.log('✅ Seed işlemi tamamlandı.');
}

main()
  .catch((e) => {
    console.error('❌ Hata oluştu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
