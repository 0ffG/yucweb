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


3-profil duzenle kismi sikinti 


5-eşya bağışı yaparken kullanıcı ilk olarak bağışlamak istediği eşyanın adını yazıcak daha sonra o ekranda o anki o kelime ile alaklı eşyalar çıkıcak(mesela s yazdı kullanıcı aşağıda okullar çıkıyor ama bu s nin devamı yok belki sıra belki silgi) ! daha sonra hangi okul odluğunu seçicek

6-adminde bağışları gör tablosu ikiye ayrılıcak biri eşya biri para bağışını birde distribution tablosu eklenicek (paranın hangi okula gönderildiğini vs göstericek bu paralarıda admin göndericek)

7- fidan sayısı kullancının toplam bağışı bölü 5 olucak ayrı bir yerde bunu tutmak istersek user tablosuna bir sutun ekleyebiliriz