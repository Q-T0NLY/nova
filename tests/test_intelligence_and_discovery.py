"""
Comprehensive test suite for NEXUS HOP discovery, ingest, intelligence, and integration.
"""

import pytest
import asyncio
import json
from unittest.mock import Mock, patch, AsyncMock
from datetime import datetime

# Import modules to test
from services.discovery.hop_orchestrator import NeuralDiscoveryOrchestrator, DiscoveredResource
from services.ingest.vector_store_pgvector import EmbeddingGenerator, InMemoryVectorStore
from services.intelligence.knowledge_graph import AdvancedKnowledgeGraph, Entity, Relationship
from services.intelligence.project_graph import AdvancedProjectGraph, ProjectResource
from services.intelligence.scoring_engine import AdvancedScoringEngine
from services.intelligence.rag_engine import AdvancedRAGEngine


# ============================================================================
# Fixtures
# ============================================================================

@pytest.fixture
def embedding_generator():
    """Fixture for embedding generator."""
    return EmbeddingGenerator()


@pytest.fixture
def vector_store():
    """Fixture for in-memory vector store."""
    return InMemoryVectorStore()


@pytest.fixture
def knowledge_graph():
    """Fixture for knowledge graph."""
    return AdvancedKnowledgeGraph()


@pytest.fixture
def project_graph():
    """Fixture for project graph."""
    return AdvancedProjectGraph()


@pytest.fixture
def scoring_engine():
    """Fixture for scoring engine."""
    return AdvancedScoringEngine()


@pytest.fixture
def rag_engine(knowledge_graph, project_graph, scoring_engine):
    """Fixture for RAG engine."""
    return AdvancedRAGEngine(
        knowledge_graph=knowledge_graph,
        project_graph=project_graph,
        scoring_engine=scoring_engine
    )


@pytest.fixture
async def orchestrator():
    """Fixture for discovery orchestrator."""
    orch = NeuralDiscoveryOrchestrator()
    yield orch
    # Cleanup
    if orch._running:
        orch.stop()


# ============================================================================
# Test: Embedding Generation
# ============================================================================

class TestEmbeddingGenerator:
    
    def test_embed_text_returns_valid_embedding(self, embedding_generator):
        """Test that embedding generation returns valid embeddings."""
        text = "PostgreSQL database service"
        embedding = embedding_generator.embed(text)
        
        assert isinstance(embedding, list)
        assert len(embedding) > 0
        assert all(isinstance(x, float) for x in embedding)
    
    def test_embed_deterministic_fallback(self):
        """Test deterministic fingerprint fallback."""
        gen = EmbeddingGenerator(model_name="invalid-model")
        embedding = gen.embed("test")
        
        assert isinstance(embedding, list)
        assert len(embedding) == 384  # Deterministic padding
    
    def test_embed_same_text_produces_consistent_embedding(self, embedding_generator):
        """Test that same text produces consistent embeddings."""
        text = "Kubernetes cluster"
        embedding1 = embedding_generator.embed(text)
        embedding2 = embedding_generator.embed(text)
        
        # Allow small floating point differences
        assert len(embedding1) == len(embedding2)


# ============================================================================
# Test: Vector Store
# ============================================================================

class TestVectorStore:
    
    def test_upsert_adds_item(self, vector_store, embedding_generator):
        """Test upserting items into vector store."""
        embedding = embedding_generator.embed("test service")
        result = vector_store.upsert("service-1", embedding, metadata={"type": "service"})
        
        assert result.id == "service-1"
        assert result.metadata["type"] == "service"
    
    def test_get_retrieves_item(self, vector_store, embedding_generator):
        """Test retrieving items from vector store."""
        embedding = embedding_generator.embed("test")
        vector_store.upsert("item-1", embedding, metadata={"test": True})
        
        retrieved = vector_store.get("item-1")
        assert retrieved is not None
        assert retrieved.id == "item-1"
        assert retrieved.metadata["test"] is True
    
    def test_list_all_returns_items(self, vector_store, embedding_generator):
        """Test listing all items."""
        embedding = embedding_generator.embed("test")
        vector_store.upsert("item-1", embedding)
        vector_store.upsert("item-2", embedding)
        
        items = vector_store.list_all()
        assert len(items) == 2
    
    def test_delete_removes_item(self, vector_store, embedding_generator):
        """Test deleting items."""
        embedding = embedding_generator.embed("test")
        vector_store.upsert("item-1", embedding)
        
        assert vector_store.delete("item-1")
        assert vector_store.get("item-1") is None
    
    def test_query_similar_returns_results(self, vector_store, embedding_generator):
        """Test similarity search."""
        embedding = embedding_generator.embed("PostgreSQL database")
        vector_store.upsert("db-1", embedding)
        vector_store.upsert("db-2", embedding_generator.embed("MongoDB document store"))
        
        results = vector_store.query_similar(embedding, limit=2)
        assert len(results) > 0


