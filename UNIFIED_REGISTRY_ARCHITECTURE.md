# 🌍 Universal Hyper Registry - Unified Architecture

## Overview

The **Universal Hyper Registry** is a unified system that integrates:

1. **Universal Registry (Python)** - Core registry for ZSH + Python integration
2. **Orchestrator Sub-Registry (Python)** - Specialized artifact management system
3. **HYPER_REGISTRY (TypeScript)** - Enterprise-grade artifact management with CLI/TUI/gRPC

This document describes the unified architecture and how these components work together.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    UNIVERSAL HYPER REGISTRY                              │
│                      (Unified System Layer)                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
    ┌───────────────────────────┐   ┌───────────────────────────────┐
    │   UNIVERSAL REGISTRY      │   │  ORCHESTRATOR SUB-REGISTRY    │
    │   (Python Core)           │◄─►│  (Python Bridge Layer)        │
    │                           │   │                               │
    │ • 63 Classifications      │   │ • Plugin Registry             │
    │ • ZSH Integration         │   │ • Service Registry            │
    │ • Python Microservices    │   │ • ML Model Registry           │
    │ • Health Monitoring       │   │ • Data Registry               │
    │ • Lifecycle Management    │   │ • Infrastructure Registry     │
    │ • Dependency Mapping      │   │ • Security Registry           │
    └───────────────────────────┘   └───────────────┬───────────────┘
                    │                               │
                    │               ┌───────────────┘
                    │               │
                    ▼               ▼
    ┌────────────────────────────────────────────────────────────┐
    │           HYPER_REGISTRY (TypeScript)                      │
    │           Enterprise Artifact Management                   │
    │                                                            │
    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
    │  │    CLI      │  │     TUI     │  │    gRPC     │      │
    │  │  Interface  │  │  Interface  │  │     API     │      │
    │  └─────────────┘  └─────────────┘  └─────────────┘      │
    │                                                            │
    │  Sub-Registries (TypeScript Implementation):              │
    │  • PluginRegistry.ts    • ServiceRegistry.ts             │
    │  • MLModelRegistry.ts   • DataRegistry.ts                │
    │  • InfraRegistry.ts     • SecurityRegistry.ts            │
    └────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Universal Registry (Python Core)

**Location**: `/universal-registry/universal_registry.py`

**Purpose**: 
- Core registry system for ZSH configuration and Python microservices
- 63 classification types covering all system aspects
- Bidirectional ZSH ↔ Python synchronization

**Key Features**:
- `UniversalRegistry` - Main registry class
- `RegistryClassification` - 63 classification types
- `UniversalRegistryEntry` - Unified data model
- `ZshPythonSyncManager` - Bidirectional sync
- `RegistryIntegrationBridge` - System integration

**Usage**:
```python
from universal_registry import UniversalRegistry, RegistryClassification

registry = UniversalRegistry()

# Register an entry
entry_id = await registry.register_entry(
    classification=RegistryClassification.SERVICES,
    name="my-service",
    data={"endpoint": "http://localhost:8080"},
    metadata={"version": "1.0.0"}
)

# Query entries
entries = await registry.get_entries_by_classification(
    RegistryClassification.SERVICES
)
```

### 2. Orchestrator Sub-Registry (Python Bridge)

**Location**: `/universal-registry/orchestrator_subregistry.py`

**Purpose**:
- Bridge between Universal Registry and TypeScript HYPER_REGISTRY
- Specialized artifact management for 6 domain types
- Type-safe routing and validation

**Sub-Registry Types**:
1. **Plugin Registry** (`SubRegistryType.PLUGIN`)
   - WASM/JavaScript/Python/Native plugins
   - Sandboxing and permissions
   - Runtime isolation

2. **Service Registry** (`SubRegistryType.SERVICE`)
   - Mesh-aware microservices
   - Health checks and endpoints
   - SLA tracking

3. **ML Model Registry** (`SubRegistryType.ML_MODEL`)
   - Version-controlled ML models
   - Framework support (TensorFlow, PyTorch, ONNX, etc.)
   - Metrics and lineage tracking

