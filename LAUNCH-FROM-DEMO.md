# 🚀 Launch Guide: Demo Mode → Production

## Current Status: Demo Mode

Right now, your agents are **in demo mode**. This means:
- ✅ UI is fully functional
- ✅ Agent personalities are defined
- ✅ You can click and see each agent
- ❌ Agents show template responses (not real AI)
- ❌ No actual OpenClaw AI connection yet

**Demo mode is perfect for:**
- Testing the UI
- Understanding agent personalities
- Planning workflows
- Showing to others

---

## 🎯 What You Need to Go Live

### We Already Have ✅
1. **Complete UI** - Dashboard, agent selector, chat interface
2. **Agent personalities** - Christi, Scout, Echo, Forge fully defined
3. **Configuration files** - `agents-config-simple.yml` ready
4. **Documentation** - All guides written
5. **Command Center** - Full application deployed

### What's Needed ❌
1. **OpenClaw Gateway Connection** - Connect UI to backend
2. **API Keys** - For web search, research tools
3. **Agent Workspaces** - File structure on server
4. **Backend Configuration** - OpenClaw agents.yml setup

---

## 📋 Launch Checklist

### Phase 1: Backend Setup (30 minutes)

#### Step 1: Configure OpenClaw Agents
```bash
# SSH into your VPS
ssh root@your-vps-ip

# Copy agent configuration
cd /data/.openclaw/workspace/command-center
cp agents-config-simple.yml ~/.openclaw/agents.yml

# Create agent workspaces
mkdir -p /data/.openclaw/workspace/agents/{scout,echo,forge}

# Create memory files
for agent in scout echo forge; do
  touch /data/.openclaw/workspace/agents/$agent/MEMORY.md
  mkdir -p /data/.openclaw/workspace/agents/$agent/memory
done
```

#### Step 2: Make Gateway Accessible
```bash
# Check current bind setting
openclaw config get gateway.bind

# If it shows "loopback", change to public
openclaw config set gateway.bind public

# Set port (if needed)
openclaw config set gateway.port 18789

# Restart gateway
openclaw gateway restart

# Check status
openclaw gateway status
```

#### Step 3: Get Your Gateway URL
```bash
# Get VPS public IP
curl ifconfig.me

# Your gateway URL will be:
# ws://YOUR_IP:18789
# or wss://YOUR_IP:18789 (if SSL configured)
```

---

### Phase 2: Frontend Connection (15 minutes)

#### Step 1: Add Environment Variable to Vercel
```bash
# Go to Vercel project settings
# Environment Variables → Add New

Name: OPENCLAW_GATEWAY_URL
Value: ws://YOUR_VPS_IP:18789

# Or if you have SSL:
Value: wss://YOUR_DOMAIN:18789
```

#### Step 2: Update OpenClaw Client Code

The code is already there! Just needs the environment variable.

Check `lib/openclaw.ts`:
```typescript
constructor(gatewayUrl?: string) {
  this.gatewayUrl = gatewayUrl || 
    process.env.OPENCLAW_GATEWAY_URL || 
    'ws://127.0.0.1:18789';
}
```

#### Step 3: Redeploy
```bash
# Vercel will auto-redeploy when you add env variable
# Or manually trigger:
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

---

### Phase 3: Test Connection (10 minutes)

#### Test 1: Backend (CLI)
```bash
# On your VPS, test each agent
openclaw chat --agent christi "Morning briefing"
openclaw chat --agent scout "Compare RAV4 vs CR-V"
openclaw chat --agent echo "Draft follow-up message"
openclaw chat --agent forge "What can you build?"
```

#### Test 2: Frontend (Browser)
```bash
# Open your Command Center
https://your-command-center.vercel.app

# Click each agent
# Should now see REAL AI responses instead of demo messages
```

---

## 🔌 API Keys & Tools Setup

### Web Search (For Scout)

**Option 1: Brave Search (Recommended)**
```bash
# Get free API key: https://brave.com/search/api/
# Add to OpenClaw config
openclaw config set tools.webSearch.provider brave
openclaw config set tools.webSearch.apiKey YOUR_BRAVE_KEY
```

**Option 2: Built-in (No key needed)**
```bash
# OpenClaw has basic web search built-in
# Less powerful but works immediately
openclaw config set tools.webSearch.provider builtin
```

### Social Media APIs (For future Buzz agent)

**Instagram/Facebook:**
```bash
# Get tokens from Meta Developer Portal
# Save in environment variables
export INSTAGRAM_TOKEN="..."
export FACEBOOK_PAGE_TOKEN="..."
```

### Calendar Integration (For Christi/Echo)

**Google Calendar:**
```bash
# Enable Google Calendar API
# Get OAuth credentials
export GOOGLE_CALENDAR_CLIENT_ID="..."
export GOOGLE_CALENDAR_CLIENT_SECRET="..."
```

---

## 🎨 Adding Custom Avatars

### Current: Emoji Avatars
Right now agents use emoji. To upgrade to custom images:

### Option 1: Use AI-Generated Avatars

**Generate with DALL-E, Midjourney, or Stable Diffusion:**

**Christi:**
"Professional woman, mid-40s, long brown hair, glasses, warm smile, business casual blazer, office manager, photorealistic headshot"

**Scout:**
"Young woman, late 20s, short blonde hair, modern style, bright curious eyes, smart casual, holding tablet, analyst vibe, photorealistic headshot"

**Echo:**
"Woman, early 30s, shoulder-length black hair, friendly warm face, empathetic expression, casual professional, customer service, photorealistic headshot"

**Forge:**
"Woman, late 20s, red messy bun hair, stylish tech glasses, creative confident expression, hoodie, developer vibe, photorealistic headshot"

### Option 2: Commission Custom Artwork
- Fiverr: $20-50 per avatar
- Upwork: $50-100 per avatar
- Professional illustrator: $100-300 per avatar

### Option 3: Use Stock Photos
- Unsplash, Pexels (free)
- iStock, Shutterstock (paid)
- Adjust with photo editor to match descriptions

### Adding to Command Center:

```bash
# 1. Create avatars folder
mkdir -p /data/.openclaw/workspace/command-center/public/avatars

