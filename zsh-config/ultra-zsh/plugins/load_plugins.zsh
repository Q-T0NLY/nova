#!/usr/bin/env zsh
# Plugin System

: "${PLUGIN_DIR:=${HOME}/.config/ultra-zsh/plugins}"

load_plugins() {
    for plugin in "${PLUGIN_DIR}"/*.zsh; do
        [[ -f "${plugin}" ]] && source "${plugin}"
    done
}

# Auto-load plugins
load_plugins

