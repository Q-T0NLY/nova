"""
Comprehensive tests for new intelligence engines:
- Neural Heartbeat & Health Engine
- Advanced Discovery & Search Engine
- Advanced AutoML System
"""

import pytest
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any

# Import engines
from services.intelligence.health_engine import (
    NeuralHeartbeatEngine, HealthStatus, HealthTrend, HealthMetric,
    MetricCategory, HealthScorer, TrendAnalyzer
)
from services.intelligence.advanced_discovery_engine import (
    AdvancedDiscoveryEngine, DiscoveredResource, SearchQuery, ResourceType,
    SearchStrategy, ExactMatchSearch, FuzzyMatchSearch, SemanticSearch
)
from services.intelligence.automl_orchestrator import (
    AutoMLOrchestrator, ProblemType, FeatureInfo, DatasetProfile,
    FeatureEngineer, NeuralArchitectureSearch, HyperparameterOptimizer
)


# ============================================================================
# HEALTH ENGINE TESTS
# ============================================================================

class TestHealthMetric:
    """Test HealthMetric class"""
    
    def test_metric_creation(self):
        """Test creating a health metric"""
        metric = HealthMetric(
            name="cpu_usage",
            category=MetricCategory.CPU,
            value=45.0,
            threshold_warning=75.0,
            threshold_critical=90.0,
            unit="%"
        )
        
        assert metric.name == "cpu_usage"
        assert metric.value == 45.0
        assert metric.get_status() == HealthStatus.HEALTHY
    
    def test_metric_degraded_status(self):
        """Test metric degraded status"""
        metric = HealthMetric(
            name="memory",
            category=MetricCategory.MEMORY,
            value=82.0,
            threshold_warning=75.0,
            threshold_critical=90.0
        )
        
        assert metric.get_status() == HealthStatus.DEGRADED
    
    def test_metric_critical_status(self):
        """Test metric critical status"""
        metric = HealthMetric(
            name="disk",
            category=MetricCategory.DISK,
            value=95.0,
            threshold_warning=75.0,
            threshold_critical=90.0
        )
        
        assert metric.get_status() == HealthStatus.CRITICAL
    
    def test_metric_to_dict(self):
        """Test metric serialization"""
        metric = HealthMetric(
            name="test",
            category=MetricCategory.SYSTEM,
            value=50.0,
            threshold_warning=75.0,
            threshold_critical=90.0
        )
        
        d = metric.to_dict()
        assert d["name"] == "test"
        assert d["value"] == 50.0


class TestHealthScorer:
    """Test HealthScorer class"""
    
    def test_availability_score_high_uptime(self):
        """Test availability scoring with high uptime"""
        scorer = HealthScorer()
        score = scorer.compute_availability_score(98.0)
        
        assert score.score >= 95
        assert score.status == HealthStatus.HEALTHY
    
    def test_availability_score_low_uptime(self):
        """Test availability scoring with low uptime"""
        scorer = HealthScorer()
        score = scorer.compute_availability_score(70.0)
        
        assert score.status == HealthStatus.CRITICAL
    
    def test_performance_score_good(self):
        """Test performance scoring with good metrics"""
        scorer = HealthScorer()
        score = scorer.compute_performance_score(latency_ms=50, throughput_rps=2000)
        
        assert score.score >= 80
        assert score.status == HealthStatus.HEALTHY
    
    def test_reliability_score_low_error_rate(self):
        """Test reliability scoring with low error rate"""
        scorer = HealthScorer()
        score = scorer.compute_reliability_score(error_rate=0.5, mtbf_hours=48)
        
        assert score.status == HealthStatus.HEALTHY
    
    def test_resource_usage_score_high_cpu(self):
        """Test resource usage scoring with high CPU"""
        scorer = HealthScorer()
        score = scorer.compute_resource_usage_score(cpu_percent=95, memory_percent=50, disk_percent=50)
        
        assert score.status == HealthStatus.DEGRADED
    
    def test_composite_score_calculation(self):
        """Test composite score calculation"""
        scorer = HealthScorer()
        
        dim_scores = [
            scorer.compute_availability_score(95),
            scorer.compute_performance_score(100, 1500),
            scorer.compute_reliability_score(1, 24),
            scorer.compute_resource_usage_score(40, 60, 70),
            scorer.compute_error_rate_score(1, 100)
        ]
        
        composite, status = scorer.compute_composite_score(dim_scores)
        
        assert 0 <= composite <= 100
        assert isinstance(status, HealthStatus)


