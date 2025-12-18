#!/usr/bin/env zsh
# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                  NEXUS INITIALIZATION BOOTSTRAP v3.1                      ║
# ║                    Big Sur Intel ZSH Configuration                         ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

# This script initializes NEXUS AI Studio configuration
# Usage: source nexus_bootstrap.zsh

set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# INITIALIZATION STATUS
# ─────────────────────────────────────────────────────────────────────────────

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║    🚀 NEXUS AI STUDIO v3.1 - BIG SUR INTEL INITIALIZATION     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check shell
if [[ -z "$ZSH_VERSION" ]]; then
  echo "❌ Error: This configuration requires zsh"
  echo "   Current shell: $SHELL"
  echo "   Please switch to zsh and try again"
  exit 1
fi

echo "✅ Shell: zsh detected"

# Check macOS
if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "⚠️  Warning: This is optimized for macOS Big Sur Intel"
  echo "   Current OS: $(uname -s)"
fi

echo "✅ OS: $(sw_vers -productName) $(sw_vers -productVersion)"
echo "✅ Architecture: $(uname -m)"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# DIRECTORY STRUCTURE SETUP
# ─────────────────────────────────────────────────────────────────────────────

echo "📁 Setting up directory structure..."

NEXUS_HOME="${HOME}/.config/ultra-zsh"
mkdir -p "$NEXUS_HOME"/{modules,plugins,backups,logs,cache,ai,security,dashboard,tools}

echo "   ✓ Created: $NEXUS_HOME"
echo "   ✓ Created: $NEXUS_HOME/modules"
echo "   ✓ Created: $NEXUS_HOME/plugins"
echo "   ✓ Created: $NEXUS_HOME/logs"
echo "   ✓ Created: $NEXUS_HOME/cache"
echo "   ✓ Created: $NEXUS_HOME/ai"
echo "   ✓ Created: $NEXUS_HOME/security"
echo "   ✓ Created: $NEXUS_HOME/dashboard"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# ZSHRC INSTALLATION
# ─────────────────────────────────────────────────────────────────────────────

echo "🔧 Installing NEXUS configuration..."

# Create backup of existing zshrc
if [[ -f "$HOME/.zshrc" ]]; then
  BACKUP_FILE="$HOME/.zshrc.backup.$(date +%s)"
  cp "$HOME/.zshrc" "$BACKUP_FILE"
  echo "   ✓ Backed up existing .zshrc: $BACKUP_FILE"
fi

# Copy enhanced zshrc
SCRIPT_DIR="$(cd "$(dirname "${(%):-%x}")" && pwd)"
if [[ -f "${SCRIPT_DIR}/zshrc.txt" ]]; then
  cp "${SCRIPT_DIR}/zshrc.txt" "$HOME/.zshrc"
  echo "   ✓ Installed NEXUS zshrc configuration"
else
  echo "   ⚠️  Warning: zshrc.txt not found in script directory"
  echo "      Located in: ${SCRIPT_DIR}"
fi

echo ""

# ─────────────────────────────────────────────────────────────────────────────
# MODULE LOADING TEST
# ─────────────────────────────────────────────────────────────────────────────

echo "📦 Verifying module installation..."

module_count=0
for module in "${SCRIPT_DIR}/modules"/*.zsh; do
  if [[ -f "$module" ]]; then
    ((module_count++))
  fi
done

echo "   ✓ Found $module_count modules"

if [[ -f "$HOME/.zshrc" ]]; then
  source "$HOME/.zshrc" 2>/dev/null
  echo "   ✓ Configuration loaded successfully"
else
  echo "   ⚠️  Warning: .zshrc not found"
fi

echo ""

# ─────────────────────────────────────────────────────────────────────────────
# ENVIRONMENT VERIFICATION
# ─────────────────────────────────────────────────────────────────────────────

echo "🔍 Verifying environment..."

# Check PATH
if command -v brew &>/dev/null; then
  echo "   ✓ Homebrew: $(brew --version | head -1)"
fi

if command -v git &>/dev/null; then
  echo "   ✓ Git: $(git --version)"
fi

if command -v node &>/dev/null; then
  echo "   ✓ Node.js: $(node --version)"
fi

if command -v python3 &>/dev/null; then
  echo "   ✓ Python: $(python3 --version)"
fi

echo ""

# ─────────────────────────────────────────────────────────────────────────────
# INITIALIZATION COMPLETE
# ─────────────────────────────────────────────────────────────────────────────

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                 ✅ INITIALIZATION COMPLETE                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🎉 NEXUS AI Studio v3.1 is ready to use!"
echo ""
echo "📚 Quick Start Commands:"
echo "   • quantum-help          - Display help menu"
echo "   • quantum-dashboard     - Launch dashboard"
echo "   • quantum-metrics       - Show system metrics"
echo "   • quantum-stats         - Quick stats"
echo ""
echo "ℹ️  Next Steps:"
echo "   1. Close and reopen your terminal (or run 'source ~/.zshrc')"
echo "   2. Type 'quantum-help' to see all available commands"
echo "   3. Customize config in: $NEXUS_HOME"
echo ""
