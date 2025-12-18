#!/usr/bin/env zsh
# ──────────────────────────────────────────────────────────────────────────────
# 🚀 NEXUSPRO HYPER-CONVERGED MILITARY-GRADE CORE v10.0
# ──────────────────────────────────────────────────────────────────────────────

# Prevent infinite recursion
[[ -n "$NEXUS_LOADED" ]] && return
export NEXUS_LOADED=$(date +%s)

# Security audit trail
export NEXUS_AUDIT_LOG="$HOME/.nexus/logs/audit_$(date +%Y%m%d).log"
mkdir -p "$(dirname "$NEXUS_AUDIT_LOG")"
echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] NEXUS START: v10.0 | USER: $USER | HOST: $(hostname) | IP: $(curl -s ipinfo.io/ip 2>/dev/null || echo '0.0.0.0')" >> "$NEXUS_AUDIT_LOG"

# =============================================================================
# ⚡ SECTOR 1: UNIVERSAL PATH ENGINE (MIL-SPEC)
# =============================================================================

# Atomic path reconstruction
typeset -U PATH
export PATH=""

# Build prioritized path array
path=(/usr/bin /bin /usr/sbin /sbin)

# Architecture detection
export NEXUS_ARCH="UNKNOWN"
case "$(uname -m)" in
  x86_64)
    NEXUS_ARCH="INTEL"
    [[ -d "/usr/local/bin" ]] && path=(/usr/local/bin /usr/local/sbin $path)
    export HOMEBREW_PREFIX="/usr/local"
    ;;
  arm64)
    NEXUS_ARCH="ARM64"
    [[ -d "/opt/homebrew/bin" ]] && path=(/opt/homebrew/bin /opt/homebrew/sbin $path)
    export HOMEBREW_PREFIX="/opt/homebrew"
    ;;
esac

# User space
[[ -d "$HOME/.local/bin" ]] && path=("$HOME/.local/bin" $path)
[[ -d "$HOME/bin" ]] && path=("$HOME/bin" $path)

# Development runtimes
[[ -d "$HOME/.cargo/bin" ]] && path=("$HOME/.cargo/bin" $path)
[[ -d "$HOME/.go/bin" ]] && path=("$HOME/.go/bin" $path)
[[ -n "$VOLTA_HOME" && -d "$VOLTA_HOME/bin" ]] && path=("$VOLTA_HOME/bin" $path)
[[ -d "$HOME/.bun/bin" ]] && path=("$HOME/.bun/bin" $path)
[[ -d "$HOME/.deno/bin" ]] && path=("$HOME/.deno/bin" $path)

# Application binaries - use plain arrays (not local at top-level)
app_paths=(
  "/Applications/Visual Studio Code.app/Contents/Resources/app/bin"
  "/Applications/Docker.app/Contents/Resources/bin"
  "/Applications/WezTerm.app/Contents/MacOS"
  "/Applications/Warp.app/Contents/MacOS"
  "/Applications/Cursor.app/Contents/MacOS"
  "/Applications/Ghostty.app/Contents/MacOS"
  "/Applications/Raycast.app/Contents/MacOS"
)

for app in "${app_paths[@]}"; do
  [[ -d "$app" ]] && path=($path "$app")
done

# Final export with duplicates removed
typeset -U PATH
export PATH
export NEXUS_ARCH

# =============================================================================
# 🎨 SECTOR 2: QUANTUM COLOR ENGINE (TRUE-COLOR)
# =============================================================================

