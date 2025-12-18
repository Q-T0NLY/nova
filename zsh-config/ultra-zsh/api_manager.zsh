#!/usr/bin/env zsh
# 🔒 NEXUS API MANAGER & SECURE CONFIGURATION v6.1

# Ensure nexus home exists
: ${NEXUS_HOME:=$HOME/.nexus}
export NEXUS_API_CONFIG="$NEXUS_HOME/config/api_keys.conf"
mkdir -p "$(dirname "$NEXUS_API_CONFIG")"

# Ensure the config file exists and is secure (Read/Write for owner only)
if [[ ! -f "$NEXUS_API_CONFIG" ]]; then
  touch "$NEXUS_API_CONFIG"
  chmod 600 "$NEXUS_API_CONFIG"
fi

nexus_api_set_key() {
  local service_name="$1"
  local key_value="$2"
  # Remove existing key entry if present
  if [[ -f "$NEXUS_API_CONFIG" ]]; then
    grep -v "^${service_name}=" "$NEXUS_API_CONFIG" > "${NEXUS_API_CONFIG}.tmp" 2>/dev/null || true
    mv "${NEXUS_API_CONFIG}.tmp" "$NEXUS_API_CONFIG" 2>/dev/null || true
  fi
  # Append the new key
  echo "${service_name}=${key_value}" >> "$NEXUS_API_CONFIG"
  chmod 600 "$NEXUS_API_CONFIG"
  echo -e "${C_GREEN}✅ API Key for ${service_name} stored securely.${C_RESET}"
}

nexus_api_get_key() {
  local service_name="$1"
  local key=""
  if [[ -f "$NEXUS_API_CONFIG" ]]; then
    key=$(grep "^${service_name}=" "$NEXUS_API_CONFIG" | tail -1 | cut -d '=' -f2-)
  fi
  echo "$key"
}

# Gateway called before launching services that need API keys
nexus_api_gateway() {
  local service_name="$1"
  local prompt_text="$2"
  local key
  key=$(nexus_api_get_key "$service_name")
  if [[ -z "$key" ]]; then
    echo -e "\n${C_YELLOW} API Key Required: ${prompt_text}${C_RESET}"
    printf "${C_BOLD}${C_CYAN}Enter Key for ${service_name} (sk-... or similar): ${C_RESET}"
    read -r new_key
    if [[ -z "$new_key" ]]; then
      echo -e "${C_RED}❌ Key entry cancelled. Service ${service_name} cannot launch.${C_RESET}"
      return 1
    fi
    # Basic validation (prefix checks)
    if [[ "$new_key" =~ ^sk- || "$new_key" =~ ^AIza || "$new_key" =~ ^ya29\. ]]; then
      nexus_api_set_key "$service_name" "$new_key"
      export ${(U)service_name}_KEY="$new_key"
      return 0
    else
      echo -e "${C_RED}❌ Invalid key format. Key not stored. Please try again.${C_RESET}"
      return 1
    fi
  else
    echo -e "${C_GREEN}✅ Key for ${service_name} found. Propagating to environment...${C_RESET}"
    # Export a safe env var name
    export ${(U)service_name}_KEY="$key"
    return 0
  fi
}

