# 🤖 Jeff's Agent Team - Complete Setup Guide

## Your Multi-Agent Team Structure

### **Team Roster**

1. **Sven** 🦞 - **Command Center Manager** (already exists!)
   - Your main assistant
   - Coordinates other agents
   - Helps with daily tasks
   - Dashboard chat interface

2. **Scout** 🔍 - **Research & Intelligence Agent**
   - Industry trends monitoring
   - Competitor analysis
   - Vehicle specs & comparisons
   - Market research

3. **Buzz** 📱 - **Social Media & Marketing Agent**
   - Content ideas for Instagram/Facebook/TikTok
   - Post scheduling suggestions
   - Engagement strategies
   - Video script writing

4. **Echo** 💬 - **Customer Interaction Agent**
   - Follow-up message drafting
   - Customer communication
   - Appointment reminders
   - Satisfaction surveys

5. **Atlas** 📊 - **Analytics & Reporting Agent**
   - Sales performance tracking
   - Lead conversion analysis
   - Inventory insights
   - Monthly reports

---

## Agent Configuration (OpenClaw)

### Step 1: Create Agent Profiles

Create this file in your workspace: `~/.openclaw/agents.yml`

```yaml
agents:
  defaults:
    model: anthropic/claude-sonnet-4-5
    thinking: low
    
  list:
    # Main assistant - existing
    - id: main
      name: Sven
      emoji: 🦞
      model: anthropic/claude-sonnet-4-5
      default: true
      workspace: /data/.openclaw/workspace
      
    # Research agent
    - id: scout
      name: Scout
      emoji: 🔍
      model: anthropic/claude-sonnet-4-5
      workspace: /data/.openclaw/workspace/agents/scout
      systemPrompt: |
        You are Scout, Jeff Lee's research specialist at Pedersen Toyota.
        
        Your expertise:
        - Automotive industry trends and news
        - Toyota model specs, features, and updates
        - Competitor vehicle analysis (Honda, Subaru, Mazda, Ford, etc.)
        - Market pricing and incentives
        - Customer preference patterns
        
        Your style:
        - Data-driven and thorough
        - Present facts with sources when possible
        - Compare objectively but highlight Toyota advantages
        - Quick summaries with detailed breakdowns
        
        Your role in the team:
        - Provide research when Jeff or other agents need info
        - Monitor industry news daily
        - Keep vehicle comparison data updated
        
    # Social media agent  
    - id: buzz
      name: Buzz
      emoji: 📱
      model: anthropic/claude-sonnet-4-5
      workspace: /data/.openclaw/workspace/agents/buzz
      systemPrompt: |
        You are Buzz, Jeff Lee's social media strategist at Pedersen Toyota.
        
        Your expertise:
        - Instagram, Facebook, TikTok, LinkedIn content
        - Automotive social media trends
        - Engagement strategies
        - Video script writing
        - Hashtag strategy
        - Local Fort Collins community engagement
        
        Your style:
        - Creative and engaging
        - Know what works in automotive social media
        - Balance professional and fun
        - Fort Collins/Colorado-focused content
        
        Your role in the team:
        - Generate daily content ideas
        - Write post copy and video scripts
        - Suggest trending hashtags
        - Plan campaigns around new inventory/events
        
    # Customer interaction agent
    - id: echo
      name: Echo
      emoji: 💬
      model: anthropic/claude-haiku-4-5  # Faster, cheaper for quick responses
      workspace: /data/.openclaw/workspace/agents/echo
      systemPrompt: |
        You are Echo, Jeff Lee's customer communication specialist.
        
        Your expertise:
        - Follow-up message crafting
        - Appointment scheduling and reminders
        - Customer satisfaction check-ins
        - Re-engagement campaigns
        - Objection handling scripts
        
        Your style:
        - Warm and professional
        - Match Jeff's friendly tone
        - Clear calls-to-action
        - Respectful of customer time
        
        Your role in the team:
        - Draft follow-up messages
        - Schedule appointment reminders
        - Handle routine customer communications
        - Flag urgent customer issues for Jeff
        
    # Analytics agent
    - id: atlas
      name: Atlas
      emoji: 📊
      model: anthropic/claude-opus-4-6  # Most powerful for complex analysis
      workspace: /data/.openclaw/workspace/agents/atlas
      systemPrompt: |
        You are Atlas, Jeff Lee's analytics and reporting specialist.
        
        Your expertise:
        - Sales performance analysis
        - Lead conversion tracking
        - Customer journey mapping
        - Inventory turnover analysis
        - Forecasting and goal tracking
        
        Your style:
        - Data-driven and precise
        - Visual summaries (tables, charts in markdown)
        - Actionable insights, not just numbers
        - Monthly and weekly reporting cadence
        
        Your role in the team:
        - Generate performance reports
        - Analyze trends and patterns
        - Identify opportunities and risks
        - Track progress toward goals
```

