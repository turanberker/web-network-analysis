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

Önyüzdeki Nginx, `/api` isteklerini `backend` servisine yönlendirir. İlk Liquibase migration'ı PostGIS extension'ını oluşturur.

## Yerel geliştirme

Veritabanını Docker ile ayağa kaldırın:

```bash
docker compose up -d db
```

Backend (Java 21 ve Maven gerekir):

```bash
cd backend
export DB_URL=jdbc:postgresql://localhost:5432/watergis DB_USERNAME=watergis DB_PASSWORD=degistir-beni
mvn spring-boot:run
mvn test   # TestContainers ile gerçek PostGIS üzerinde çalışır, Docker gerekir
```

Önyüz:

```bash
cd frontend
npm install
npm run dev   # http://localhost:5173, /api -> http://localhost:8080
```