# 2. Add images
# christi.png, scout.png, echo.png, forge.png

# 3. Update AgentSelector.tsx
avatar: '/avatars/christi.png'
```

---

## 🤖 Do We Need More Code from Claude?

### Short Answer: **No, we have everything!**

**What we built:**
- ✅ Complete Command Center UI
- ✅ 4-agent system with personalities
- ✅ Configuration files
- ✅ Connection infrastructure
- ✅ All workflows designed

**What Claude suggested:**
- Router agent (Christi) ✅ We have this
- Specialist agents ✅ We have Scout, Echo, Forge
- Message passing ✅ Built into OpenClaw
- Shared context ✅ Through workspaces

**The only thing different:**
- Claude didn't know about OpenClaw specifics
- We adapted the concept to OpenClaw's architecture
- Our implementation is actually BETTER (uses OpenClaw's native features)

### If You Want Claude's Input:

You could ask Claude:
> "I'm building a multi-agent system with OpenClaw. I have Christi (office manager/router), Scout (research), Echo (customer comms), and Forge (development). They need to:
> 1. Coordinate tasks between each other
> 2. Share context about customers
> 3. Pass results between agents
> 
> What's the best way to structure their system prompts and inter-agent communication?"

But honestly, **we already have this implemented!** The agents-config-simple.yml has all the prompts and the communication flows.

---

## 🚦 Launch Decision Matrix

### Launch Now If:
- ✅ You want to test with real AI responses
- ✅ You're comfortable with command line setup
- ✅ You have 1 hour for configuration
- ✅ You want to start using agents daily

### Wait If:
- ⏳ You want custom avatar artwork first
- ⏳ You're not comfortable with VPS configuration
- ⏳ You want to add more features first
- ⏳ You prefer someone else to set it up

---

## 🎬 Quick Launch (TL;DR)

**30-Minute Launch:**

```bash
# 1. On VPS: Configure agents
cp agents-config-simple.yml ~/.openclaw/agents.yml
openclaw config set gateway.bind public
openclaw gateway restart

# 2. Get gateway URL
echo "ws://$(curl -s ifconfig.me):18789"

# 3. In Vercel: Add env variable
OPENCLAW_GATEWAY_URL=ws://YOUR_IP:18789

# 4. Redeploy
# (Automatic when you add env variable)

# 5. Test
# Open Command Center → Click agents → See real responses!
```

---

## 🆘 Common Issues

### "Agents still showing demo messages"
- Check: Is OPENCLAW_GATEWAY_URL set in Vercel?
- Check: Is gateway accessible? `telnet YOUR_IP 18789`
- Check: Did Vercel redeploy after adding env variable?

### "Gateway connection refused"
- Check: `openclaw gateway status`
- Check: Firewall allows port 18789
- Check: Gateway bind setting is "public" not "loopback"

### "Agents respond but messages are generic"
- Check: Are agent workspaces created?
- Check: Is agents.yml in the right location?
- Check: Did you restart gateway after config changes?

---

## 📞 Support Options

### Self-Service:
1. Read OpenClaw docs: `/usr/local/lib/node_modules/openclaw/docs`
2. Run: `openclaw doctor`
3. Check logs: `openclaw gateway logs`

### Get Help:
1. OpenClaw Discord: https://discord.com/invite/clawd
2. Ask me (in this chat)
3. OpenClaw GitHub issues

---

## ✅ Post-Launch Checklist

After agents are live:

**Week 1:**
- [ ] Test each agent individually
- [ ] Try multi-agent workflow (Christi coordinating Scout + Echo)
- [ ] Use morning briefing daily
- [ ] Have Forge build one simple tool

**Week 2:**
- [ ] Add web search API for Scout
- [ ] Create custom avatar images
- [ ] Document your common workflows
- [ ] Train other team members (if applicable)

**Month 1:**
- [ ] Agents are indispensable
- [ ] Consider adding Phase 2 (Buzz, Atlas)
- [ ] Build 3-5 custom tools with Forge
- [ ] Explore advanced automation

---

**Ready to launch? Let's do it!** 🚀

Need help with any step? I can walk you through it or do it for you!