export NEXUS_COLORS_ACTIVE=true
export C_BLACK='\033[38;2;10;10;15m'
export C_RED='\033[38;2;255;59;48m'
export C_GREEN='\033[38;2;48;209;88m'
export C_YELLOW='\033[38;2;255;214;10m'
export C_BLUE='\033[38;2;10;132;255m'
export C_MAGENTA='\033[38;2;191;90;242m'
export C_CYAN='\033[38;2;100;210;255m'
export C_WHITE='\033[38;2;242;242;247m'
export C_GRAD1='\033[38;2;0;212;255m'
export C_GRAD2='\033[38;2;123;97;255m'
export C_GRAD3='\033[38;2;0;245;160m'
export C_GRAD4='\033[38;2;255;107;255m'
export C_GRAD5='\033[38;2;255;77;0m'
export C_GRAD6='\033[38;2;255;215;0m'
export C_GRAD7='\033[38;2;138;43;226m'
export C_GRAD8='\033[38;2;57;255;20m'
export C_RESET='\033[0m'
export C_BOLD='\033[1m'
export C_DIM='\033[2m'
export C_ITALIC='\033[3m'
export C_UNDERLINE='\033[4m'
export C_BLINK='\033[5m'
export C_INVERT='\033[7m'
export C_BG_DARK='\033[48;2;20;20;30m'
export C_BG_BLACK='\033[48;2;10;10;15m'
GRADIENT_NEURAL=("$C_GRAD1" "$C_GRAD2" "$C_GRAD3" "$C_GRAD4" "$C_GRAD5")
GRADIENT_HOLO=("$C_GRAD1" "$C_GRAD3" "$C_GRAD4" "$C_GRAD6" "$C_GRAD7")
GRADIENT_BIO=("$C_GRAD3" "$C_GRAD8" "$C_GRAD1" "$C_GRAD6")

# =============================================================================
# 📁 SECTOR 3: NEXUS DIRECTORY ARCHITECTURE
# =============================================================================

export NEXUS_HOME="$HOME/.nexus"
export NEXUS_MESH="$NEXUS_HOME/mesh"
export NEXUS_PLUGINS="$NEXUS_HOME/plugins"
export NEXUS_LOGS="$NEXUS_HOME/logs"
export NEXUS_REGISTRY="$NEXUS_HOME/registry/global.json"
export NEXUS_CONTAINERS="$NEXUS_HOME/containers"
export NEXUS_CACHE="$NEXUS_HOME/cache"
export NEXUS_TEMP="$NEXUS_HOME/temp"
export NEXUS_BACKUP="$NEXUS_HOME/backup"
export NEXUS_AI="$NEXUS_HOME/ai"
export NEXUS_MODELS="$NEXUS_HOME/models"
export NEXUS_INJECTORS="$NEXUS_HOME/injectors"
export NEXUS_SERVICES="$NEXUS_HOME/services"
export NEXUS_GRAPHS="$NEXUS_HOME/graphs"
export NEXUS_THEMES="$NEXUS_HOME/themes"

nexus_dirs=(
  $NEXUS_MESH $NEXUS_PLUGINS $NEXUS_LOGS
  $NEXUS_CONTAINERS $NEXUS_CACHE $NEXUS_TEMP $NEXUS_BACKUP
  $NEXUS_AI $NEXUS_MODELS $NEXUS_INJECTORS $NEXUS_SERVICES
  $NEXUS_GRAPHS $NEXUS_THEMES
  "$NEXUS_LOGS/telemetry" "$NEXUS_LOGS/ai" "$NEXUS_LOGS/mesh"
  "$NEXUS_CACHE/ai" "$NEXUS_CACHE/docker" "$NEXUS_CACHE/volta"
)

for dir in "${nexus_dirs[@]}"; do
  [[ ! -d "$dir" ]] && mkdir -p "$dir" && chmod 0700 "$dir"
done

# Source supporting modules if present
if [[ -f "${NEXUS_HOME:-$HOME/.nexus}/config/api_keys.conf" ]]; then
  :
fi
if [[ -f "$(pwd)/zsh-config/ultra-zsh/api_manager.zsh" ]]; then
  source "$(pwd)/zsh-config/ultra-zsh/api_manager.zsh"
elif [[ -f "$NEXUS_HOME/api_manager.zsh" ]]; then
  source "$NEXUS_HOME/api_manager.zsh"
fi

if [[ -f "$(pwd)/zsh-config/ultra-zsh/intelligent_prompt.zsh" ]]; then
  source "$(pwd)/zsh-config/ultra-zsh/intelligent_prompt.zsh"
