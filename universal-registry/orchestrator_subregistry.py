"""
🎯 ORCHESTRATOR SUB-REGISTRY - Universal Hyper Registry Integration
Bridges Python Universal Registry with TypeScript Sub-Registries
Provides unified interface for managing specialized artifact sub-registries
"""

from typing import Dict, List, Optional, Any, Union
from enum import Enum
from dataclasses import dataclass, field
from datetime import datetime
import json
import logging
import asyncio
from pathlib import Path

logger = logging.getLogger("orchestrator_subregistry")


class SubRegistryType(Enum):
    """Sub-registry types aligned with TypeScript implementation"""
    PLUGIN = "plugin"          # 🔌 Plugin Registry - WASM/Sandboxed extensions
    SERVICE = "service"        # 🌐 Service Registry - Mesh-aware microservices  
    ML_MODEL = "ml_model"      # 🧠 ML Model Registry - Version-controlled models
    DATA = "data"              # 📁 Data Registry - Lineage-tracked datasets
    INFRA = "infra"            # ⚙️ Infrastructure Registry - IaC templates
    SECURITY = "security"      # 🛡️ Security Registry - SBOM/Vulnerability DB


@dataclass
class SubRegistryMetadata:
    """Metadata for sub-registry entries"""
    type: SubRegistryType
    version: str = "1.0.0"
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    tags: List[str] = field(default_factory=list)
    annotations: Dict[str, str] = field(default_factory=dict)


@dataclass
class SubRegistryEntry:
    """Base entry for all sub-registries"""
    id: str
    name: str
    metadata: SubRegistryMetadata
    data: Dict[str, Any] = field(default_factory=dict)
    
    # Artifact compatibility
    namespace: str = "global"
    description: str = ""
    status: str = "active"


@dataclass
class SubRegistryQuery:
    """Query parameters for sub-registry searches"""
    type: Optional[SubRegistryType] = None
    filters: Dict[str, Any] = field(default_factory=dict)
    offset: int = 0
    limit: int = 100
    sort_by: Optional[str] = None
    sort_order: str = "asc"


@dataclass
class SubRegistryResult:
    """Result from sub-registry query"""
    entries: List[SubRegistryEntry]
    total: int
    offset: int
    limit: int
    has_more: bool


class ISubRegistry:
    """Interface that all specialized sub-registries implement"""
    
    def __init__(self, registry_type: SubRegistryType, config: Dict[str, Any] = None):
        self.type = registry_type
        self.config = config or {}
        self.entries: Dict[str, SubRegistryEntry] = {}
        self.initialized = False
    
    async def initialize(self) -> None:
        """Initialize the sub-registry"""
        logger.info(f"✅ Initializing {self.type.value} sub-registry")
        self.initialized = True
    
    async def register(self, entry: SubRegistryEntry) -> str:
        """Register a new entry"""
        if not await self.validate(entry):
            raise ValueError(f"Entry validation failed for {self.type.value}")
        
        self.entries[entry.id] = entry
        logger.info(f"📝 Registered {entry.id} in {self.type.value} sub-registry")
        return entry.id
    
    async def query(self, query: SubRegistryQuery) -> SubRegistryResult:
        """Query entries"""
        # Filter entries based on query
        filtered = list(self.entries.values())
        
        # Apply filters
        for key, value in query.filters.items():
            filtered = [e for e in filtered if getattr(e, key, None) == value or 
                       e.data.get(key) == value or
                       e.metadata.annotations.get(key) == value]
        
        total = len(filtered)
        
        # Apply pagination
        start = query.offset
        end = start + query.limit
        paginated = filtered[start:end]
        
        return SubRegistryResult(
            entries=paginated,
            total=total,
            offset=query.offset,
            limit=query.limit,
            has_more=end < total
        )
    
    async def get(self, entry_id: str) -> Optional[SubRegistryEntry]:
        """Get entry by ID"""
        return self.entries.get(entry_id)
    
    async def update(self, entry_id: str, entry: SubRegistryEntry) -> bool:
        """Update entry"""
        if entry_id not in self.entries:
            return False
        
        entry.metadata.updated_at = datetime.utcnow()
        self.entries[entry_id] = entry
        logger.info(f"📝 Updated {entry_id} in {self.type.value} sub-registry")
        return True
    
    async def delete(self, entry_id: str) -> bool:
        """Delete entry"""
        if entry_id in self.entries:
            del self.entries[entry_id]
            logger.info(f"🗑️ Deleted {entry_id} from {self.type.value} sub-registry")
            return True
        return False
    
    async def validate(self, entry: SubRegistryEntry) -> bool:
        """Validate entry against sub-registry rules"""
        # Basic validation - can be overridden by specialized registries
        return entry.id and entry.name and entry.metadata.type == self.type
    
    async def health_check(self) -> bool:
        """Health check"""
        return self.initialized


