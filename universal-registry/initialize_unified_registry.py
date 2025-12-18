#!/usr/bin/env python3
"""
🚀 UNIVERSAL HYPER REGISTRY - Unified System Initialization
Initializes the complete unified registry system including:
- Universal Registry (Python-based ZSH + Python integration)
- Orchestrator Sub-Registry (specialized artifact management)
- TypeScript HYPER_REGISTRY bridge (optional)
"""

import asyncio
import logging
import sys
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('unified_registry_init')


async def initialize_unified_registry(hyper_registry_path: str = None):
    """
    Initialize the complete unified registry system
    
    Args:
        hyper_registry_path: Optional path to TypeScript HYPER_REGISTRY
    """
    logger.info("🌍 Initializing Universal Hyper Registry System...")
    
    try:
        # Import Universal Registry
        from universal_registry import (
            UniversalRegistry,
            RegistryClassification,
            initialize_orchestrator_system
        )
        
        # 1. Initialize Universal Registry
        logger.info("📦 Step 1: Initializing Universal Registry...")
        universal_registry = UniversalRegistry()
        
        # 2. Initialize Orchestrator Sub-Registry
        logger.info("🎯 Step 2: Initializing Orchestrator Sub-Registry...")
        orchestrator = await initialize_orchestrator_system(hyper_registry_path)
        
        # 3. Integrate Orchestrator with Universal Registry
        logger.info("🔗 Step 3: Integrating systems...")
        await universal_registry.enable_orchestrator_subregistry(hyper_registry_path)
        
        # 4. Register sample entries to demonstrate functionality
        logger.info("📝 Step 4: Registering sample entries...")
        
        # Sample Universal Registry entry
        entry_id = await universal_registry.register_entry(
            classification=RegistryClassification.SERVICES,
            name="sample-service",
            data={
                "type": "microservice",
                "endpoint": "http://localhost:8080",
                "status": "active"
            },
            metadata={
                "author": "Universal Hyper Registry",
                "version": "1.0.0"
            }
        )
        logger.info(f"  ✓ Registered universal entry: {entry_id}")
        
        # Sample Sub-Registry entry (Plugin)
        plugin_id = await universal_registry.register_to_subregistry(
            subregistry_type="plugin",
            entry_data={
                "name": "sample-plugin",
                "version": "1.0.0",
                "data": {
                    "runtime": "wasm",
                    "permissions": ["fs:read", "network:http"]
                },
                "tags": ["demo", "sample"],
                "description": "Sample WASM plugin"
            }
        )
        if plugin_id:
            logger.info(f"  ✓ Registered plugin sub-registry entry: {plugin_id}")
        
        # 5. Display system status
        logger.info("📊 Step 5: System Status Report...")
        
        # Universal Registry status
        total_entries = len(universal_registry.entries)
        total_classifications = len(universal_registry.classifications)
        logger.info(f"  Universal Registry: {total_entries} entries, {total_classifications} classifications")
        
        # Orchestrator status
        orch_status = await universal_registry.get_orchestrator_status()
        if orch_status:
            logger.info(f"  Orchestrator Sub-Registry: {orch_status['total_entries']} total entries")
            for reg_type, status in orch_status['registries'].items():
                logger.info(f"    - {reg_type}: {status['entry_count']} entries, "
                          f"healthy={status['healthy']}")
        
        logger.info("✅ Universal Hyper Registry System successfully initialized!")
        
        return {
            'universal_registry': universal_registry,
            'orchestrator': orchestrator,
            'status': 'initialized'
        }
        
    except Exception as e:
        logger.error(f"❌ Initialization failed: {e}", exc_info=True)
        raise


async def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Initialize Universal Hyper Registry System'
    )
    parser.add_argument(
        '--hyper-registry-path',
        type=str,
        help='Path to TypeScript HYPER_REGISTRY directory (optional)',
        default=None
    )
    parser.add_argument(
        '--export',
        type=str,
        help='Export unified registry to JSON file',
        default=None
    )
    
    args = parser.parse_args()
    
    # Determine HYPER_REGISTRY path
    hyper_registry_path = args.hyper_registry_path
    if not hyper_registry_path:
        # Try to auto-detect
        current_dir = Path(__file__).parent.parent
        hyper_reg_path = current_dir / 'HYPER_REGISTRY'
        if hyper_reg_path.exists():
            hyper_registry_path = str(hyper_reg_path)
            logger.info(f"Auto-detected HYPER_REGISTRY at: {hyper_registry_path}")
    
    # Initialize system
    result = await initialize_unified_registry(hyper_registry_path)
    
    # Export if requested
    if args.export:
        logger.info(f"💾 Exporting to {args.export}...")
        await result['universal_registry'].export_to_json(args.export)
        
        if result['orchestrator']:
            orch_export = args.export.replace('.json', '_orchestrator.json')
            await result['orchestrator'].export_to_json(orch_export)
            logger.info(f"💾 Orchestrator exported to {orch_export}")
    
    logger.info("🎉 Initialization complete!")
    
    return result


if __name__ == '__main__':
    try:
        result = asyncio.run(main())
        sys.exit(0)
    except KeyboardInterrupt:
        logger.info("⚠️ Interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"💥 Fatal error: {e}")
        sys.exit(1)