# ULTRA-ADVANCED TOOL DETECTION ENGINE
nexus_detect_tools() {
  local missing=()
  local critical_tools=(curl jq)
  local optional_tools=(docker kubectl python3 node git terraform aws gcloud az)
  local gpu_tools=(nvidia-smi hip-smi)
  local ml_frameworks=(conda pip npm pip3)
  
  # Check critical tools
  for t in ${critical_tools[@]}; do
    if ! command -v $t &>/dev/null; then
      missing+=($t)
    fi
  done
  
  if (( ${#missing[@]} > 0 )); then
    echo -e "${C_RED}Missing required tools: ${missing[*]}. Please install them.${C_RESET}"
    return 1
  fi
  
  # Advanced detection: build capability matrix
  export NEXUS_TOOL_MATRIX=()
  
  # Docker/Container detection
  if command -v docker &>/dev/null; then
    export NEXUS_HAS_DOCKER=true
    export NEXUS_DOCKER_VERSION=$(docker version --format '{{.Server.Version}}' 2>/dev/null)
    NEXUS_TOOL_MATRIX+=(docker)
  fi
  if command -v podman &>/dev/null; then
    export NEXUS_HAS_PODMAN=true
    NEXUS_TOOL_MATRIX+=(podman)
  fi
  
  # Kubernetes detection
  if command -v kubectl &>/dev/null; then
    export NEXUS_HAS_KUBECTL=true
    export NEXUS_K8S_CONTEXT=$(kubectl config current-context 2>/dev/null)
    NEXUS_TOOL_MATRIX+=(kubernetes)
  fi
  
  # Python/ML framework detection
  if command -v python3 &>/dev/null; then
    export NEXUS_HAS_PYTHON3=true
    export NEXUS_PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
    # Check ML frameworks
    if python3 -c "import torch" 2>/dev/null; then
      export NEXUS_HAS_PYTORCH=true
      NEXUS_TOOL_MATRIX+=(pytorch)
    fi
    if python3 -c "import tensorflow" 2>/dev/null; then
      export NEXUS_HAS_TENSORFLOW=true
      NEXUS_TOOL_MATRIX+=(tensorflow)
    fi
    if python3 -c "import transformers" 2>/dev/null; then
      export NEXUS_HAS_TRANSFORMERS=true
      NEXUS_TOOL_MATRIX+=(transformers)
    fi
  fi
  
  # Node.js/npm detection
  if command -v node &>/dev/null; then
    export NEXUS_HAS_NODE=true
    export NEXUS_NODE_VERSION=$(node --version 2>/dev/null)
    NEXUS_TOOL_MATRIX+=(nodejs)
  fi
  if command -v npm &>/dev/null; then
    export NEXUS_HAS_NPM=true
    NEXUS_TOOL_MATRIX+=(npm)
  fi
  
  # Git detection
  if command -v git &>/dev/null; then
    export NEXUS_HAS_GIT=true
    export NEXUS_GIT_VERSION=$(git --version 2>/dev/null | awk '{print $3}')
    NEXUS_TOOL_MATRIX+=(git)
  fi
  
  # Cloud CLI detection
  if command -v aws &>/dev/null; then
    export NEXUS_HAS_AWS=true
    NEXUS_TOOL_MATRIX+=(aws)
  fi
  if command -v gcloud &>/dev/null; then
    export NEXUS_HAS_GCLOUD=true
    NEXUS_TOOL_MATRIX+=(gcp)
  fi
  if command -v az &>/dev/null; then
    export NEXUS_HAS_AZURE=true
    NEXUS_TOOL_MATRIX+=(azure)
  fi
  
  # GPU detection
  if command -v nvidia-smi &>/dev/null; then
    export NEXUS_HAS_GPU=true
    export NEXUS_GPU_TYPE="NVIDIA"
    export NEXUS_GPU_COUNT=$(nvidia-smi --list-gpus 2>/dev/null | wc -l)
    NEXUS_TOOL_MATRIX+=(gpu-nvidia)
  elif command -v rocm-smi &>/dev/null 2>/dev/null; then
    export NEXUS_HAS_GPU=true
    export NEXUS_GPU_TYPE="AMD"
    NEXUS_TOOL_MATRIX+=(gpu-amd)
  fi
  
  # IaC detection
  if command -v terraform &>/dev/null; then
    export NEXUS_HAS_TERRAFORM=true
    NEXUS_TOOL_MATRIX+=(terraform)
  fi
  if command -v ansible &>/dev/null; then
    export NEXUS_HAS_ANSIBLE=true
    NEXUS_TOOL_MATRIX+=(ansible)
  fi
  
  return 0
}

# Configuration menu for API keys + Webhooks
nexus_api_configuration_menu() {
  echo -e "${C_CYAN}${C_BOLD}NEXUS API CONFIGURATION${C_RESET}"
  echo "Available services:" 
  for svc in OPENAI DISCORD_WEBHOOK; do
    if [[ -n "$(nexus_api_get_key $svc)" ]]; then
      echo -e " - $svc: ${C_GREEN}CONFIGURED${C_RESET}"
    else
      echo -e " - $svc: ${C_ORANGE:-$C_YELLOW}NOT CONFIGURED${C_RESET}"
    fi
  done
  echo "\nA) Add/Update key or webhook  Q) Quit"
  printf "Choose: "
  read -r opt
  case $opt in
    A|a)
      printf "Service name (OPENAI or DISCORD_WEBHOOK): "
      read -r svc
      if [[ -z "$svc" ]]; then echo "Cancelled"; return 1; fi
      printf "Enter value for $svc: "
      read -r val
      if [[ -z "$val" ]]; then echo "Cancelled"; return 1; fi
      nexus_api_set_key "$svc" "$val"
      ;;
    *)
      return 0
      ;;
  esac
}

# Discord Webhook sender (embeds). Expects DISCORD_WEBHOOK stored via nexus_api_set_key
nexus_send_discord_webhook() {
  local message_content="$1"
  local title="$2"
  local color_hex=${3:-3066993}
  local webhook_url
  webhook_url=$(nexus_api_get_key 'DISCORD_WEBHOOK')
  if [[ -z "$webhook_url" ]]; then
    echo -e "${C_RED}❌ Discord Webhook URL not configured. Use nexus_api_configuration_menu to set DISCORD_WEBHOOK.${C_RESET}"
    return 1
  fi
  if ! command -v curl &> /dev/null; then
    echo -e "${C_RED}❌ 'curl' not found. Cannot send webhook.${C_RESET}"
    return 1
  fi
  local timestamp
  timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
  # Build JSON payload using jq for safe encoding (requires jq)
  local payload
  if command -v jq &>/dev/null; then
    payload=$(jq -n --arg title "$title" --arg description "$message_content" --arg timestamp "$timestamp" --arg footer "Nexus Hyper-Matrix @ ${HOSTNAME:-$(hostname)}" --arg color "$color_hex" '{embeds:[{title:$title,description:$description,color:($color|tonumber),timestamp:$timestamp,footer:{text:$footer}}]}')
  else
    # Fallback single-line payload (best-effort, may fail on complex content)
    payload="{\"embeds\":[{\"title\":\"${title}\",\"description\":\"${message_content}\",\"color\":${color_hex},\"timestamp\":\"${timestamp}\",\"footer\":{\"text\":\"Nexus Hyper-Matrix @ ${HOSTNAME:-$(hostname)}\"}}]}"
  fi

  curl -s -H "Content-Type: application/json" -d "$payload" "$webhook_url" >/dev/null 2>&1
  if [[ $? -eq 0 ]]; then
    echo -e "${C_GREEN}📡 Webhook sent to Discord successfully.${C_RESET}"
    return 0
  else
    echo -e "${C_RED}❌ Failed to send webhook. Check the webhook URL and network connectivity.${C_RESET}"
    return 2
  fi
}