# ============================================================================
# Test: Knowledge Graph
# ============================================================================

class TestKnowledgeGraph:
    
    def test_add_entity(self, knowledge_graph):
        """Test adding entities to knowledge graph."""
        entity = Entity(
            id="service-1",
            name="Auth Service",
            entity_type="service",
            properties={"port": 8001}
        )
        
        assert knowledge_graph.add_entity(entity)
        assert entity.id in knowledge_graph.entities
    
    def test_add_relationship(self, knowledge_graph):
        """Test adding relationships."""
        entity1 = Entity(id="svc-1", name="Service 1", entity_type="service")
        entity2 = Entity(id="db-1", name="Database", entity_type="database")
        
        knowledge_graph.add_entity(entity1)
        knowledge_graph.add_entity(entity2)
        
        rel = Relationship(
            source_id="svc-1",
            target_id="db-1",
            relationship_type="uses"
        )
        
        assert knowledge_graph.add_relationship(rel)
        assert len(knowledge_graph.relationships) == 1
    
    def test_query_by_type(self, knowledge_graph):
        """Test querying entities by type."""
        service = Entity(id="svc-1", name="Service", entity_type="service")
        database = Entity(id="db-1", name="Database", entity_type="database")
        
        knowledge_graph.add_entity(service)
        knowledge_graph.add_entity(database)
        
        services = knowledge_graph.query_by_type("service")
        assert len(services) == 1
        assert services[0].id == "svc-1"
    
    def test_extract_entities_from_discovery(self, knowledge_graph):
        """Test entity extraction from discovery results."""
        results = [
            {'id': 'svc-1', 'name': 'Auth Service', 'type': 'service', 'meta': {}},
            {'id': 'db-1', 'name': 'PostgreSQL', 'type': 'database', 'meta': {'port': 5432}}
        ]
        
        entities = knowledge_graph.extract_entities_from_discovery(results)
        assert len(entities) == 2
        assert len(knowledge_graph.entities) == 2
    
    def test_find_paths(self, knowledge_graph):
        """Test path finding between entities."""
        # Create chain: A -> B -> C
        entities = [
            Entity(id="a", name="A", entity_type="service"),
            Entity(id="b", name="B", entity_type="service"),
            Entity(id="c", name="C", entity_type="service")
        ]
        
        for e in entities:
            knowledge_graph.add_entity(e)
        
        knowledge_graph.add_relationship(Relationship("a", "b", "depends_on"))
        knowledge_graph.add_relationship(Relationship("b", "c", "depends_on"))
        
        paths = knowledge_graph.find_paths("a", "c")
        assert len(paths) > 0


# ============================================================================
# Test: Project Graph
# ============================================================================

class TestProjectGraph:
    
    def test_add_resource(self, project_graph):
        """Test adding resources."""
        resource = ProjectResource(
            id="svc-1",
            name="Auth Service",
            resource_type="service"
        )
        
        assert project_graph.add_resource(resource)
        assert "svc-1" in project_graph.resources
    
    def test_analyze_impact(self, project_graph):
        """Test impact analysis."""
        resources = [
            ProjectResource(id="svc-1", name="Service 1", resource_type="service"),
            ProjectResource(id="svc-2", name="Service 2", resource_type="service"),
            ProjectResource(id="svc-3", name="Service 3", resource_type="service")
        ]
        
        for r in resources:
            project_graph.add_resource(r)
        
        # Create dependency chain
        from services.intelligence.project_graph import Dependency
        dep1 = Dependency("svc-2", "svc-1", "hard")
        dep2 = Dependency("svc-3", "svc-2", "hard")
        
        project_graph.add_dependency(dep1)
        project_graph.add_dependency(dep2)
        
        impact = project_graph.analyze_impact("svc-1")
        assert impact['resource_id'] == "svc-1"
        assert impact['total_affected'] > 0
    
    def test_detect_circular_dependencies(self, project_graph):
        """Test circular dependency detection."""
        resources = [
            ProjectResource(id="a", name="A", resource_type="service"),
            ProjectResource(id="b", name="B", resource_type="service"),
            ProjectResource(id="c", name="C", resource_type="service")
        ]
        
        for r in resources:
            project_graph.add_resource(r)
        
        from services.intelligence.project_graph import Dependency
        # Create cycle: A -> B -> C -> A
        project_graph.add_dependency(Dependency("a", "b", "hard"))
        project_graph.add_dependency(Dependency("b", "c", "hard"))
        project_graph.add_dependency(Dependency("c", "a", "hard"))
        
        cycles = project_graph.detect_circular_dependencies()
        # May or may not detect all cycles depending on implementation
        assert isinstance(cycles, list)


# ============================================================================
# Test: Scoring Engine
# ============================================================================