4. **Data Registry** (`SubRegistryType.DATA`)
   - Lineage-tracked datasets
   - Quality metrics
   - Transformation history

5. **Infrastructure Registry** (`SubRegistryType.INFRA`)
   - IaC templates (Terraform, Helm, CloudFormation, Ansible)
   - Cost estimation
   - Resource tracking

6. **Security Registry** (`SubRegistryType.SECURITY`)
   - SBOM (Software Bill of Materials)
   - Vulnerability tracking
   - Compliance audits

**Usage**:
```python
from universal_registry import (
    OrchestratorSubRegistry,
    SubRegistryType,
    SubRegistryEntry,
    SubRegistryMetadata,
    initialize_orchestrator_system
)

# Initialize orchestrator
orchestrator = await initialize_orchestrator_system(
    hyper_registry_path="/path/to/HYPER_REGISTRY"
)

# Register a plugin
plugin_entry = SubRegistryEntry(
    id="plugin-1",
    name="my-wasm-plugin",
    metadata=SubRegistryMetadata(
        type=SubRegistryType.PLUGIN,
        version="1.0.0",
        tags=["wasm", "production"]
    ),
    data={
        "runtime": "wasm",
        "permissions": ["fs:read", "network:http"]
    }
)

entry_id = await orchestrator.register(plugin_entry)
```

### 3. HYPER_REGISTRY (TypeScript)

**Location**: `/HYPER_REGISTRY/`

**Purpose**:
- Enterprise-grade artifact management
- Multiple interfaces (CLI, TUI, gRPC)
- Production-ready with full feature set

**Key Features**:
- SQLite persistence with ACID transactions
- Ed25519 digital signatures
- RBAC and audit logging
- Meilisearch integration
- Dependency resolution
- Full-text search

**Package Structure**:
- `packages/core/` - Registry engine, models, storage
- `packages/cli/` - Command-line interface
- `packages/tui/` - Terminal UI (4 layouts)
- `packages/proto/` - gRPC service definitions

---

## Integration Points

### Python → TypeScript Bridge

The Orchestrator Sub-Registry provides a Python bridge to the TypeScript HYPER_REGISTRY:

```python
# In Universal Registry
registry = UniversalRegistry()
await registry.enable_orchestrator_subregistry(
    hyper_registry_path="/path/to/HYPER_REGISTRY"
)

# Register to both systems
# 1. Universal Registry
entry_id = await registry.register_entry(...)

# 2. Sub-Registry (bridges to TypeScript)
plugin_id = await registry.register_to_subregistry(
    subregistry_type="plugin",
    entry_data={...}
)
```

### TypeScript → Python Integration

TypeScript sub-registries can be accessed via the Python orchestrator:

```typescript
// TypeScript HYPER_REGISTRY
import { SubRegistryOrchestrator, SubRegistryType } from '@hyper-registry/core';

const orchestrator = SubRegistryOrchestrator.getInstance();
await orchestrator.initialize();

// Register plugin
const pluginRegistry = orchestrator.getRegistry(SubRegistryType.PLUGIN);
await pluginRegistry.register({...});
```

The Python orchestrator can read these entries via the bridge.

---

## Initialization

### Quick Start

```bash
# Navigate to universal-registry
cd /home/runner/work/nova/nova/universal-registry

# Initialize unified system
python initialize_unified_registry.py

# With TypeScript bridge
python initialize_unified_registry.py \
  --hyper-registry-path=/home/runner/work/nova/nova/HYPER_REGISTRY

# Export registry data
python initialize_unified_registry.py \
  --export=unified_registry.json
```

### Programmatic Initialization

```python
import asyncio
from universal_registry import initialize_orchestrator_system, UniversalRegistry

async def setup():
    # Create Universal Registry
    universal_registry = UniversalRegistry()
    
    # Initialize Orchestrator Sub-Registry
    orchestrator = await initialize_orchestrator_system(
        hyper_registry_path="/path/to/HYPER_REGISTRY"
    )
    
    # Integrate
    await universal_registry.enable_orchestrator_subregistry(
        "/path/to/HYPER_REGISTRY"
    )
    
    return universal_registry, orchestrator

registry, orchestrator = asyncio.run(setup())
```

