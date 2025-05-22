//README.md

# (Opsiyonel) Veritabanını sıfırla
dropdb -U goktugtutar yucweb
createdb -U goktugtutar yucweb

# .env dosyasını kontrol et → DATABASE_URL

# Prisma şemayı veritabanına yolla
npx prisma db push

# Dummy verileri ekle
node prisma/seed.js

# GUI arayüzle veritabanına göz at
npx prisma studio

# (Opsiyonel) Terminalden psql ile bağlan
psql -U goktugtutar -h localhost -p 5432 yucweb


----eksikler----

1-donation yapildiginda donationlar veritabanina kayit edilmiyor ama kullanicin hesabinda gozukuyor toplam ne kadar para yardim ettigi artiyor mesela

2-kullanıcıdaki toplam yapılan bağış (para) her seferinde toplanıp o kısımda gözükücek ve yapılan eşya bağışları tek tek yazdırılıcak hangi okula ne ve ne kadar ve ne zamanda yapıldığı

3-profil duzenle kismi sikinti

4- okul kendi profiline giremiyor (navbardan profil fotosunu girince profil fotosunu goremesi gerekiyor) bagiscidaki gibi tokenden alinicak okulun hangi idye sahip oldugu bunun yaninda herkes kendi profilini duzenleyebilicek

5-eşya bağışı yaparken kullanıcı ilk olarak bağışlamak istediği eşyanın adını yazıcak daha sonra o ekranda o anki o kelime ile alaklı eşyalar çıkıcak(mesela s yazdı kullanıcı aşağıda okullar çıkıyor ama bu s nin devamı yok belki sıra belki silgi) ! daha sonra hangi okul odluğunu seçicek

6-adminde bağışları gör tablosu ikiye ayrılıcak biri eşya biri para bağışını 

7- fidan sayısı kullancının toplam bağışı bölü 1000 olucak ayrı bir yerde bunu tutmak istersek user tablosuna bir sutun ekleyebiliriz

----değiştirilciekler----

1-!!! olan fonkisyonlar tablo değiştiği için yeni tablolar ile update edilicek queryler

2- okul gitmek isterken okul bulunamadı hatası veriyor daha sonra okula gidiyor (okul kısmına komple bi el atılması gerek)