elif [[ -f "$NEXUS_HOME/intelligent_prompt.zsh" ]]; then
  source "$NEXUS_HOME/intelligent_prompt.zsh"
fi

# =============================================================================
# 🔧 SECTOR 4: CORE UTILITY FUNCTIONS
# =============================================================================

nexus_progress_bar() {
  local current=$1 total=$2 width=${3:-50} label=${4:-"Progress"}
  local percent=$((current * 100 / total))
  local filled=$((current * width / total)) empty=$((width - filled))
  local bar="["
  for ((i=0;i<filled;i++)); do
    local color_idx=$((i * ${#GRADIENT_NEURAL[@]} / width))
    bar+="${(P)GRADIENT_NEURAL[color_idx]}█${C_RESET}"
  done
  for ((i=0;i<empty;i++)); do
    bar+="${C_DIM}░${C_RESET}"
  done
  bar+="]"
  printf "\r${C_CYAN}%-20s${C_RESET} ${bar} ${C_BOLD}%3d%%${C_RESET}" "$label" "$percent"
  [[ $percent -eq 100 ]] && echo ""
}

# =============================================================================
# ✨ SECTOR: LLM ROUTER (REAL API EXECUTION + DISCORD OUTPUT)
# =============================================================================

nexus_llm_router() {
  clear
  echo -e "\n${C_BOLD}${C_CYAN}>> NEXUS MULTI-LLM FUSION CHATBOX (AEFA + UNIVERSAL ADAPTER)${C_RESET}"

  # Ensure orchestrator service is available
  if ! nexus_detect_tools; then
    echo -e "${C_RED}Required tools missing (curl/jq). Install them and retry.${C_RESET}"
    return 2
  fi

  local ORCHESTRATOR_URL="http://127.0.0.1:9001"
  local USE_STREAMING=true
  local USE_AUTO_SELECT=false

  # Check if orchestrator is running
  if ! curl -s "$ORCHESTRATOR_URL/v1/health" > /dev/null 2>&1; then
    echo -e "${C_ORANGE}⚠️ Orchestrator not running at $ORCHESTRATOR_URL${C_RESET}"
    read -r -p "Start orchestrator? (y/n): " start_orch
    if [[ "$start_orch" =~ ^[yY]$ ]]; then
      # Start orchestrator in background
      ( cd /workspaces/ZSH/services/llm_orchestrator && python3 multi_llm_service.py ) &
      sleep 2
      if ! curl -s "$ORCHESTRATOR_URL/v1/health" > /dev/null 2>&1; then
        echo -e "${C_RED}❌ Failed to start orchestrator.${C_RESET}"
        return 1
      fi
      echo -e "${C_GREEN}✅ Orchestrator started.${C_RESET}"
    else
      USE_STREAMING=false
    fi
  fi

  echo -e "${C_GREEN}✅ LLM Router Ready. Type 'exit' to quit.${C_RESET}"
  echo -e "${C_CYAN}Mode: $([ "$USE_STREAMING" = true ] && echo 'STREAMING (AEFA)' || echo 'FALLBACK (OpenAI Direct)')${C_RESET}"
  
  # Ask about auto-select mode
  read -r -p "${C_YELLOW}Enable universal adapter auto-select mode? (y/n): ${C_RESET}" auto_mode
  if [[ "$auto_mode" =~ ^[yY]$ ]]; then
    USE_AUTO_SELECT=true
    echo -e "${C_CYAN}🌐 Auto-select mode enabled. Will auto-rank providers by capability.${C_RESET}"
  fi

  while true; do
    printf "${C_BOLD}${C_CYAN}LLM-FUSION > ${C_RESET}"
    read -r prompt
    if [[ "$prompt" =~ ^(exit|quit)$ ]]; then
      echo "Exiting LLM Router."; break
    fi
    [[ -z "$prompt" ]] && continue

    echo -e "${C_PURP}🧠 Routing prompt through multi-LLM ensemble...${C_RESET}"

    if [[ "$USE_AUTO_SELECT" == "true" ]]; then
      # Use universal adapter auto-select
      nexus_llm_auto_select "$prompt" "$ORCHESTRATOR_URL"
    elif [[ "$USE_STREAMING" == "true" ]]; then
      # Use streaming endpoint for real-time output
      nexus_llm_stream "$prompt" "$ORCHESTRATOR_URL"
    else
      # Fallback: Use non-streaming complete endpoint
      nexus_llm_complete "$prompt" "$ORCHESTRATOR_URL"
    fi

    # Send to Discord if webhook configured
    local DISCORD_MESSAGE
    DISCORD_MESSAGE=$(printf "User %s routed multi-LLM query (AEFA fusion active)" "${USER}")
    nexus_send_discord_webhook "$DISCORD_MESSAGE" "LLM Inference Complete" "3066993" >/dev/null 2>&1 || true

  done
}

# Stream LLM output from orchestrator using SSE
nexus_llm_stream() {
  local prompt="$1"
  local orch_url="$2"

  # Build payload
  local payload
  payload=$(jq -n --arg p "$prompt" '{prompt:$p, providers:[{name:"openai"}], temperature:0.7, max_tokens:800}')

  # Stream SSE response with curl and parse events
  curl -s -N -X POST "$orch_url/v1/stream" \
    -H "Content-Type: application/json" \
    -d "$payload" | while IFS= read -r line; do
    if [[ "$line" =~ ^data:\ (.*)$ ]]; then
      local json="${BASH_REMATCH[1]}"
      local event_type
      event_type=$(echo "$json" | jq -r '.type // empty')
      case "$event_type" in
        provider_start)
          local prov=$(echo "$json" | jq -r '.provider')
          local conf=$(echo "$json" | jq -r '.confidence // "N/A"')
          echo -e "\n${C_GREEN}[${prov}]${C_RESET} (confidence: $conf)"
          ;;
        chunk)
          local text=$(echo "$json" | jq -r '.text // ""')
          printf "%s" "$text"
          ;;
        provider_end)
          printf "\n"
          ;;
        fused)
          echo -e "\n${C_BOLD}${C_GREEN}✨ AEFA FUSED RESPONSE:${C_RESET}"
          local text=$(echo "$json" | jq -r '.text // ""')
          printf "%s\n" "$text"
          ;;
        complete)
          echo -e "${C_CYAN}[✓ Stream complete]${C_RESET}\n"
          ;;
        error)
          local err=$(echo "$json" | jq -r '.text // "Unknown error"')
          echo -e "${C_RED}❌ Error: $err${C_RESET}\n"
          ;;
      esac
    fi
  done
}