class TestTrendAnalyzer:
    """Test TrendAnalyzer class"""
    
    def test_add_score(self):
        """Test adding scores to trend analyzer"""
        analyzer = TrendAnalyzer()
        analyzer.add_score("entity1", 80.0)
        analyzer.add_score("entity1", 85.0)
        analyzer.add_score("entity1", 90.0)
        
        assert len(analyzer.trends["entity1"]) == 3
    
    def test_calculate_improving_trend(self):
        """Test detecting improving trend"""
        analyzer = TrendAnalyzer()
        for i in range(10):
            analyzer.add_score("entity1", 50 + i * 3)  # Steadily increasing
        
        trend = analyzer.calculate_trend("entity1")
        assert trend in [HealthTrend.IMPROVING, HealthTrend.STABLE]
    
    def test_calculate_declining_trend(self):
        """Test detecting declining trend"""
        analyzer = TrendAnalyzer()
        for i in range(10):
            analyzer.add_score("entity1", 100 - i * 3)  # Steadily decreasing
        
        trend = analyzer.calculate_trend("entity1")
        assert trend in [HealthTrend.DECLINING, HealthTrend.STABLE]
    
    def test_predict_future_score(self):
        """Test predicting future score"""
        analyzer = TrendAnalyzer()
        for i in range(20):
            analyzer.add_score("entity1", 50 + i)
        
        prediction = analyzer.predict_future_score("entity1", horizon_minutes=60)
        
        assert "prediction" in prediction
        assert 0 <= prediction["confidence"] <= 100


class TestNeuralHeartbeatEngine:
    """Test main heartbeat engine"""
    
    @pytest.mark.asyncio
    async def test_engine_creation(self):
        """Test heartbeat engine creation"""
        engine = NeuralHeartbeatEngine()
        assert engine is not None
        assert isinstance(engine.scorer, HealthScorer)
        assert isinstance(engine.trend_analyzer, TrendAnalyzer)
    
    @pytest.mark.asyncio
    async def test_collect_metrics(self):
        """Test collecting metrics"""
        engine = NeuralHeartbeatEngine()
        
        metrics = {
            "cpu_percent": 45,
            "memory_percent": 60,
            "disk_percent": 70
        }
        
        await engine.collect_metrics("service1", "Test Service", metrics)
        
        assert "service1:cpu_percent" in engine.metrics
    
    @pytest.mark.asyncio
    async def test_compute_entity_health(self):
        """Test computing entity health"""
        engine = NeuralHeartbeatEngine()
        
        metrics = {
            "uptime_percent": 98.5,
            "latency_ms": 45,
            "throughput_rps": 2000,
            "error_rate": 0.2,
            "mtbf_hours": 48,
            "cpu_percent": 35,
            "memory_percent": 55,
            "disk_percent": 65,
            "error_count": 2,
            "total_count": 1000
        }
        
        score = engine.compute_entity_health("svc1", "Service 1", metrics)
        
        assert score.entity_id == "svc1"
        assert 0 <= score.overall_score <= 100
        assert isinstance(score.overall_status, HealthStatus)
        assert len(score.recommendations) > 0
    
    @pytest.mark.asyncio
    async def test_get_health_report(self):
        """Test getting health report"""
        engine = NeuralHeartbeatEngine()
        
        metrics1 = {
            "uptime_percent": 99,
            "latency_ms": 50,
            "throughput_rps": 1500,
            "error_rate": 0.1,
            "mtbf_hours": 72,
            "cpu_percent": 30,
            "memory_percent": 50,
            "disk_percent": 60,
            "error_count": 1,
            "total_count": 1000
        }
        
        engine.compute_entity_health("svc1", "Service 1", metrics1)
        
        report = engine.get_health_report()
        
        assert "timestamp" in report
        assert "entity_count" in report
        assert "entities" in report
        assert "summary" in report


