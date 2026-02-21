# Setup Guide - Jeff's Command Center

## ✅ What's Been Built

I've created the foundation for your Command Center with **model management** built-in. Here's what you have:

### Core Features
1. **Customer Management Database**
   - SQLite database for all customer data
   - Conversation history tracking
   - Follow-up system with due dates
   - Status tracking (inquiry, configuring, test drive, etc.)

2. **AI Integration Layer**
   - OpenClaw WebSocket client
   - Multi-model support (Haiku, Sonnet, Opus)
   - Usage tracking and cost estimation
   - Smart task-based model selection

3. **Model Management System**
   - Model selector component (compact & full)
   - Usage dashboard with cost analytics
   - Per-task model preferences
   - Automatic cost tracking

### Tech Stack
- Next.js 14 (React framework)
- TypeScript (type safety)
- Tailwind CSS (styling)
- SQLite (database)
- better-sqlite3 (Node.js SQLite driver)
- ws (WebSocket for OpenClaw)

## 🚀 Next Steps to Get It Running

### 1. Install Dependencies

```bash
cd /data/.openclaw/workspace/command-center
npm install
```

This will install all the required packages (~5 minutes).

### 2. Create Data Directory

```bash
mkdir -p data
```

The SQLite database will be created automatically in `./data/command-center.db`.

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### 4. Test Model Selection

Once the app is running:
1. Open http://localhost:3000
2. Try the model selector
3. Check the usage dashboard

## 📊 Model Management - How It Works

### Model Presets (Already Configured)

| Task Type | Default Model | Why |
|-----------|---------------|-----|
| Quick Response | Haiku | Fast, cheap for simple replies |
| Follow-up Suggestions | Sonnet | Balanced for drafting |
| Customer Chat | Sonnet | Good for conversations |
| Complex Analysis | Opus | Powerful for strategy |

### Cost Comparison

For 1 million tokens:
- **Haiku:** $0.80 (cheapest)
- **Sonnet:** $3.00 (balanced)
- **Opus:** $15.00 (premium)

**Example savings:**
- 100 simple follow-ups with Haiku vs Opus: ~$14 saved
- Most conversations work great with Sonnet
- Reserve Opus for big deals and complex situations

### Usage Dashboard Features

- Real-time cost tracking
- Breakdown by model
- Task type analytics
- Optimization suggestions
- Historical trends (7, 30, 90 days)

## 🛠️ Still To Build

I've created the **foundation and model management**, but we still need to build:

### Priority 1 (Core UI)
- [ ] Dashboard home page (metrics, calendar)
- [ ] Client Hub UI (customer list + chat)
- [ ] Customer detail view
- [ ] Chat interface with AI suggestions
- [ ] Task management UI

### Priority 2 (Features)
- [ ] Calendar integration
- [ ] Test drive scheduler
- [ ] Vehicle comparison tool
- [ ] Email templates
- [ ] SMS integration

### Priority 3 (Polish)
- [ ] Mobile responsive design
- [ ] Dark/light theme toggle
- [ ] Export reports
- [ ] Backup/restore

## 🎯 Recommended Build Order

1. **Test the model system first** (it's ready!)
2. **Build Client Hub** (customer list + basic chat)
3. **Add dashboard metrics** (leads, sales, tasks)
4. **Integrate calendar**
5. **Add advanced features** (vehicle search, calculators)

## 💡 Using Different Models

### In Code (API)

```typescript
// Quick response with Haiku
const result = await client.sendMessage(
  customerId, 
  message, 
  { model: 'anthropic/claude-haiku-4-5', taskType: 'quick_response' }
);

// Complex analysis with Opus
const strategy = await client.sendMessage(
  customerId,
  analysisPrompt,
  { model: 'anthropic/claude-opus-4-6', taskType: 'complex_analysis' }
);
```

### In UI

Users can select models using:
- **Compact selector** (dropdown in chat)
- **Full selector** (settings page)
- **Per-conversation override**

## 🔧 Troubleshooting

### OpenClaw Not Connecting

```bash
openclaw gateway status
```

If gateway is down:
```bash
openclaw gateway start
```

### Database Issues

The database auto-initializes, but if you need to reset:
```bash
rm data/command-center.db
# Restart the app - it will recreate the DB
```

### TypeScript Errors

```bash
npm run build
```

This will show any type errors before deploying.

## 📝 Configuration

### Environment Variables

Create `.env.local`:

```env
# OpenClaw Gateway
OPENCLAW_GATEWAY_URL=ws://127.0.0.1:18789

# Optional: Override model defaults
DEFAULT_MODEL=anthropic/claude-sonnet-4-5
HAIKU_MODEL=anthropic/claude-haiku-4-5
OPUS_MODEL=anthropic/claude-opus-4-6
```

## 🚀 Production Deployment

When ready to deploy (not for development):

```bash
npm run build
npm start
```

This will run the production-optimized version on port 3000.

### Reverse Proxy Setup (Optional)

To make it accessible at a domain:

```nginx
server {
    listen 80;
    server_name command-center.yourdomaincom;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🎉 You're Ready!

Run `npm install` in the command-center directory and let me know if you hit any issues. I'll help you get it running!

Once dependencies are installed, we can build the UI components together.

---

**Questions?** Just ask! I'm here to help. 🤖