class PluginSubRegistry(ISubRegistry):
    """🔌 Plugin Sub-Registry - WASM/Sandboxed extensions"""
    
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__(SubRegistryType.PLUGIN, config)
    
    async def validate(self, entry: SubRegistryEntry) -> bool:
        """Validate plugin entry"""
        if not await super().validate(entry):
            return False
        
        # Plugin-specific validation
        runtime = entry.data.get('runtime')
        if runtime and runtime not in ['wasm', 'javascript', 'python', 'native']:
            return False
        
        return True


class ServiceSubRegistry(ISubRegistry):
    """🌐 Service Sub-Registry - Mesh-aware microservices"""
    
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__(SubRegistryType.SERVICE, config)
    
    async def validate(self, entry: SubRegistryEntry) -> bool:
        """Validate service entry"""
        if not await super().validate(entry):
            return False
        
        # Service-specific validation
        endpoints = entry.data.get('endpoints', [])
        for endpoint in endpoints:
            if 'protocol' not in endpoint or 'host' not in endpoint:
                return False
        
        return True


class MLModelSubRegistry(ISubRegistry):
    """🧠 ML Model Sub-Registry - Version-controlled models"""
    
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__(SubRegistryType.ML_MODEL, config)
    
    async def validate(self, entry: SubRegistryEntry) -> bool:
        """Validate ML model entry"""
        if not await super().validate(entry):
            return False
        
        # ML model-specific validation
        framework = entry.data.get('framework')
        if framework and framework not in ['tensorflow', 'pytorch', 'onnx', 'scikit-learn', 'huggingface']:
            logger.warning(f"Unknown ML framework: {framework}")
        
        return True


class DataSubRegistry(ISubRegistry):
    """📁 Data Sub-Registry - Lineage-tracked datasets"""
    
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__(SubRegistryType.DATA, config)
    
    async def validate(self, entry: SubRegistryEntry) -> bool:
        """Validate data entry"""
        if not await super().validate(entry):
            return False
        
        # Data-specific validation
        return True


class InfraSubRegistry(ISubRegistry):
    """⚙️ Infrastructure Sub-Registry - IaC templates"""
    
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__(SubRegistryType.INFRA, config)
    
    async def validate(self, entry: SubRegistryEntry) -> bool:
        """Validate infrastructure entry"""
        if not await super().validate(entry):
            return False
        
        # Infrastructure-specific validation
        iac_type = entry.data.get('iac_type')
        if iac_type and iac_type not in ['terraform', 'helm', 'cloudformation', 'ansible']:
            logger.warning(f"Unknown IaC type: {iac_type}")
        
        return True


class SecuritySubRegistry(ISubRegistry):
    """🛡️ Security Sub-Registry - SBOM/Vulnerability DB"""
    
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__(SubRegistryType.SECURITY, config)
    
    async def validate(self, entry: SubRegistryEntry) -> bool:
        """Validate security entry"""
        if not await super().validate(entry):
            return False
        
        # Security-specific validation
        security_type = entry.data.get('security_type')
        if security_type and security_type not in ['sbom', 'vulnerability', 'audit', 'compliance']:
            logger.warning(f"Unknown security type: {security_type}")
        
        return True


