# CLAUDE.md — Su Hattı Vana Analizi

## 1. Proje Vizyonu

Su dağıtım şebekesindeki boru hatları ve vanaları coğrafi konumlarıyla birlikte yönetmek, sorgulamak ve görselleştirmek için GIS tabanlı bir web uygulaması.

Kullanıcılar:
- Şebeke bileşenlerini (boru, vana, pompa, depo) harita üzerinde görür.
- Coğrafi sorgularla etki alanı analizi yapar (örn. bir vana kapandığında hangi bölge susuz kalır?).
- Yeni bileşen ekler, düzenler ve siler.
- Hat uzunluğu, kesişim, tampon bölge gibi geometrik analizler çalıştırır.

Bu proje bir **GIS öğrenme projesıdır**. PostGIS, Leaflet ve Spring Boot'un entegrasyonunu anlamak önceliktir; üretim ölçeği sonraya bırakılır.

## 2. Teknoloji Mimarisi

| Katman | Teknoloji | Amaç |
| --- | --- | --- |
| Önyüz | React + TypeScript + Vite | Kullanıcı arayüzü |
| Harita | Leaflet.js + React-Leaflet | GIS görselleştirme |
| Backend | Java Spring Boot | REST API katmanı |
| Veritabanı | PostgreSQL + PostGIS | Coğrafi veri depolama |
| ORM | Spring Data JPA + Hibernate Spatial | Geometri sorgulamak |

**Özel notlar:**
- PostGIS geometry sütunları JTS (JTS Topology Suite) veya Hibernate Spatial ile çalıştırılır.
- Backend GeoJSON döndürür; Leaflet doğrudan tüketir.
- Docker Compose ile PostgreSQL + PostGIS extension'ı birlikte ayağa kaldırılır.

## 3. Veri Modeli ve PostGIS Kavramları

### Temel tablolar

| Tablo | Geometri tipi | Açıklama |
| --- | --- | --- |
| `pipe` | `LINESTRING` | Boru hattı segmenti |
| `valve` | `POINT` | Vana konumu |
| `pump_station` | `POINT` | Pompa istasyonu |
| `district` | `POLYGON` | Baskı bölgesi / idari sınır |

### Öğrenilecek PostGIS fonksiyonları

- `ST_Distance` — iki geometri arası mesafe
- `ST_Buffer` — tampon bölge oluşturma
- `ST_Intersects` / `ST_Within` — kesişim ve içeride mi sorgusu
- `ST_Length` — boru uzunluğu
- `ST_AsGeoJSON` — geometriyi GeoJSON'a dönüştürme
- `ST_DWithin` — belirli mesafe içindeki bileşenleri bulma
- `ST_Union` — geometrileri birleştirme

### SRID
Varsayılan projeksiyon `EPSG:4326` (WGS 84, lat/lng). Metre tabanlı hesaplamalar için `EPSG:3857` veya Türkiye için `EPSG:5254` kullanılır.

## 4. API Sözleşmesi

Tüm endpoint'ler GeoJSON döndürür veya alır.

| Yöntem | Yol | Açıklama |
| --- | --- | --- |
| GET | `/api/pipes` | Tüm boru hatları (FeatureCollection) |
| GET | `/api/pipes/{id}` | Tek boru |
| POST | `/api/pipes` | Yeni boru ekle |
| PUT | `/api/pipes/{id}` | Boru güncelle |
| DELETE | `/api/pipes/{id}` | Boru sil |
| GET | `/api/valves` | Tüm vanalar |
| POST | `/api/valves` | Yeni vana ekle |
| GET | `/api/analysis/buffer?id={id}&radius={m}` | Vana etrafında tampon bölge |
| GET | `/api/analysis/affected?valveId={id}` | Vana kapanınca etkilenen borular |
| GET | `/api/analysis/nearest?lat={}&lng={}&type={}` | En yakın bileşen |

**GeoJSON formatı:**
```json
{
  "type": "Feature",
  "geometry": { "type": "LineString", "coordinates": [[...]] },
  "properties": { "id": 1, "material": "PVC", "diameter_mm": 100 }
}
```

## 5. Klasör Yapısı