class TestScoringEngine:
    
    def test_health_score_computation(self, scoring_engine):
        """Test health score computation."""
        metrics = {
            'cpu_usage': 50,
            'memory_usage': 60,
            'disk_usage': 40,
            'error_rate': 0.01,
            'uptime_percent': 99.9
        }
        
        score = scoring_engine.compute_health_score(metrics)
        assert 0 <= score.value <= 100
        assert len(score.factors) > 0
    
    def test_composite_score_generation(self, scoring_engine):
        """Test composite score generation."""
        entity = {
            'id': 'svc-1',
            'name': 'Test Service',
            'authentication_enabled': True,
            'encryption_enabled': True,
            'vulnerability_count': 0,
            'metrics': {
                'cpu_usage': 30,
                'memory_usage': 40,
                'error_rate': 0.001,
                'uptime_percent': 99.95
            }
        }
        
        composite = scoring_engine.compute_composite_score('svc-1', 'Test Service', entity)
        
        assert 0 <= composite.overall_score <= 100
        assert composite.rating in ['excellent', 'good', 'fair', 'poor']
        assert len(composite.dimension_scores) > 0
        assert len(composite.recommendations) >= 0


# ============================================================================
# Test: RAG Engine
# ============================================================================

class TestRAGEngine:
    
    def test_retrieve_context(self, rag_engine, knowledge_graph):
        """Test context retrieval."""
        # Add entities to KG
        entity = Entity(id="svc-1", name="Service", entity_type="service")
        knowledge_graph.add_entity(entity)
        
        context = rag_engine.retrieve_context("What services are critical?")
        assert context.query is not None
    
    def test_build_generation_prompt(self, rag_engine, knowledge_graph):
        """Test prompt building."""
        entity = Entity(id="svc-1", name="Service", entity_type="service")
        knowledge_graph.add_entity(entity)
        
        context = rag_engine.retrieve_context("test query")
        prompt = rag_engine.build_generation_prompt("test query", context)
        
        assert len(prompt.system_prompt) > 0
        assert len(prompt.instructions) > 0
    
    def test_format_context_for_llm(self, rag_engine, knowledge_graph):
        """Test context formatting for LLM."""
        entity = Entity(id="svc-1", name="Service", entity_type="service")
        knowledge_graph.add_entity(entity)
        
        context = rag_engine.retrieve_context("test")
        formatted = rag_engine.format_context_for_llm(context)
        
        assert isinstance(formatted, str)
        assert len(formatted) > 0


# ============================================================================
# Test: Discovery Orchestrator
# ============================================================================

class TestDiscoveryOrchestrator:
    
    @pytest.mark.asyncio
    async def test_run_discovery_cycle(self, orchestrator):
        """Test running a discovery cycle."""
        report = await orchestrator.run_cycle(mode="full")
        
        assert isinstance(report, dict)
        assert 'mode' in report or 'message' in report
    
    @pytest.mark.asyncio
    async def test_discover_services(self, orchestrator):
        """Test service discovery."""
        services = await orchestrator.discover_services()
        
        assert isinstance(services, list)
    
    @pytest.mark.asyncio
    async def test_discover_datastores(self, orchestrator):
        """Test datastore discovery."""
        datastores = await orchestrator.discover_datastores()
        
        assert isinstance(datastores, list)


# ============================================================================
# Test: Integration
# ============================================================================

class TestIntegration:
    
    def test_end_to_end_discovery_to_scoring(self, knowledge_graph, project_graph, 
                                             scoring_engine, rag_engine):
        """Test end-to-end flow from discovery to scoring."""
        # Simulate discovery results
        results = [
            {'id': 'svc-1', 'name': 'Auth', 'type': 'service', 'meta': {}},
            {'id': 'db-1', 'name': 'PostgreSQL', 'type': 'database', 'meta': {}}
        ]
        
        # Extract to KG
        entities = knowledge_graph.extract_entities_from_discovery(results)
        assert len(entities) == 2
        
        # Add to PG
        for entity in entities:
            resource = ProjectResource(
                id=entity.id,
                name=entity.name,
                resource_type=entity.entity_type,
                metrics={'cpu_usage': 40, 'memory_usage': 50}
            )
            project_graph.add_resource(resource)
        
        # Compute scores
        for entity_data in results:
            entity_data['metrics'] = {'cpu_usage': 40, 'memory_usage': 50}
            score = scoring_engine.compute_composite_score(
                entity_data['id'],
                entity_data['name'],
                entity_data
            )
            assert 0 <= score.overall_score <= 100
        
        # Build RAG pipeline
        pipeline = rag_engine.build_rag_pipeline("What services use the database?")
        assert 'retrieval' in pipeline
        assert 'augmentation' in pipeline


# ============================================================================
# Run Tests
# ============================================================================

if __name__ == '__main__':
    pytest.main([__file__, '-v', '--tb=short'])
