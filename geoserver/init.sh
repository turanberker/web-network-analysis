#!/bin/sh
# GeoServer'ı REST API ile yapılandırır: workspace -> PostGIS datastore -> water_source katmanı + SLD stili.
# Tekrar çalıştırılabilir: var olan kayıtlar atlanır.
set -eu

GS="${GEOSERVER_URL:-http://geoserver:8080/geoserver}"
AUTH="${GEOSERVER_ADMIN_USER}:${GEOSERVER_ADMIN_PASSWORD}"
WS=watergis
STORE=postgis
LAYER=water_source

echo "GeoServer bekleniyor: $GS"
until curl -fs -u "$AUTH" "$GS/rest/about/version.json" >/dev/null; do sleep 3; done

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

if ! exists "$GS/rest/styles/$LAYER"; then
  post "$GS/rest/styles?name=$LAYER" application/vnd.ogc.sld+xml "@/init/water_source.sld"
  echo "stil yüklendi: $LAYER"
fi

if ! exists "$GS/rest/workspaces/$WS/datastores/$STORE/featuretypes/$LAYER"; then
  # Tablo EPSG:4326'da; GeoServer WMS isteğinde EPSG:3857'ye kendisi dönüştürür.
  post "$GS/rest/workspaces/$WS/datastores/$STORE/featuretypes" application/json "{
    \"featureType\": {\"name\":\"$LAYER\",\"nativeName\":\"$LAYER\",\"title\":\"Su kaynakları\",
                      \"srs\":\"EPSG:4326\",\"projectionPolicy\":\"FORCE_DECLARED\"}}"
  curl -fsS -o /dev/null -u "$AUTH" -X PUT -H "Content-Type: application/json" \
    --data "{\"layer\":{\"defaultStyle\":{\"name\":\"$LAYER\"}}}" "$GS/rest/layers/$WS:$LAYER"
  echo "katman yayınlandı: $WS:$LAYER"
fi

echo "GeoServer hazır: WMS=$GS/$WS/wms  WFS=$GS/$WS/wfs"