class OrchestratorSubRegistry:
    """
    🎯 ORCHESTRATOR SUB-REGISTRY
    Central coordinator for all specialized sub-registries
    Bridges Python Universal Registry with TypeScript Sub-Registries
    """
    
    _instance = None
    
    def __init__(self):
        self.registries: Dict[SubRegistryType, ISubRegistry] = {}
        self.initialized = False
        self.typescript_bridge_enabled = False
        self.typescript_bridge_path: Optional[Path] = None
    
    @classmethod
    def get_instance(cls) -> 'OrchestratorSubRegistry':
        """Get singleton instance"""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    def register_sub_registry(self, registry: ISubRegistry) -> None:
        """Register a sub-registry"""
        if registry.type in self.registries:
            raise ValueError(f"Sub-registry of type {registry.type.value} already registered")
        
        self.registries[registry.type] = registry
        logger.info(f"🔧 Registered {registry.type.value} sub-registry")
    
    async def initialize(self) -> None:
        """Initialize all registered sub-registries"""
        if self.initialized:
            return
        
        logger.info("🚀 Initializing Orchestrator Sub-Registry system...")
        
        # Initialize all sub-registries in parallel
        init_tasks = [registry.initialize() for registry in self.registries.values()]
        await asyncio.gather(*init_tasks)
        
        self.initialized = True
        logger.info("✅ Orchestrator Sub-Registry system initialized")
    
    def enable_typescript_bridge(self, hyper_registry_path: str) -> None:
        """Enable bridge to TypeScript HYPER_REGISTRY"""
        self.typescript_bridge_path = Path(hyper_registry_path)
        if not self.typescript_bridge_path.exists():
            logger.warning(f"TypeScript HYPER_REGISTRY path not found: {hyper_registry_path}")
            return
        
        self.typescript_bridge_enabled = True
        logger.info(f"🌉 TypeScript bridge enabled: {hyper_registry_path}")
    
    async def register(self, entry: SubRegistryEntry) -> str:
        """Route entry registration to appropriate sub-registry"""
        registry_type = entry.metadata.type
        registry = self.registries.get(registry_type)
        
        if not registry:
            raise ValueError(f"No sub-registry registered for type: {registry_type.value}")
        
        # Validate entry
        is_valid = await registry.validate(entry)
        if not is_valid:
            raise ValueError(f"Entry validation failed for type: {registry_type.value}")
        
        return await registry.register(entry)
    
    async def query(self, query: SubRegistryQuery) -> SubRegistryResult:
        """Query across one or more sub-registries"""
        # If type specified, query single registry
        if query.type:
            registry = self.registries.get(query.type)
            if not registry:
                raise ValueError(f"No sub-registry registered for type: {query.type.value}")
            return await registry.query(query)
        
        # Query all registries and merge results
        query_tasks = [registry.query(query) for registry in self.registries.values()]
        results = await asyncio.gather(*query_tasks)
        
        # Merge results
        merged_entries = []
        for result in results:
            merged_entries.extend(result.entries)
        
        total = sum(r.total for r in results)
        
        # Apply pagination to merged results
        start = query.offset
        end = start + query.limit
        paginated_entries = merged_entries[start:end]
        
        return SubRegistryResult(
            entries=paginated_entries,
            total=total,
            offset=query.offset,
            limit=query.limit,
            has_more=end < total
        )
    
    async def get(self, registry_type: SubRegistryType, entry_id: str) -> Optional[SubRegistryEntry]:
        """Get entry by ID from appropriate sub-registry"""
        registry = self.registries.get(registry_type)
        if not registry:
            raise ValueError(f"No sub-registry registered for type: {registry_type.value}")
        return await registry.get(entry_id)
    
    async def update(self, registry_type: SubRegistryType, entry_id: str, entry: SubRegistryEntry) -> bool:
        """Update entry in appropriate sub-registry"""
        registry = self.registries.get(registry_type)
        if not registry:
            raise ValueError(f"No sub-registry registered for type: {registry_type.value}")
        return await registry.update(entry_id, entry)
    
    async def delete(self, registry_type: SubRegistryType, entry_id: str) -> bool:
        """Delete entry from appropriate sub-registry"""
        registry = self.registries.get(registry_type)
        if not registry:
            raise ValueError(f"No sub-registry registered for type: {registry_type.value}")
        return await registry.delete(entry_id)
    
    def get_registry(self, registry_type: SubRegistryType) -> Optional[ISubRegistry]:
        """Get specific sub-registry"""
        return self.registries.get(registry_type)
    
    async def analyze_dependencies(self, entry_id: str) -> List[str]:
        """Analyze dependencies across all registries"""
        dependencies = []
        
        for registry in self.registries.values():
            for entry in registry.entries.values():
                # Check if entry references the given ID
                if 'dependencies' in entry.data:
                    deps = entry.data['dependencies']
                    if isinstance(deps, list) and entry_id in deps:
                        dependencies.append(entry.id)
                    elif isinstance(deps, dict) and entry_id in deps.values():
                        dependencies.append(entry.id)
        
        return dependencies
    
    async def get_system_status(self) -> Dict[str, Any]:
        """Get complete system status"""
        status = {
            'initialized': self.initialized,
            'typescript_bridge_enabled': self.typescript_bridge_enabled,
            'registries': {},
            'total_entries': 0
        }
        
        for reg_type, registry in self.registries.items():
            entry_count = len(registry.entries)
            status['registries'][reg_type.value] = {
                'initialized': registry.initialized,
                'entry_count': entry_count,
                'healthy': await registry.health_check()
            }
            status['total_entries'] += entry_count
        
        return status
    
    async def export_to_json(self, filepath: str) -> bool:
        """Export all sub-registry data to JSON"""
        try:
            data = {
                'version': '1.0.0',
                'timestamp': datetime.utcnow().isoformat(),
                'system_status': await self.get_system_status(),
                'registries': {}
            }
            
            for reg_type, registry in self.registries.items():
                data['registries'][reg_type.value] = {
                    'entries': [
                        {
                            'id': entry.id,
                            'name': entry.name,
                            'namespace': entry.namespace,
                            'description': entry.description,
                            'status': entry.status,
                            'metadata': {
                                'type': entry.metadata.type.value,
                                'version': entry.metadata.version,
                                'tags': entry.metadata.tags,
                                'annotations': entry.metadata.annotations,
                                'created_at': entry.metadata.created_at.isoformat(),
                                'updated_at': entry.metadata.updated_at.isoformat()
                            },
                            'data': entry.data
                        }
                        for entry in registry.entries.values()
                    ]
                }
            
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
            
            logger.info(f"💾 Exported orchestrator sub-registry to {filepath}")
            return True
        except Exception as e:
            logger.error(f"❌ Export failed: {e}")
            return False


# Factory function to initialize complete orchestrator system
async def initialize_orchestrator_system(
    hyper_registry_path: Optional[str] = None
) -> OrchestratorSubRegistry:
    """
    Initialize complete orchestrator sub-registry system
    
    Args:
        hyper_registry_path: Optional path to TypeScript HYPER_REGISTRY for bridge
    
    Returns:
        Initialized OrchestratorSubRegistry instance
    """
    orchestrator = OrchestratorSubRegistry.get_instance()
    
    # Register all sub-registries
    orchestrator.register_sub_registry(PluginSubRegistry())
    orchestrator.register_sub_registry(ServiceSubRegistry())
    orchestrator.register_sub_registry(MLModelSubRegistry())
    orchestrator.register_sub_registry(DataSubRegistry())
    orchestrator.register_sub_registry(InfraSubRegistry())
    orchestrator.register_sub_registry(SecuritySubRegistry())
    
    # Enable TypeScript bridge if path provided
    if hyper_registry_path:
        orchestrator.enable_typescript_bridge(hyper_registry_path)
    
    # Initialize system
    await orchestrator.initialize()
    
    logger.info("🎯 Orchestrator Sub-Registry system fully initialized")
    return orchestrator