```
water-gis/
├── backend/                  # Spring Boot
│   ├── src/main/java/
│   │   └── com/watergis/
│   │       ├── controller/   # REST endpoint'leri
│   │       ├── service/      # İş mantığı
│   │       ├── repository/   # Spring Data JPA
│   │       ├── model/        # Entity sınıfları
│   │       └── dto/          # GeoJSON DTO'ları
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/  # Liquibase SQL dosyaları
│   └── pom.xml
├── frontend/                 # React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map/          # Leaflet harita bileşeni
│   │   │   ├── Sidebar/      # Bileşen listesi ve filtreler
│   │   │   └── AnalysisPanel/
│   │   ├── api/           # Axios istek fonksiyonları
│   │   └── types/         # TypeScript arayüzleri
│   └── package.json
└── docker-compose.yml       # PostgreSQL + PostGIS
```

## 6. Temel Mimari Kurallar

1. Geometri işlemleri PostGIS'te yapılır; Java'ya ham koordinat aktarılmaz.
2. Backend dışarıya her zaman GeoJSON döndürür (`ST_AsGeoJSON` veya Jackson Spatial).
3. Önyüz koordinat hesaplaması yapmaz; analizler API'den istenir.
4. SRID dönüşümleri veritabanı katmanında gerçekleşir (`ST_Transform`).
5. Geniş sorgular (tüm boru hattı) pagination veya bbox filtresiyle sınırlandırılır.
6. Migration'lar Liquibase ile yönetilir; PostGIS extension oluşturma ilk migration'da yapılır.
7. `application.yml` içine kullanıcı adı / şifre yazılmaz; `.env` veya Docker secret kullanılır.
8. Frontend katmanında geometri doğrulaması yapılmaz; Leaflet'in çizim araçları backend'e gönderilir.
9. Otomatik testlerde PostGIS fonksiyonları gerçek DB (TestContainers) ile test edilir, mock'lanmaz.

## 7. GIS Öğrenme Hedefleri

Bu proje aşağıdaki GIS kavramlarını uygulamalı öğretmek için tasarlanmıştır:

**PostGIS / Veritabanı:**
- Geometry ve Geography veri tipleri arasındaki fark
- Spatial index oluşturma (`GIST` index)
- `ST_*` fonksiyonlarıyla coğrafi sorgular
- SRID / projeksiyon kavramı ve dönüşümler
- Topoloji analizi (hangi borular birbirine bağlı?)

**Backend:**
- Hibernate Spatial ile ORM'de geometri alanı tanımlama
- GeoJSON seri / deserülizasyonu
- Spatial sorgu yazımı (`@Query` + WKT / native SQL)

**Önyüz:**
- Leaflet ile WMS / GeoJSON katmanı gösterme
- Marker, Polyline ve Polygon ile şablon harita oluşturma
- Draw plugin ile kullanıcının geometri çizmesi ve backend'e göndermesi
- Bbox (sınır kutusu) filtresiyle performanslı veri yükleme

## 8. Claude ile Çalışma Kuralları

Her görevde:

1. İlgili `CLAUDE.md` dosyalarını oku.
2. Mevcut kodu ve klasör yapısını incele.
3. Var olmayan sınıf, endpoint veya tablo varmış gibi varsayma.
4. Değişiklikleri küçük ve anlaşılır tut.
5. GIS fonksiyon sorgularını çalıştırdıktan sonra sonuç veri örneği göster.
6. Gerekli testleri ve build komutlarını çalıştır.
7. Çalıştırmadığın testleri başarılı olarak bildirme.
8. Kapsam dışı özellik ekleme.
9. Projeksiyonlar, SRID dönüşümleri veya topoloji analizleri gibi GIS kararlarını açıkla.
10. Yeni branch adı kısa ve anlaşılır olsun (orn. `feat/valve-buffer-api`, `fix/geojson-srid`).

## 9. Görev Sonu Raporu

Her görev sonunda şu başlıkları kullan:

- **Yapılanlar:** Kısa değişiklik özeti.
- **Dosyalar:** Eklenen ve değiştirilen dosyalar.
- **Veritabanı Değişiklikleri:** Eklenen tablo, sütun veya PostGIS fonksiyon kullanımı.
- **Doğrulama:** Çalıştırılan test ve build sonuçları.
- **Sonraki adım:** Önerilen tek sonraki iş.
