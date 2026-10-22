# Su kaynakları: WMS ve WFS nerede, neden kullanılıyor?

Su kaynakları (`water_source` tablosu) haritaya **GeoServer** üzerinden iki OGC standardıyla gelir.
Yazma işlemi ise Spring Boot REST API'sinden geçer.

```
            ┌──────────── okuma ─────────────┐
 Leaflet ──►│ /geoserver/watergis/wms  (WMS) │──► GeoServer ──► PostGIS (water_source)
            │ /geoserver/watergis/wfs  (WFS) │        ▲
            └────────────────────────────────┘        │ SLD stili, bbox filtresi
 Leaflet ──► POST /api/water-sources (REST) ──► Spring Boot ──► PostGIS (ST_GeomFromGeoJSON)
```

## WMS (Web Map Service) — "Su kaynakları (WMS - görüntü)" katmanı

- **Ne yapar:** Sunucu, veriyi SLD stiline göre (baraj = mavi kare, pınar = turkuaz daire,
  kuyu = kahverengi üçgen, depo = yeşil yıldız) **PNG resmine çizer**. Tarayıcı yalnızca resim görür.
- **Nerede:** `frontend/src/components/Map/MapView.tsx` → `<WMSTileLayer url="/geoserver/watergis/wms" layers="watergis:water_source">`.
  Leaflet her karo için `GetMap` isteği atar (`srs=EPSG:3857`, `bbox=...`, `width=256`).
- **Neden burada:** Görselleştirme için. Kaynak sayısı 10 de olsa 100.000 de olsa tarayıcıya
  giden şey aynı boyutta resimlerdir; çizim yükü sunucudadır. Stil merkezi olarak
  `geoserver/water_source.sld` dosyasında yönetilir, her istemci aynı görünümü alır.
- **Sınırı:** Resimdeki noktaya tıklayınca hangi kaynak olduğunu bilemezsiniz (öznitelik yok).
  Bunun için WMS'in `GetFeatureInfo` isteği ya da WFS gerekir.
- **SRID notu:** Tablo EPSG:4326'da. Leaflet karoları EPSG:3857 (Web Mercator) ister;
  dönüşümü GeoServer kendisi yapar, önyüz koordinat hesabı yapmaz.

## WFS (Web Feature Service) — "Su kaynakları (WFS - vektör)" katmanı

- **Ne yapar:** Veriyi **vektör olarak (GeoJSON)** döndürür: geometri + tüm öznitelikler
  (`id`, `name`, `source_type`, `capacity_m3_per_day`).
- **Nerede:** `frontend/src/api/waterSources.ts` → `fetchWaterSourcesInBounds()` ve
  `frontend/src/components/Map/WaterSourceWfsLayer.tsx` (pembe halkalar).
- **Neden burada:** Etkileşim için. Her kaynak tıklanabilir, popup'ta adı/tipi/kapasitesi görünür.
  İleride filtreleme, seçme, analiz sonucunu vurgulama gibi işler vektör veri ister.
- **bbox filtresi (CLAUDE.md kural 5):** Harita her kaydırıldığında (`moveend`) yalnızca görünen
  alan istenir. GeoServer bunu PostGIS'e `geom && ST_MakeEnvelope(...)` olarak çevirir ve
  `idx_water_source_geom` GIST index'i kullanılır.
- **Eksen sırası tuzağı:** WFS 2.0'da `EPSG:4326` için bbox sırası **lat,lng**'dir.
  Belirsizliği önlemek için `urn:ogc:def:crs:EPSG::4326` yazılır. GeoJSON çıktısı ise her zaman **[lng, lat]**.
- **Sınırı:** Çok sayıda nesnede tarayıcı yavaşlar (her nokta bir DOM/SVG elemanı). Bu yüzden bbox şart.

## Yazma neden WFS-T değil de REST?

WFS'in yazma sürümü (WFS-T, `Transaction`) de vardır; ama iş kuralları (zorunlu alanlar,
tip kontrolü, ileride yetki/audit) Spring Boot'ta tutulmak istendiği için yeni kaynak
`POST /api/water-sources` ile eklenir. Backend GeoJSON geometrisini Java'da parse etmeden
`ST_SetSRID(ST_GeomFromGeoJSON(...), 4326)` ile PostGIS'e verir; Point olmayan geometriyi
`geometry(Point, 4326)` sütunu reddeder ve API 400 döner. Kayıttan sonra önyüz WFS'i yeniden
yükler ve WMS isteğine `_v` parametresi ekleyerek önbelleği atlatır.

## Özet tablo

| | WMS | WFS |
|---|---|---|
| Dönen veri | Resim (PNG) | Vektör (GeoJSON / GML) |
| Stil | Sunucuda (SLD) | İstemcide (Leaflet `pathOptions`) |
| Öznitelik | Yok (GetFeatureInfo ile ayrıca) | Var |
| Büyük veri | Çok iyi | bbox / sayfalama gerekir |
| Bu projede | Kaynakların görünümü | Tıklama + popup |

## Elle deneme

```bash
# WFS: görünen alandaki kaynaklar (GeoJSON)
curl "http://localhost:8081/geoserver/watergis/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=watergis:water_source&outputFormat=application/json&srsName=EPSG:4326&bbox=39.85,32.6,40.0,33.1,urn:ogc:def:crs:EPSG::4326"

# WMS: Ankara için tek resim
curl -o kaynaklar.png "http://localhost:8081/geoserver/watergis/wms?service=WMS&version=1.1.1&request=GetMap&layers=watergis:water_source&styles=&format=image/png&transparent=true&srs=EPSG:3857&bbox=3630000,4840000,3700000,4880000&width=768&height=440"
```

GeoServer yönetim arayüzü: http://localhost:8081/geoserver (kullanıcı/şifre `.env` içindeki `GEOSERVER_ADMIN_*`).