---

## Data Flow

### 1. Entry Registration Flow

```
User Request
    │
    ▼
┌─────────────────────┐
│ Universal Registry  │ ──────┐
│ register_entry()    │       │
└─────────────────────┘       │
                              │
                              ▼
                    ┌──────────────────────┐
                    │ Orchestrator         │
                    │ Sub-Registry         │
                    │ - Validate           │
                    │ - Route to type      │
                    └──────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │ Plugin       │    │ Service      │
            │ Sub-Registry │    │ Sub-Registry │
            └──────────────┘    └──────────────┘
                    │                   │
                    └─────────┬─────────┘
                              ▼
                    ┌──────────────────────┐
                    │ TypeScript           │
                    │ HYPER_REGISTRY       │
                    │ (Optional Bridge)    │
                    └──────────────────────┘
```

### 2. Query Flow

```
Query Request
    │
    ▼
┌─────────────────────┐
│ Orchestrator        │
│ query()             │
└─────────────────────┘
    │
    ├──► Plugin Sub-Registry
    ├──► Service Sub-Registry
    ├──► ML Model Sub-Registry
    ├──► Data Sub-Registry
    ├──► Infra Sub-Registry
    └──► Security Sub-Registry
    │
    ▼
Merged Results
    │
    ▼
Paginated Response
```

---

## Configuration

### Universal Registry Config

**File**: `/universal-registry/config.py`

```python
class UniversalRegistryConfig:
    REGISTRY_VERSION = "1.0.0"
    DEFAULT_NAMESPACE = "global"
    ENABLE_HEALTH_MONITORING = True
    ENABLE_LIFECYCLE_TRACKING = True
    EXPORT_FORMAT = "json"
```

### Orchestrator Sub-Registry Config

Sub-registries accept configuration dictionaries:

```python
orchestrator = OrchestratorSubRegistry.get_instance()

# Configure plugin registry
plugin_config = {
    "max_memory_mb": 512,
    "sandbox_mode": "strict",
    "allowed_runtimes": ["wasm", "javascript"]
}

orchestrator.register_sub_registry(
    PluginSubRegistry(config=plugin_config)
)
```

---

## API Reference

### Universal Registry

#### Class: `UniversalRegistry`

**Methods**:
- `async register_entry(classification, name, data, metadata) -> str`
- `async get_entries_by_classification(classification) -> List[Entry]`
- `async get_entry(entry_id) -> Optional[Entry]`
- `async update_entry(entry_id, updates) -> bool`
- `async export_to_json(filepath) -> bool`
- `async enable_orchestrator_subregistry(hyper_registry_path) -> None`
- `async get_orchestrator_status() -> Dict`
- `async register_to_subregistry(subregistry_type, entry_data) -> Optional[str]`

### Orchestrator Sub-Registry

#### Class: `OrchestratorSubRegistry`

**Methods**:
- `get_instance() -> OrchestratorSubRegistry` (class method)
- `register_sub_registry(registry: ISubRegistry) -> None`
- `async initialize() -> None`
- `enable_typescript_bridge(hyper_registry_path: str) -> None`
- `async register(entry: SubRegistryEntry) -> str`
- `async query(query: SubRegistryQuery) -> SubRegistryResult`
- `async get(registry_type, entry_id) -> Optional[SubRegistryEntry]`
- `async update(registry_type, entry_id, entry) -> bool`
- `async delete(registry_type, entry_id) -> bool`
- `get_registry(registry_type) -> Optional[ISubRegistry]`
- `async analyze_dependencies(entry_id) -> List[str]`
- `async get_system_status() -> Dict`
- `async export_to_json(filepath) -> bool`

#### Function: `initialize_orchestrator_system`

```python
async def initialize_orchestrator_system(
    hyper_registry_path: Optional[str] = None
) -> OrchestratorSubRegistry
```