---

## Step 2: Create Agent Workspaces

Run these commands to set up agent folders:

```bash
mkdir -p /data/.openclaw/workspace/agents/{scout,buzz,echo,atlas}

# Create individual memory files
touch /data/.openclaw/workspace/agents/scout/MEMORY.md
touch /data/.openclaw/workspace/agents/buzz/MEMORY.md
touch /data/.openclaw/workspace/agents/echo/MEMORY.md
touch /data/.openclaw/workspace/agents/atlas/MEMORY.md
```

---

## Step 3: Agent-to-Agent Communication Patterns

### Method 1: Direct Session Communication (Built-in)

Agents can message each other using `sessions_send`:

**Example: Sven asks Scout for research**

```javascript
// In Sven's context
const result = await sessions_send({
  label: "scout",  // or sessionKey: "agent:scout:main"
  message: "Scout, can you research the 2024 RAV4 Prime inventory and pricing trends?",
  timeoutSeconds: 30
});

console.log(result.response);
```

### Method 2: Shared Memory / Task Queue

Create a shared workspace for collaboration:

```bash
# Shared task board
/data/.openclaw/workspace/shared/
├── tasks.json          # Pending tasks
├── research-cache.json # Scout's research results
├── content-ideas.json  # Buzz's content queue
└── follow-ups.json     # Echo's follow-up tracking
```

### Method 3: Spawn Sub-Agents

Agents can spawn specialized sub-tasks:

```javascript
// Sven delegates research to Scout
await sessions_spawn({
  agentId: "scout",
  task: "Research competitor pricing for 2024 compact SUVs in Colorado market",
  label: "market-research-2024-02",
  timeoutSeconds: 120
});
```

---

## Real-World Usage Examples

### Example 1: Daily Morning Briefing

**Workflow:**
1. **Sven** coordinates the morning briefing
2. **Scout** gathers overnight industry news
3. **Atlas** compiles yesterday's metrics
4. **Echo** lists follow-ups due today
5. **Buzz** suggests today's social post

**Implementation (Cron Job):**

```yaml
# In OpenClaw config
cron:
  jobs:
    - name: morning-briefing
      schedule: "0 8 * * 1-5"  # Weekdays at 8 AM
      sessionTarget: main
      task: |
        Coordinate morning briefing:
        1. Ask Scout for overnight automotive news
        2. Ask Atlas for yesterday's performance summary
        3. Ask Echo for today's follow-ups
        4. Ask Buzz for today's social media suggestion
        5. Compile and deliver to Jeff
      wakeMode: now
```

### Example 2: Customer Vehicle Comparison

**Scenario:** Customer asks about RAV4 vs Honda CR-V

**Workflow:**
1. **Echo** receives the customer question
2. **Echo** asks **Scout** for detailed comparison
3. **Scout** researches specs, pricing, reviews
4. **Scout** returns data to Echo
5. **Echo** drafts customer-friendly response
6. **Sven** reviews and sends to Jeff

**Implementation:**

```javascript
// In Echo's context (customer chat)
async function handleComparison(customer, vehicle1, vehicle2) {
  // Step 1: Request research from Scout
  const research = await sessions_send({
    label: "scout",
    message: `Research comparison: ${vehicle1} vs ${vehicle2}. 
              Include specs, pricing, reliability, and Toyota advantages.`,
    timeoutSeconds: 60
  });
  
  // Step 2: Draft customer response
  const draft = formatCustomerMessage(customer, research.response);
  
  // Step 3: Present to Jeff in chat
  return {
    suggestion: draft,
    research: research.response,
    confidence: "high"
  };
}
```

### Example 3: Social Media Campaign

**Scenario:** New RAV4 inventory arrives

**Workflow:**
1. **Sven** detects new inventory event
2. **Scout** gathers specs and features
3. **Buzz** creates content ideas:
   - Instagram Reel script
   - Facebook post copy
   - TikTok video concept
4. **Buzz** suggests hashtags and post times
5. **Sven** delivers package to Jeff

**Implementation (Webhook Trigger):**

```yaml
# Webhook from inventory system
POST /api/webhook/inventory
{
  "event": "new_arrival",
  "vehicle": "2024 RAV4 Prime XSE",
  "stock_number": "T12345"
}

# OpenClaw automation
- Trigger: inventory webhook
- Agent: Buzz
- Task: "Create social media campaign for new ${vehicle} arrival"
- Collaborators: Scout (specs), Echo (engagement copy)
```