# ============================================================================
# DISCOVERY ENGINE TESTS
# ============================================================================

@pytest.mark.asyncio
async def test_discovered_resource_creation():
    """Test creating a discovered resource"""
    resource = DiscoveredResource(
        id="svc001",
        name="User Service",
        resource_type=ResourceType.SERVICE,
        description="User management service",
        tags=["users", "auth"],
        endpoints=["http://localhost:8001/api/users"]
    )
    
    assert resource.id == "svc001"
    assert resource.resource_type == ResourceType.SERVICE


@pytest.mark.asyncio
async def test_exact_match_search():
    """Test exact match search"""
    search_algo = ExactMatchSearch()
    
    resources = [
        DiscoveredResource(id="1", name="User Service", resource_type=ResourceType.SERVICE),
        DiscoveredResource(id="2", name="Auth Service", resource_type=ResourceType.SERVICE),
        DiscoveredResource(id="3", name="Database", resource_type=ResourceType.DATABASE)
    ]
    
    query = SearchQuery(text="User Service")
    results, multiplier = await search_algo.search(query, resources)
    
    assert len(results) >= 1
    assert results[0].name == "User Service"


@pytest.mark.asyncio
async def test_fuzzy_match_search():
    """Test fuzzy matching"""
    search_algo = FuzzyMatchSearch()
    
    resources = [
        DiscoveredResource(id="1", name="PostgreSQL Database", resource_type=ResourceType.DATABASE),
        DiscoveredResource(id="2", name="Redis Cache", resource_type=ResourceType.CACHE),
        DiscoveredResource(id="3", name="MongoDB Datastore", resource_type=ResourceType.DATABASE)
    ]
    
    query = SearchQuery(text="postgres")
    results, multiplier = await search_algo.search(query, resources)
    
    assert len(results) > 0


@pytest.mark.asyncio
async def test_semantic_search():
    """Test semantic search"""
    search_algo = SemanticSearch()
    
    resources = [
        DiscoveredResource(id="1", name="PostgreSQL", resource_type=ResourceType.DATABASE),
        DiscoveredResource(id="2", name="User API", resource_type=ResourceType.API),
        DiscoveredResource(id="3", name="ML Model", resource_type=ResourceType.MODEL)
    ]
    
    query = SearchQuery(text="database")
    results, multiplier = await search_algo.search(query, resources)
    
    assert len(results) > 0


@pytest.mark.asyncio
async def test_advanced_discovery_engine():
    """Test main discovery engine"""
    engine = AdvancedDiscoveryEngine()
    
    resource1 = DiscoveredResource(
        id="svc1",
        name="User Service",
        resource_type=ResourceType.SERVICE,
        tags=["users", "auth"]
    )
    
    resource2 = DiscoveredResource(
        id="db1",
        name="User Database",
        resource_type=ResourceType.DATABASE,
        tags=["users", "postgres"]
    )
    
    await engine.register_resource(resource1)
    await engine.register_resource(resource2)
    
    assert len(engine.resources) == 2
    
    # Test service discovery
    services = await engine.discover_services()
    assert len(services) == 1
    assert services[0].name == "User Service"
    
    # Test tag-based discovery
    user_resources = await engine.discover_by_tag("users")
    assert len(user_resources) == 2


# ============================================================================
# AUTOML TESTS
# ============================================================================

