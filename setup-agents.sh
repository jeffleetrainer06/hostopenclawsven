#!/bin/bash

# Agent Team Setup Wizard
# Helps configure your 6-agent team with personalities and tools

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║  🦞 Agent Team Setup Wizard           ║"
echo "║  Configure your 6-agent team          ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Check if OpenClaw is installed
if ! command -v openclaw &> /dev/null; then
    echo -e "${YELLOW}⚠️  OpenClaw not found in PATH${NC}"
    echo "Make sure OpenClaw is installed and accessible"
    exit 1
fi

echo -e "${GREEN}✓${NC} OpenClaw found"

# Create agent workspaces
echo ""
echo "📁 Creating agent workspaces..."

WORKSPACE_ROOT="/data/.openclaw/workspace"
AGENTS_DIR="${WORKSPACE_ROOT}/agents"

for agent in scout buzz echo atlas forge; do
    AGENT_DIR="${AGENTS_DIR}/${agent}"
    if [ ! -d "$AGENT_DIR" ]; then
        mkdir -p "$AGENT_DIR"
        echo -e "${GREEN}✓${NC} Created workspace for ${agent}"
    else
        echo -e "${BLUE}ℹ${NC} Workspace exists for ${agent}"
    fi
    
    # Create memory file
    if [ ! -f "${AGENT_DIR}/MEMORY.md" ]; then
        touch "${AGENT_DIR}/MEMORY.md"
        echo -e "${GREEN}✓${NC} Created MEMORY.md for ${agent}"
    fi
    
    # Create memory directory
    mkdir -p "${AGENT_DIR}/memory"
done

# Copy SOUL files from command-center if they exist
echo ""
echo "📝 Setting up agent personalities..."

SOULS_SOURCE="${WORKSPACE_ROOT}/command-center/agents"
if [ -d "$SOULS_SOURCE" ]; then
    for agent in scout buzz echo atlas forge; do
        if [ -f "${SOULS_SOURCE}/${agent}/SOUL.md" ]; then
            cp "${SOULS_SOURCE}/${agent}/SOUL.md" "${AGENTS_DIR}/${agent}/"
            echo -e "${GREEN}✓${NC} Copied SOUL.md for ${agent}"
        fi
    done
fi

# Create agents.yml configuration
echo ""
echo "⚙️  Creating agent configuration..."

AGENTS_CONFIG="$HOME/.openclaw/agents.yml"

cat > "${AGENTS_CONFIG}" << 'EOF'
# OpenClaw Agent Team Configuration
# Jeff Lee's Command Center

agents:
  defaults:
    model: anthropic/claude-sonnet-4-5
    thinking: low
    tools:
      - memory_search
      - memory_get
      - read
      - write
    
  list:
    # Main coordinator
    - id: sven
      name: Sven
      emoji: 🦞
      model: anthropic/claude-sonnet-4-5
      default: true
      workspace: /data/.openclaw/workspace
      tools:
        - sessions_send
        - sessions_spawn
        - subagents
        - web_search
        - exec
      
    # Research specialist
    - id: scout
      name: Scout
      emoji: 🔍
      model: anthropic/claude-sonnet-4-5
      workspace: /data/.openclaw/workspace/agents/scout
      tools:
        - web_search
        - web_fetch
        - read
        - write
    
    # Social media specialist
    - id: buzz
      name: Buzz
      emoji: 📱
      model: anthropic/claude-haiku-4-5
      workspace: /data/.openclaw/workspace/agents/buzz
      tools:
        - web_search
        - read
        - write
    
    # Customer communications
    - id: echo
      name: Echo
      emoji: 💬
      model: anthropic/claude-haiku-4-5
      workspace: /data/.openclaw/workspace/agents/echo
      tools:
        - read
        - write
        - sessions_send
    
    # Analytics specialist
    - id: atlas
      name: Atlas
      emoji: 📊
      model: anthropic/claude-opus-4-6
      workspace: /data/.openclaw/workspace/agents/atlas
      tools:
        - read
        - exec
    
    # Development specialist
    - id: forge
      name: Forge
      emoji: 🔨
      model: anthropic/claude-sonnet-4-5
      workspace: /data/.openclaw/workspace/agents/forge
      tools:
        - read
        - write
        - exec
        - web_search
EOF

echo -e "${GREEN}✓${NC} Created ${AGENTS_CONFIG}"

# Test agent access
echo ""
echo "🧪 Testing agent configuration..."

if openclaw agents list &> /dev/null; then
    echo -e "${GREEN}✓${NC} Agent configuration valid"
    openclaw agents list
else
    echo -e "${YELLOW}⚠️  Could not verify agent list (OpenClaw may need restart)${NC}"
fi

# Summary
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✓ Agent Team Setup Complete!        ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
echo ""
echo "Your 6-agent team is configured:"
echo "  🦞 Sven  - Main coordinator"
echo "  🔍 Scout - Research specialist"
echo "  📱 Buzz  - Social media creator"
echo "  💬 Echo  - Customer communications"
echo "  📊 Atlas - Analytics expert"
echo "  🔨 Forge - Development specialist"
echo ""
echo "Next steps:"
echo "  1. Restart OpenClaw gateway:"
echo "     ${BLUE}openclaw gateway restart${NC}"
echo ""
echo "  2. Test each agent:"
echo "     ${BLUE}openclaw chat --agent scout 'Compare RAV4 vs CR-V'${NC}"
echo "     ${BLUE}openclaw chat --agent buzz 'Give me 3 post ideas'${NC}"
echo "     ${BLUE}openclaw chat --agent echo 'Draft a follow-up message'${NC}"
echo ""
echo "  3. View full setup guide:"
echo "     ${BLUE}cat /data/.openclaw/workspace/AGENT-TOOL-SETUP.md${NC}"
echo ""
echo "Documentation:"
echo "  • Personalities: AGENT-PERSONALITIES.md"
echo "  • Tool setup:    AGENT-TOOL-SETUP.md"
echo "  • Team guide:    AGENT-TEAM-SETUP.md"
echo ""
