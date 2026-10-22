# Web Network Analysis

Ağ (graf) verilerini analiz edip web arayüzünde göstermek için iskelet proje.

## Teknoloji yığını

| Katman   | Teknoloji                                   |
|----------|---------------------------------------------|
| Backend  | Python 3.12, FastAPI, NetworkX, Uvicorn     |
| Frontend | React 18, TypeScript, Vite (prod: Nginx)    |
| Altyapı  | Docker, Docker Compose                      |

## Dizin yapısı

```
backend/    FastAPI uygulaması (app/), testler (tests/), Dockerfile
frontend/   React + Vite uygulaması (src/), Nginx ayarı, Dockerfile
docker-compose.yml
```

## Docker ile çalıştırma

```bash
cp .env.example .env   # isteğe bağlı
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:8000/api/health
- API dokümanı (Swagger): http://localhost:8000/docs

Frontend içindeki Nginx, `/api` isteklerini `backend` servisine yönlendirir.

## Yerel geliştirme

Backend:

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
pytest
```

Frontend:

```bash
cd frontend
npm install
npm run dev   # http://localhost:5173, /api -> http://localhost:8000
```

## Örnek uç noktalar

- `GET /api/health` — servis durumu
- `POST /api/graph/summary` — kenar listesi alır; düğüm/kenar sayısı, yoğunluk ve derece merkeziliği döner

```bash
curl -X POST http://localhost:8000/api/graph/summary \
  -H "Content-Type: application/json" \
  -d '{"edges":[{"source":"a","target":"b"},{"source":"b","target":"c"}]}'
```