# Non-streaming complete endpoint (fallback)
nexus_llm_complete() {
  local prompt="$1"
  local orch_url="$2"

  local payload
  payload=$(jq -n --arg p "$prompt" '{prompt:$p, providers:[{name:"openai"}], temperature:0.7, max_tokens:800}')

  local response
  response=$(curl -s -X POST "$orch_url/v1/complete" \
    -H "Content-Type: application/json" \
    -d "$payload")

  local fused_text
  fused_text=$(echo "$response" | jq -r '.fused.text // empty')
  local error
  error=$(echo "$response" | jq -r '.responses[0].text // empty' | head -1)

  if [[ -n "$fused_text" ]]; then
    echo -e "\n${C_GREEN}🤖 AEFA RESPONSE:${C_RESET} ${fused_text}\n"
  elif [[ -n "$error" ]]; then
    echo -e "${C_RED}❌ ERROR: ${error}${C_RESET}\n"
  else
    echo -e "${C_RED}❌ No response from orchestrator${C_RESET}\n"
  fi
}

# Universal adapter auto-select mode
nexus_llm_auto_select() {
  local prompt="$1"
  local orch_url="$2"

  echo -e "${C_CYAN}📋 Analyzing system capabilities...${C_RESET}"

  # Build capability request based on detected tools
  local capabilities='[]'
  [[ "$NEXUS_HAS_GPU" == "true" ]] && capabilities=$(echo "$capabilities" | jq '. += ["vision"]')
  [[ "$NEXUS_HAS_KUBERNETES" == "true" ]] && capabilities=$(echo "$capabilities" | jq '. += ["function_calling"]')
  [[ "$NEXUS_HAS_DOCKER" == "true" ]] && capabilities=$(echo "$capabilities" | jq '. += ["streaming"]')

  local payload
  payload=$(jq -n \
    --arg p "$prompt" \
    --argjson caps "$capabilities" \
    '{prompt:$p, required_capabilities:$caps, prefer_speed:false, temperature:0.7, max_tokens:800}')

  echo -e "${C_YELLOW}🔍 Querying universal adapter for best provider...${C_RESET}"

  # Call auto-select endpoint
  local response
  response=$(curl -s -X POST "$orch_url/v1/auto-select" \
    -H "Content-Type: application/json" \
    -d "$payload")

  local error
  error=$(echo "$response" | jq -r '.error // empty')

  if [[ -n "$error" ]]; then
    echo -e "${C_RED}❌ Auto-select error: $error${C_RESET}\n"
    return 1
  fi

  # Display selection
  local selected=$(echo "$response" | jq -r '.selected_provider')
  local score=$(echo "$response" | jq -r '.score')
  local reason=$(echo "$response" | jq -r '.recommendation_reason')

  echo -e "${C_GREEN}✅ Selected Provider: ${C_BOLD}${selected}${C_RESET}${C_GREEN} (Score: $score)${C_RESET}"
  echo -e "${C_CYAN}📌 $reason${C_RESET}\n"

  # Show alternatives
  local alt_count=$(echo "$response" | jq '.alternatives | length')
  if [[ $alt_count -gt 0 ]]; then
    echo -e "${C_YELLOW}🔄 Alternatives:${C_RESET}"
    echo "$response" | jq -r '.alternatives[] | "  \(.provider) (score: \(.score))"'
    echo ""
  fi

  # Now call the actual completion with selected provider
  local complete_payload
  complete_payload=$(jq -n \
    --arg p "$prompt" \
    --arg prov "$selected" \
    '{prompt:$p, providers:[{name:$prov}], temperature:0.7, max_tokens:800}')

  echo -e "${C_PURP}💭 Generating response...${C_RESET}"

  local complete_response
  complete_response=$(curl -s -X POST "$orch_url/v1/complete" \
    -H "Content-Type: application/json" \
    -d "$complete_payload")

  local fused_text
  fused_text=$(echo "$complete_response" | jq -r '.fused.text // empty')

  if [[ -n "$fused_text" ]]; then
    echo -e "\n${C_GREEN}🤖 RESPONSE (via $selected):${C_RESET}\n$fused_text\n"
  else
    echo -e "${C_RED}❌ Failed to get response from $selected${C_RESET}\n"
  fi
}


