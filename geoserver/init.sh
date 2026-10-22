#!/bin/sh
# GeoServer'ı REST API ile yapılandırır: workspace -> PostGIS datastore -> water_source ve pipe katmanları + SLD stilleri.
# Tekrar çalıştırılabilir: var olan kayıtlar atlanır.
set -eu

GS="${GEOSERVER_URL:-http://geoserver:8080/geoserver}"
AUTH="${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD}"
WS=watergis
STORE=postgis

echo "GeoServer bekleniyor: $GS"
# 401: .env'deki şifre GeoServer'ınkiyle uyuşmuyor (kartoza şifreyi yalnızca ilk kurulumda, volume boşken alır).
i=0
while :; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -u "$AUTH" "$GS/rest/about/version.json" || true)
  [ "$code" = 200 ] && break
  if [ "$code" = 401 ]; then
    echo "HATA: GeoServer kullanıcı/şifre reddedildi (401). GEOSERVER_ADMIN_* .env değerlerini kontrol edin." >&2
    exit 1
  fi
  i=$((i + 1))
  if [ "$i" -ge 100 ]; then
    echo "HATA: GeoServer 5 dakikada yanıt vermedi (son HTTP kodu: $code)." >&2
    exit 1
  fi
  sleep 3
done

# .json uzantısı: Accept başlığı olmadan bazı REST uçları (styles) 500 döndürüyor.
exists() { curl -fs -o /dev/null -u "$AUTH" "$1.json"; }
post() { curl -fsS -o /dev/null -u "$AUTH" -X POST -H "Content-Type: $2" --data-binary "$3" "$1"; }

if ! exists "$GS/rest/workspaces/$WS"; then
  post "$GS/rest/workspaces" application/json "{\"workspace\":{\"name\":\"$WS\"}}"
  echo "workspace oluşturuldu: $WS"
fi

if ! exists "$GS/rest/workspaces/$WS/datastores/$STORE"; then
  post "$GS/rest/workspaces/$WS/datastores" application/json "{
    \"dataStore\": {
      \"name\": \"$STORE\",
      \"connectionParameters\": { \"entry\": [
        {\"@key\":\"dbtype\",\"\$\":\"postgis\"},
        {\"@key\":\"host\",\"\$\":\"${POSTGRES_HOST:-db}\"},
        {\"@key\":\"port\",\"\$\":\"5432\"},
        {\"@key\":\"database\",\"\$\":\"${POSTGRES_DB}\"},
        {\"@key\":\"schema\",\"\$\":\"public\"},
        {\"@key\":\"user\",\"\$\":\"${POSTGRES_USER}\"},
        {\"@key\":\"passwd\",\"\$\":\"${POSTGRES_PASSWORD}\"},
        {\"@key\":\"Expose primary keys\",\"\$\":\"true\"}
      ]}
    }}"
  echo "datastore oluşturuldu: $STORE"
fi

# publish_layer <tablo> <başlık>: /init/<tablo>.sld stilini yükler ve tabloyu katman olarak yayınlar.
publish_layer() {
  LAYER=$1
  # Stil her çalıştırmada güncellenir; böylece .sld değişiklikleri mevcut kurulumlara da yansır.
  if exists "$GS/rest/styles/$LAYER"; then
    curl -fsS -o /dev/null -u "$AUTH" -X PUT -H "Content-Type: application/vnd.ogc.sld+xml" \
      --data-binary "@/init/$LAYER.sld" "$GS/rest/styles/$LAYER"
    echo "stil güncellendi: $LAYER"
  else
    post "$GS/rest/styles?name=$LAYER" application/vnd.ogc.sld+xml "@/init/$LAYER.sld"
    echo "stil yüklendi: $LAYER"
  fi

  if ! exists "$GS/rest/workspaces/$WS/datastores/$STORE/featuretypes/$LAYER"; then
    # Tablo EPSG:4326'da; GeoServer WMS isteğinde EPSG:3857'ye kendisi dönüştürür.
    post "$GS/rest/workspaces/$WS/datastores/$STORE/featuretypes" application/json "{
      \"featureType\": {\"name\":\"$LAYER\",\"nativeName\":\"$LAYER\",\"title\":\"$2\",
                        \"srs\":\"EPSG:4326\",\"projectionPolicy\":\"FORCE_DECLARED\"}}"
    curl -fsS -o /dev/null -u "$AUTH" -X PUT -H "Content-Type: application/json" \
      --data "{\"layer\":{\"defaultStyle\":{\"name\":\"$LAYER\"}}}" "$GS/rest/layers/$WS:$LAYER"
    echo "katman yayınlandı: $WS:$LAYER"
  fi
}

publish_layer water_source "Su kaynakları"
publish_layer pipe "Boru hatları"

echo "GeoServer hazır: WMS=$GS/$WS/wms  WFS=$GS/$WS/wfs"
