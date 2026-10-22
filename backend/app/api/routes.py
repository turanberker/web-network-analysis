import networkx as nx
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


class Edge(BaseModel):
    source: str
    target: str


class GraphRequest(BaseModel):
    edges: list[Edge]


class GraphSummary(BaseModel):
    node_count: int
    edge_count: int
    density: float
    degree_centrality: dict[str, float]


@router.post("/graph/summary", response_model=GraphSummary)
def graph_summary(payload: GraphRequest) -> GraphSummary:
    graph = nx.Graph()
    graph.add_edges_from((e.source, e.target) for e in payload.edges)
    return GraphSummary(
        node_count=graph.number_of_nodes(),
        edge_count=graph.number_of_edges(),
        density=nx.density(graph) if graph.number_of_nodes() > 1 else 0.0,
        degree_centrality=nx.degree_centrality(graph),
    )