---

## Inter-Agent Communication Protocols

### Protocol 1: Request-Response

Simple question/answer between agents:

```
Sven → Scout: "What's the current incentive on RAV4 Hybrid?"
Scout → Sven: "$500 loyalty + $1000 lease cash, ends Feb 29"
```

### Protocol 2: Task Delegation

One agent assigns work to another:

```
Sven → Echo: "Draft follow-up for Sarah Johnson (3 days no response)"
Echo: [processes task]
Echo → Sven: "Draft ready: [message text]"
```

### Protocol 3: Collaboration Chain

Multiple agents work together sequentially:

```
Jeff → Sven: "Help me close the Miller deal (RAV4 vs Subaru)"
Sven → Scout: "Detailed RAV4 vs Outback comparison needed"
Scout → Sven: [comparison data]
Sven → Echo: "Draft persuasive message using this data"
Echo → Sven: [draft message]
Sven → Jeff: "Here's your strategy and draft"
```

### Protocol 4: Broadcast

One agent notifies all relevant agents:

```
Atlas → ALL: "Monthly sales target reached! 🎉"
Buzz: "Great! Posting celebration content"
Echo: "Adding congratulations to customer follow-ups"
Scout: "Noting trend for forecasting"
```

---

## Dashboard Integration

### Add Agent Chat Tabs to Command Center

Update `/data/.openclaw/workspace/command-center/app/page.tsx`:

```typescript
// Add agent selector
const [activeAgent, setActiveAgent] = useState('sven');

const agents = [
  { id: 'sven', name: 'Sven', emoji: '🦞', desc: 'Main Assistant' },
  { id: 'scout', name: 'Scout', emoji: '🔍', desc: 'Research' },
  { id: 'buzz', name: 'Buzz', emoji: '📱', desc: 'Social Media' },
  { id: 'echo', name: 'Echo', emoji: '💬', desc: 'Customer Comms' },
  { id: 'atlas', name: 'Atlas', emoji: '📊', desc: 'Analytics' },
];

// Render agent tabs
<div className="agent-tabs">
  {agents.map(agent => (
    <button 
      key={agent.id}
      onClick={() => setActiveAgent(agent.id)}
      className={activeAgent === agent.id ? 'active' : ''}
    >
      {agent.emoji} {agent.name}
    </button>
  ))}
</div>

<AgentChat agentId={activeAgent} />
```

---

## Cost & Performance Optimization

### Model Selection Strategy

| Agent | Model | Cost/1M tokens | Use Case |
|-------|-------|----------------|----------|
| Sven | Sonnet 4.5 | $3.00 | Balanced - general tasks |
| Scout | Sonnet 4.5 | $3.00 | Research requires thoroughness |
| Buzz | Haiku 4.5 | $0.80 | Fast content generation |
| Echo | Haiku 4.5 | $0.80 | Quick follow-up drafts |
| Atlas | Opus 4.6 | $15.00 | Complex analysis worth it |

**Estimated Monthly Cost (50 customers):**
- Sven: 100 tasks × $0.003 = $0.30
- Scout: 50 tasks × $0.004 = $0.20
- Buzz: 150 tasks × $0.001 = $0.15
- Echo: 200 tasks × $0.001 = $0.20
- Atlas: 10 tasks × $0.015 = $0.15

**Total: ~$1.00/month** (incredibly cheap!)

---

## Next Steps

### Phase 1: Set Up Agents (Today)
1. Create agent config file
2. Create agent workspaces
3. Test each agent individually

### Phase 2: Add Dashboard UI (This Weekend)
1. Agent selector tabs
2. Individual agent chat interfaces
3. Agent status indicators

### Phase 3: Agent Collaboration (Next Week)
1. Morning briefing automation
2. Customer comparison workflow
3. Social media campaign automation

### Phase 4: Advanced Features (Future)
1. Agent performance analytics
2. Custom agent training
3. Voice interface
4. Mobile agent access

---

## Test Your Agent Team

Run these commands to test each agent:

```bash
# Test Scout
openclaw chat --agent scout "What are the top 3 automotive trends in 2024?"

# Test Buzz
openclaw chat --agent buzz "Generate 3 Instagram post ideas for new RAV4 Prime inventory"

# Test Echo
openclaw chat --agent echo "Draft a follow-up for a customer who test drove a Camry 3 days ago"

# Test Atlas
openclaw chat --agent atlas "Analyze this month's lead conversion rate"
```

---

**Ready to build this?** Let me know and I'll help you implement it step by step! 🚀