Initializes complete orchestrator system with all 6 sub-registries.

---

## Examples

### Example 1: Register Service with Health Monitoring

```python
from universal_registry import (
    UniversalRegistry,
    RegistryClassification,
    SubRegistryType,
    SubRegistryEntry,
    SubRegistryMetadata
)

registry = UniversalRegistry()
await registry.enable_orchestrator_subregistry()

# Register to Universal Registry
service_id = await registry.register_entry(
    classification=RegistryClassification.SERVICES,
    name="api-gateway",
    data={
        "type": "gateway",
        "status": "active"
    }
)

# Register to Service Sub-Registry
service_entry = SubRegistryEntry(
    id="svc-api-gateway",
    name="api-gateway",
    metadata=SubRegistryMetadata(
        type=SubRegistryType.SERVICE,
        version="2.0.0"
    ),
    data={
        "endpoints": [{
            "protocol": "http",
            "host": "localhost",
            "port": 8080,
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

orchestrator = registry.orchestrator_subregistry
await orchestrator.register(service_entry)
```

### Example 2: Query Across All Sub-Registries

```python
from universal_registry import SubRegistryQuery

orchestrator = registry.orchestrator_subregistry

# Query all registries
query = SubRegistryQuery(
    filters={"status": "active"},
    limit=50
)

result = await orchestrator.query(query)

print(f"Found {result.total} active entries")
for entry in result.entries:
    print(f"  - {entry.name} ({entry.metadata.type.value})")
```

### Example 3: Export Complete System

```python
# Export Universal Registry
await registry.export_to_json("universal_registry.json")

# Export Orchestrator Sub-Registry
await orchestrator.export_to_json("orchestrator_subregistry.json")
```

---

## File Structure

```
/home/runner/work/nova/nova/
├── universal-registry/                 # Python Universal Registry
│   ├── __init__.py                    # Module exports
│   ├── universal_registry.py          # Core registry
│   ├── orchestrator_subregistry.py    # Sub-registry orchestrator
│   ├── config.py                      # Configuration
│   ├── initialize_unified_registry.py # Initialization script
│   ├── hyper_registry/                # Legacy hyper registry
│   │   └── core/
│   │       ├── swarm_singularity_registry.py
│   │       └── enhanced_database.py
│   └── README.md
│
└── HYPER_REGISTRY/                    # TypeScript HYPER_REGISTRY
    ├── packages/
    │   ├── core/                      # Registry engine
    │   │   └── src/
    │   │       ├── models/
    │   │       │   └── sub-registry.ts
    │   │       ├── sub-registries/
    │   │       │   ├── orchestrator.ts
    │   │       │   ├── plugin-registry.ts
    │   │       │   ├── service-registry.ts
    │   │       │   ├── ml-registry.ts
    │   │       │   ├── data-registry.ts
    │   │       │   ├── infra-registry.ts
    │   │       │   └── security-registry.ts
    │   │       └── index.ts
    │   ├── cli/                       # CLI interface
    │   ├── tui/                       # Terminal UI
    │   └── proto/                     # gRPC definitions
    └── README.md
```

---

## Status & Health

Check system status:

```python
# Get orchestrator status
status = await orchestrator.get_system_status()

print(f"Initialized: {status['initialized']}")
print(f"Total entries: {status['total_entries']}")

for reg_type, reg_status in status['registries'].items():
    print(f"{reg_type}:")
    print(f"  - Entries: {reg_status['entry_count']}")
    print(f"  - Healthy: {reg_status['healthy']}")
```

---

## Next Steps

1. **Testing**: Run tests to validate unified system
2. **Documentation**: Update integration guides
3. **Deployment**: Deploy to production environment
4. **Monitoring**: Set up health monitoring
5. **Scaling**: Configure for production scale

---

## Support

For issues or questions:
- Check documentation in `/universal-registry/README.md`
- Check HYPER_REGISTRY docs in `/HYPER_REGISTRY/README.md`
- Review integration examples above

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: 2024-12-18