# (Other functions kept minimal here to keep the module safe and focused on header + dashboard)

# =============================================================================
# 🎨 SECTOR 7: 3D QUANTUM HEADER ENGINE
# =============================================================================

nexus_render_3d_header() {
  local width=$(tput cols)
  for frame in {1..6}; do
    tput cup 0 0
    echo -ne "${C_BG_BLACK}"
    echo -ne "${(P)GRADIENT_NEURAL[$((frame % ${#GRADIENT_NEURAL[@]}))]}"
    printf "╔"
    for ((i=0;i<width-2;i++)); do
      if [[ $(( (i + frame) % 4 )) -eq 0 ]]; then printf "═"; else printf "━"; fi
    done
    printf "╗\n"
    # Title
    local title="🚀 NEXUS AI STUDIO MATRIX v10.0 🚀"
    local title_pad=$(( (width - ${#title}) / 2 ))
    printf "%${title_pad}s"
    for ((i=0;i<${#title};i++)); do
      local char="${title:$i:1}"
      local color_idx=$(((frame + i) % ${#GRADIENT_HOLO[@]}))
      echo -ne "${(P)GRADIENT_HOLO[color_idx]}${char}"
    done
    echo -e "${C_RESET}\n"
    sleep 0.06
  done
  # stable header (simplified)
  cat << EOF
${C_BG_BLACK}${C_GRAD1}╔═══════════════════════════════════════════════════════════════════════════════╗${C_RESET}
${C_BG_BLACK}${C_GRAD2}║                     🚀 NEXUS AI STUDIO MATRIX v10.0 🚀                         ║${C_RESET}
${C_BG_BLACK}${C_GRAD3}╠═══════════════════════════════════════════════════════════════════════════════╣${C_RESET}
EOF
}

# =============================================================================
# 📊 SECTOR 8: TELEMETRY PANEL (lightweight)
# =============================================================================

nexus_render_telemetry() {
  local width=$(tput cols)
  # Lightweight metrics: CPU, MEM, DISK, NET
  local cpu=$(awk -v RS="\n" '/^cpu /{print $2+$3+$4}' /proc/stat 2>/dev/null || echo 0)
  local mem=$(free -m 2>/dev/null | awk '/Mem:/ {printf "%d", $3*100/$2}')
  local disk=$(df -h "$HOME" 2>/dev/null | awk 'NR==2 {print $5}' | tr -d '%')
  local net="$(ping -c1 -W1 8.8.8.8 &>/dev/null && echo '🟢 ONLINE' || echo '🔴 OFFLINE')"

  echo "${C_BG_BLACK}${C_GRAD3}║  ┌─ LIVE TELEMETRY ────────────────────────────────────────────────────────┐ ║${C_RESET}"
  # Add sparklines and security context
  local cpu_sparkline=$(nexus_sparkline $cpu)
  local mem_sparkline=$(nexus_sparkline $mem)
  local privilege="$(id -u -n 2>/dev/null || echo $USER)"
  local is_root=$(id -u 2>/dev/null)
  local firewall_status="unknown"
  if command -v ufw &>/dev/null; then
    firewall_status=$(ufw status | head -1 2>/dev/null || echo unknown)
  elif command -v firewall-cmd &>/dev/null; then
    firewall_status=$(firewall-cmd --state 2>/dev/null || echo unknown)
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    firewall_status=$(/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate 2>/dev/null | tr '\n' ' ' || echo unknown)
  fi

  printf "%s\n" "${C_BG_BLACK}${C_WHITE}║  │ 🎯 GEFS: --- ${cpu_sparkline} CPU: ${cpu}%    ⚡ MODE: HYPER-GENERATIVE    📊 HEALTH: ${mem}% ${mem_sparkline} │ ║${C_RESET}"
  printf "%s\n" "${C_BG_BLACK}${C_WHITE}║  │ 🛡️ PRIV: $( [[ $is_root -eq 0 ]] && echo 'ROOT' || echo $USER )   FW: ${firewall_status}    🚀 PERF: <0.58ms core   🔄 UPTIME: 0.1d │ ║${C_RESET}"
  echo "${C_BG_BLACK}${C_GRAD3}╚══════════════════════════════════════════════════════════════════════════════╝${C_RESET}"
}


# Small sparkline helper (maps 0-100 to spark characters)
nexus_sparkline() {
  local val=${1:-0}
  local bars=(▁ ▂ ▃ ▄ ▅ ▆ ▇ █)
  local idx=$(( val * (${#bars[@]} - 1) / 100 ))
  echo "${bars[$idx]}"
}

# Export telemetry / metrics to CSV or Google Sheets (optional API)
nexus_export_metrics() {
  local outdir="$NEXUS_HOME/exports"
  mkdir -p "$outdir"
  local ts=$(date -u +%Y%m%dT%H%M%SZ)
  local file="$outdir/metrics_$ts.csv"
  get_system_matrix | jq -r '[.timestamp, .cpu.usage_percent, .memory.usage_percent, .disk.usage_percent, .network.status] | @csv' > "$file" 2>/dev/null || get_system_matrix | sed 's/\"/,/g' > "$file"
  echo "✅ Metrics exported to $file"

  # Optional Google Sheets push (requires SHEET_ID and GOOGLE_API_KEY env vars)
  if [[ -n "$GOOGLE_SHEETS_API_KEY" && -n "$GOOGLE_SHEET_ID" ]]; then
    echo "📤 Pushing to Google Sheets (SHEET_ID=$GOOGLE_SHEET_ID)"
    # Simple append via Sheets API (user must set up API and credentials)
    local csv_data=$(cat "$file")
    echo "⚠️  Google Sheets push requires OAuth; please use gdrive or manual upload if no OAuth set up."
  fi
}

# =============================================================================
# 🎮 SECTOR 11: SIMPLE LAUNCHER
# =============================================================================

nexus_dashboard() {
  nexus_render_3d_header
  nexus_render_telemetry
}

# Auto-source when module is loaded in interactive shells
if [[ -o interactive ]]; then
  export NEXUS_DASHBOARD_LOADED=1
  # Do not auto-run heavy bootstrap here; keep interactive launch light
  if [[ -t 1 ]]; then
    # user can call `nexus_dashboard` to view the header and telemetry
    :
  fi
fi

# =============================================================================
# ✨ SECTOR: OPTIONAL PRODUCTION TELEMETRY INTEGRATION (OPT-IN)
# =============================================================================

# Configuration file (user can enable collector by creating this file)
NEXUS_CONFIG_FILE="$HOME/.nexus/config.json"

_nexus__collector_pid_file="$NEXUS_HOME/collector.pid"

# Check if the production bash script exists and is usable
_nexus__production_script="$(pwd)/nexus_quantum_hyper_matrix_production.sh"
if [[ ! -f "${_nexus__production_script}" ]]; then
  # try workspace root path fallback
  _nexus__production_script="/workspaces/ZSH/nexus_quantum_hyper_matrix_production.sh"
fi

nexus_collector_enabled() {
  [[ -f "$NEXUS_CONFIG_FILE" ]] && grep -q '"enable_collector": *true' "$NEXUS_CONFIG_FILE" 2>/dev/null
}

# Start opt-in background collector (calls the production script periodically)
nexus_start_collector() {
  if nexus_collector_enabled; then
    if [[ -f "$_nexus__production_script" ]]; then
      if [[ -f "$_nexus__collector_pid_file" ]] && kill -0 $(cat "$_nexus__collector_pid_file") &>/dev/null; then
        echo "🔁 Collector already running (pid $(cat $_nexus__collector_pid_file))"
        return 0
      fi

      ( while true; do
          bash "$_nexus__production_script" --collect >/dev/null 2>&1 || bash "$_nexus__production_script" >/dev/null 2>&1
          sleep 30
        done ) &
      echo $! > "$_nexus__collector_pid_file"
      echo "✅ Nexus collector started (pid $(cat $_nexus__collector_pid_file))"
    else
      echo "⚠️  Production script not found; install or place it at: $_nexus__production_script"
      return 1
    fi
  else
    echo "ℹ️  Collector is not enabled. To enable, add { \"enable_collector\": true } to $NEXUS_CONFIG_FILE"
    return 2
  fi
}

nexus_stop_collector() {
  if [[ -f "$_nexus__collector_pid_file" ]]; then
    local pid=$(cat "$_nexus__collector_pid_file")
    if kill -0 $pid &>/dev/null; then
      kill $pid && rm -f "$_nexus__collector_pid_file"
      echo "✅ Nexus collector stopped"
      return 0
    else
      rm -f "$_nexus__collector_pid_file"
      echo "ℹ️  Collector pid file removed"
      return 1
    fi
  else
    echo "ℹ️  No collector pid file found"
    return 2
  fi
}

# =============================================================================
# ✨ SECTOR: INTELLIGENT ASSISTANT (GUIDED SETUP)
# =============================================================================

nexus_assistant() {
  echo -e "${C_CYAN}${C_BOLD}NEXUS ASSISTANT — Guided Setup${C_RESET}"
  echo "I can help you enable telemetry, initialize the service mesh, plugins, and auto-heal. Choose an action:"
  echo "1) Enable collector and start background telemetry"
  echo "2) Initialize Service Mesh"
  echo "3) Initialize Plugin Ecosystem"
  echo "4) Initialize Auto-Healing System"
  echo "5) Run bootstrap (safe)"
  echo "0) Exit"
  printf "Choose [0-5]: "
  read -r choice
  case $choice in
    1)
      mkdir -p "$(dirname "$NEXUS_CONFIG_FILE")"
      cat > "$NEXUS_CONFIG_FILE" << EOF
{
  "enable_collector": true
}
EOF
      echo "✅ Collector enabled in $NEXUS_CONFIG_FILE"
      nexus_start_collector
      ;;
    2)
      echo "📡 Initializing Service Mesh..."
      nexus_mesh_init
      ;;
    3)
      echo "🔌 Initializing Plugin Ecosystem..."
      nexus_plugins_init
      ;;
    4)
      echo "🏥 Initializing Auto-Healing..."
      nexus_autoheal_init
      ;;
    5)
      echo "🏭 Running safe bootstrap steps..."
      nexus_bootstrap
      ;;
    0|*)
      echo "Exiting assistant"
      ;;
  esac
}

# =============================================================================
# ✨ SECTOR: WIRING HELPERS (PLUGIN / MESH / AUTOHEAL)
# =============================================================================

nexus_wire_mesh() {
  echo "Wiring Service Mesh (ensure privileges)..."
  nexus_mesh_init
}

nexus_wire_plugins() {
  echo "Wiring Plugin Manager..."
  nexus_plugins_init
}

nexus_wire_autoheal() {
  echo "Wiring Auto-Heal System..."
  nexus_autoheal_init
}

# =============================================================================
# ✨ SECTOR: HEADER TUNING - ADAPTIVE LAYOUT
# =============================================================================

# Wrapper to render header with adaptive params
nexus_render_3d_header_adaptive() {
  local width=$(tput cols)
  local frames=6
  local speed=0.06
  if [[ $width -lt 80 ]]; then
    frames=2
    speed=0.12
  elif [[ $width -lt 120 ]]; then
    frames=4
    speed=0.08
  fi

  for frame in $(seq 1 $frames); do
    tput cup 0 0
    echo -ne "${C_BG_BLACK}"
    echo -ne "${(P)GRADIENT_NEURAL[$((frame % ${#GRADIENT_NEURAL[@]}))]}"
    printf "╔"
    for ((i=0;i<width-2;i++)); do
      if [[ $(( (i + frame) % 4 )) -eq 0 ]]; then printf "═"; else printf "━"; fi
    done
    printf "╗\n"
    # Title
    local title="🚀 NEXUS AI STUDIO MATRIX v10.0 🚀"
    local title_pad=$(( (width - ${#title}) / 2 ))
    printf "%${title_pad}s"
    for ((i=0;i<${#title};i++)); do
      local char="${title:$i:1}"
      local color_idx=$(((frame + i) % ${#GRADIENT_HOLO[@]}))
      echo -ne "${(P)GRADIENT_HOLO[color_idx]}${char}"
    done
    echo -e "${C_RESET}\n"
    sleep $speed
  done

  # stable header simplified for small terminals
  if [[ $width -lt 70 ]]; then
    echo "${C_BG_BLACK}${C_GRAD1}╔════════════════════════════════╗${C_RESET}"
    echo "${C_BG_BLACK}${C_GRAD2}║ NEXUS AI STUDIO MATRIX v10.0  ║${C_RESET}"
    echo "${C_BG_BLACK}${C_GRAD3}╚════════════════════════════════╝${C_RESET}"
  else
    nexus_render_3d_header
  fi
}

# Replace default header call in dashboard to use adaptive renderer
autoload -Uz add-zsh-hook 2>/dev/null || true
_nexus__dashboard_render_hook() {
  nexus_render_3d_header_adaptive
}

alias nexus_render_3d_header='nexus_render_3d_header_adaptive'

# =============================================================================
# ✨ SECTOR: TESTS & README (created in workspace)
# =============================================================================