class TestFeatureEngineer:
    """Test FeatureEngineer"""
    
    def test_extract_statistics(self):
        """Test statistical feature extraction"""
        features = [
            FeatureInfo(name="age", dtype="numeric", missing_percent=0),
            FeatureInfo(name="salary", dtype="numeric", missing_percent=5),
            FeatureInfo(name="category", dtype="categorical", missing_percent=2)
        ]
        
        extracted = FeatureEngineer.extract_statistics(features)
        
        assert "age_sqrt" in extracted
        assert "salary_log1p" in extracted
    
    def test_create_interactions(self):
        """Test feature interaction creation"""
        features = ["age", "salary", "experience"]
        
        interactions = FeatureEngineer.create_interactions(features, top_k=2)
        
        assert len(interactions) > 0
        assert any("x_" in interaction for interaction in interactions)
    
    def test_handle_missing_values(self):
        """Test missing value strategy selection"""
        features = [
            FeatureInfo(name="f1", dtype="numeric", missing_percent=5),
            FeatureInfo(name="f2", dtype="numeric", missing_percent=40),
            FeatureInfo(name="f3", dtype="numeric", missing_percent=60),
        ]
        
        strategies = FeatureEngineer.handle_missing_values(features)
        
        assert strategies["f1"] == "knn_impute"
        assert strategies["f2"] == "mean_or_mode"
        assert strategies["f3"] == "drop"


class TestNeuralArchitectureSearch:
    """Test NAS"""
    
    def test_generate_architecture_regression(self):
        """Test generating regression architecture"""
        arch = NeuralArchitectureSearch.generate_architecture(
            input_dim=20,
            output_dim=1,
            problem_type=ProblemType.REGRESSION
        )
        
        assert len(arch.layers) > 0
        assert len(arch.activation_functions) == len(arch.layers)
    
    def test_generate_architecture_classification(self):
        """Test generating classification architecture"""
        arch = NeuralArchitectureSearch.generate_architecture(
            input_dim=30,
            output_dim=5,
            problem_type=ProblemType.CLASSIFICATION
        )
        
        assert arch.activation_functions[-1] == "softmax"
    
    def test_mutate_architecture(self):
        """Test architecture mutation"""
        base_arch = NeuralArchitectureSearch.generate_architecture(
            input_dim=20,
            output_dim=1,
            problem_type=ProblemType.REGRESSION
        )
        
        mutated = NeuralArchitectureSearch.mutate_architecture(base_arch)
        
        assert mutated.layers == base_arch.layers
        assert mutated.dropout_rates != base_arch.dropout_rates


class TestHyperparameterOptimizer:
    """Test hyperparameter optimization"""
    
    def test_generate_search_space(self):
        """Test search space generation"""
        space = HyperparameterOptimizer.generate_search_space(ModelType.TREE)
        
        assert "max_depth" in space
        assert "min_samples_split" in space
        assert len(space["max_depth"]) > 0
    
    def test_estimate_training_time(self):
        """Test training time estimation"""
        from services.intelligence.automl_orchestrator import ModelType
        
        time1 = HyperparameterOptimizer.estimate_training_time(
            ModelType.LINEAR,
            dataset_size=1000,
            num_features=10
        )
        
        time2 = HyperparameterOptimizer.estimate_training_time(
            ModelType.NEURAL,
            dataset_size=100000,
            num_features=100
        )
        
        assert time1 > 0
        assert time2 > time1  # Larger dataset and neural should take longer


@pytest.mark.asyncio
async def test_automl_orchestrator():
    """Test main AutoML orchestrator"""
    orchestrator = AutoMLOrchestrator()
    
    features = [
        FeatureInfo(name="age", dtype="numeric", missing_percent=0),
        FeatureInfo(name="income", dtype="numeric", missing_percent=5),
        FeatureInfo(name="category", dtype="categorical", missing_percent=2)
    ]
    
    profile = await orchestrator.analyze_dataset(
        num_samples=10000,
        num_features=3,
        problem_type=ProblemType.REGRESSION,
        features=features,
        target_variable="salary"
    )
    
    assert profile.num_samples == 10000
    assert profile.num_features == 3
    
    # Test preprocessing
    preprocessing = await orchestrator.automated_preprocessing(profile)
    assert "missing_value_strategy" in preprocessing
    
    # Test feature engineering
    feature_eng = await orchestrator.automated_feature_engineering(profile)
    assert "statistical_features" in feature_eng
    
    # Test NAS
    architectures = await orchestrator.neural_architecture_search(profile, num_architectures=3)
    assert len(architectures) == 3


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
