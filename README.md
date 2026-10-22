# Su Hattı Vana Analizi

Su dağıtım şebekesindeki boru ve vanaları harita üzerinde yönetmek ve analiz etmek için GIS tabanlı web uygulaması. Proje kuralları ve hedefler için [CLAUDE.md](CLAUDE.md) dosyasına bakın.

## Teknoloji yığını

| Katman     | Teknoloji                                         |
|------------|---------------------------------------------------|
| Önyüz      | React 18, TypeScript, Vite, Leaflet, React-Leaflet |
| Backend    | Java 21, Spring Boot 3, Spring Data JPA, Hibernate Spatial |
| Veritabanı | PostgreSQL 16 + PostGIS 3.4, Liquibase migration'ları |
| Altyapı    | Docker, Docker Compose                            |

## Docker ile çalıştırma

```bash
cp .env.example .env   # şifreyi değiştirin
docker compose up --build
```

- Önyüz: http://localhost:3000
- Backend: http://localhost:8080/api/health
- PostGIS: `localhost:5432`
- GeoServer (WMS/WFS): http://localhost:8081/geoserver

Önyüzdeki Nginx, `/api` isteklerini `backend` servisine, `/geoserver` isteklerini GeoServer'a yönlendirir.
`geoserver-init` servisi ilk açılışta `watergis` workspace'ini, PostGIS datastore'unu ve `water_source`
katmanını REST API ile oluşturur. WMS ve WFS'in nerede ve neden kullanıldığı: [docs/wms-wfs.md](docs/wms-wfs.md). İlk Liquibase migration'ı PostGIS extension'ını oluşturur.

## Yerel geliştirme

Veritabanını Docker ile ayağa kaldırın:

```bash
docker compose up -d db geoserver
# backend çalıştıktan (tablo oluştuktan) sonra GeoServer katmanını yayınlayın:
docker compose run --rm --no-deps geoserver-init
```

Backend (Java 21 ve Maven gerekir):

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
mvn test   # TestContainers ile gerçek PostGIS üzerinde çalışır, Docker gerekir
```

`local` profili (`application-local.yml`) `localhost`'taki veritabanına bağlanır ve kimlik bilgilerini repo kökündeki `.env` dosyasından okur. IntelliJ IDEA'da `.run/Backend (local).run.xml` yapılandırması hazırdır: proje açıldığında çalıştırma listesinde **Backend (local)** olarak görünür.

Önyüz:

```bash
cd frontend
npm install
npm run dev   # http://localhost:5173, /api -> :9000, /geoserver -> :8081
```
