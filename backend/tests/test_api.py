from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_graph_summary():
    edges = [{"source": "a", "target": "b"}, {"source": "b", "target": "c"}]
    response = client.post("/api/graph/summary", json={"edges": edges})
    assert response.status_code == 200
    body = response.json()
    assert body["node_count"] == 3
    assert body["edge_count"] == 2
    assert body["degree_centrality"]["b"] == 1.0
