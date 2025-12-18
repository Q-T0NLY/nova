# 🌍 Universal Hyper Registry - Quick Start Guide

## Overview

The **Universal Hyper Registry** is a unified system that combines:

- **Universal Registry (Python)** - Core registry for ZSH + Python integration with 63 classifications
- **Orchestrator Sub-Registry (Python)** - Specialized artifact management for 6 domain types
- **HYPER_REGISTRY (TypeScript)** - Enterprise-grade artifact management with CLI/TUI/gRPC

This README provides a quick start guide for the unified system.

---

## 🚀 Quick Start

### 1. Initialize the System

```bash
cd /home/runner/work/nova/nova/universal-registry

# Basic initialization
python3 initialize_unified_registry.py

# With TypeScript HYPER_REGISTRY bridge
python3 initialize_unified_registry.py \
  --hyper-registry-path=/path/to/HYPER_REGISTRY

# With data export
python3 initialize_unified_registry.py \
  --hyper-registry-path=/path/to/HYPER_REGISTRY \
  --export=registry_data.json
```

### 2. Use in Your Code

```python
import asyncio
from orchestrator_subregistry import (
    initialize_orchestrator_system,
    SubRegistryType,
    SubRegistryEntry,
    SubRegistryMetadata
)
from universal_registry import UniversalRegistry, RegistryClassification

async def main():
    # Initialize orchestrator
    orchestrator = await initialize_orchestrator_system(
        hyper_registry_path="/path/to/HYPER_REGISTRY"
    )
    
    # Create universal registry
    registry = UniversalRegistry()
    registry.orchestrator_subregistry = orchestrator
    
    # Register to Universal Registry
    entry_id = await registry.register_entry(
        classification=RegistryClassification.SERVICES,
        name="my-service",
        data={"endpoint": "http://localhost:8080"},
        metadata={"version": "1.0.0"}
    )
    print(f"Registered to Universal Registry: {entry_id}")
    
    # Register to Sub-Registry
    plugin_id = await registry.register_to_subregistry(
        subregistry_type="plugin",
        entry_data={
            "name": "my-plugin",
            "version": "1.0.0",
            "data": {"runtime": "wasm"},
            "tags": ["production"]
        }
    )
    print(f"Registered to Plugin Sub-Registry: {plugin_id}")
    
    # Get system status
    status = await registry.get_orchestrator_status()
    print(f"System status: {status}")

asyncio.run(main())
```

---

## 📚 Documentation

- **[UNIFIED_REGISTRY_ARCHITECTURE.md](../UNIFIED_REGISTRY_ARCHITECTURE.md)** - Complete architecture documentation
- **[universal-registry/README.md](./README.md)** - Universal Registry documentation
- **[HYPER_REGISTRY/README.md](../HYPER_REGISTRY/README.md)** - TypeScript HYPER_REGISTRY documentation

---

## 🎯 Key Features

### Universal Registry (Python)
- **63 Classification Types** - Covers all system aspects
- **ZSH Integration** - Bidirectional ZSH ↔ Python sync
- **Health Monitoring** - Real-time health status
- **Dependency Mapping** - Track relationships
- **Lifecycle Management** - Event tracking

### Orchestrator Sub-Registry (Python Bridge)
- **6 Specialized Registries**:
  - 🔌 **Plugin** - WASM/JavaScript/Python/Native plugins
  - 🌐 **Service** - Mesh-aware microservices
  - 🧠 **ML Model** - Version-controlled ML models
  - 📁 **Data** - Lineage-tracked datasets
  - ⚙️ **Infrastructure** - IaC templates
  - 🛡️ **Security** - SBOM/Vulnerability tracking

### TypeScript HYPER_REGISTRY
- **Multiple Interfaces** - CLI, TUI, gRPC
- **Enterprise Features** - RBAC, audit logging, signatures
- **Full-Text Search** - Meilisearch integration
- **Production Ready** - SQLite persistence, health checks

---

## 🔧 Configuration

The unified system auto-detects the HYPER_REGISTRY location. To customize:

```python
# Explicitly set HYPER_REGISTRY path
orchestrator = await initialize_orchestrator_system(
    hyper_registry_path="/custom/path/to/HYPER_REGISTRY"
)
```

---

## 📊 System Status

Check the health and status of the unified system:

```python
# Get orchestrator status
status = await orchestrator.get_system_status()

# Output:
# {
#     'initialized': True,
#     'typescript_bridge_enabled': True,
#     'registries': {
#         'plugin': {'initialized': True, 'entry_count': 5, 'healthy': True},
#         'service': {'initialized': True, 'entry_count': 3, 'healthy': True},
#         ...
#     },
#     'total_entries': 15
# }
```

---

## 💾 Export Data

Export registry data to JSON:

```python
# Export Universal Registry
await registry.export_to_json("universal_registry.json")

# Export Orchestrator Sub-Registry
await orchestrator.export_to_json("orchestrator_subregistry.json")
```

---

## 🧪 Examples

### Example 1: Register a WASM Plugin

```python
from orchestrator_subregistry import SubRegistryEntry, SubRegistryMetadata, SubRegistryType

plugin = SubRegistryEntry(
    id="plugin-1",
    name="wasm-image-processor",
    metadata=SubRegistryMetadata(
        type=SubRegistryType.PLUGIN,
        version="2.0.0",
        tags=["wasm", "image", "production"]
    ),
    data={
        "runtime": "wasm",
        "permissions": ["fs:read", "fs:write"],
        "sandbox": "strict",
        "entrypoint": "process_image"
    },
    description="High-performance image processor"
)

plugin_id = await orchestrator.register(plugin)
```

### Example 2: Register a Microservice

```python
service = SubRegistryEntry(
    id="svc-api",
    name="api-gateway",
    metadata=SubRegistryMetadata(
        type=SubRegistryType.SERVICE,
        version="3.0.0"
    ),
    data={
        "endpoints": [{
            "protocol": "http",
            "host": "api.example.com",
            "port": 443,
            "healthCheck": "/health"
        }],
        "mesh": {
            "enabled": True,
            "sidecar": "istio",
            "mtls": True
        },
        "sla": {
            "availability": 99.99,
            "latencyP95": 100,
            "latencyP99": 200
        }
    }
)

service_id = await orchestrator.register(service)
```

### Example 3: Query Across All Registries

```python
from orchestrator_subregistry import SubRegistryQuery

# Query all active entries
query = SubRegistryQuery(
    filters={"status": "active"},
    limit=50
)

result = await orchestrator.query(query)

print(f"Found {result.total} active entries:")
for entry in result.entries:
    print(f"  - {entry.name} ({entry.metadata.type.value})")
```

### Example 4: Register ML Model with Metrics

```python
ml_model = SubRegistryEntry(
    id="model-bert",
    name="bert-sentiment-analyzer",
    metadata=SubRegistryMetadata(
        type=SubRegistryType.ML_MODEL,
        version="1.5.0"
    ),
    data={
        "framework": "pytorch",
        "modelType": "classification",
        "inputSchema": {"text": "string"},
        "outputSchema": {"sentiment": "string", "confidence": "float"},
        "metrics": {
            "accuracy": 0.94,
            "precision": 0.92,
            "recall": 0.91,
            "f1": 0.915
        },
        "lineage": {
            "parentModel": "model-bert-base",
            "trainedOn": "sentiment-dataset-v2"
        }
    }
)

model_id = await orchestrator.register(ml_model)
```

---

## 🔍 Troubleshooting

### Import Errors

If you encounter import errors, ensure you're running from the correct directory:

```bash
cd /home/runner/work/nova/nova
python3 -c "import sys; sys.path.insert(0, 'universal-registry'); from orchestrator_subregistry import *"
```

### TypeScript Bridge Not Found

If the TypeScript bridge is not detected:

```python
# Manually specify the path
orchestrator = await initialize_orchestrator_system(
    hyper_registry_path="/absolute/path/to/HYPER_REGISTRY"
)
```

### Check System Health

```python
# Verify all sub-registries are healthy
status = await orchestrator.get_system_status()
for reg_type, reg_status in status['registries'].items():
    if not reg_status['healthy']:
        print(f"⚠️ {reg_type} registry is unhealthy")
```

---

## 📈 Next Steps

1. **Explore Examples** - Review the examples in `UNIFIED_REGISTRY_ARCHITECTURE.md`
2. **Read Full Documentation** - See detailed architecture and API reference
3. **Integrate with TypeScript** - Use the CLI/TUI/gRPC interfaces from HYPER_REGISTRY
4. **Deploy to Production** - Follow deployment guides for production setup

---

## 🤝 Support

For questions or issues:

1. Review the full documentation in `UNIFIED_REGISTRY_ARCHITECTURE.md`
2. Check the Universal Registry docs: `universal-registry/README.md`
3. Check the HYPER_REGISTRY docs: `HYPER_REGISTRY/README.md`

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: 2024-12-18

---

## Summary

The Universal Hyper Registry provides a unified, production-ready system for managing all types of artifacts, from ZSH configurations to ML models. With seamless integration between Python and TypeScript, it offers flexibility, type safety, and enterprise-grade features.

**Key Benefits**:
- ✅ Unified interface for all artifact types
- ✅ Specialized sub-registries for domain-specific needs
- ✅ Bridge between Python and TypeScript ecosystems
- ✅ Production-ready with health monitoring and export
- ✅ Extensible architecture for future enhancements
