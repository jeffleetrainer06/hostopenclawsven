# 🚗 Jeff's Command Center

AI-powered sales assistant dashboard for Pedersen Toyota, built with OpenClaw and Next.js.

![Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

### 📊 Dashboard
- Real-time sales metrics (leads, test drives, monthly sales)
- Urgent tasks & follow-ups
- Calendar integration
- Quick action buttons

### 💬 Client Hub
- Customer relationship management
- Real-time chat interface
- Conversation history
- AI-powered follow-up suggestions
- Status tracking (inquiry → closed)

### 🛠️ Multi-Agent Tools
Three AI-powered workflows from Emergent/Antfarm:

1. **🚗 Vehicle Recommendations**
   - Personalized Toyota suggestions based on customer needs
   - Top 3 matches with detailed reasoning

2. **⚖️ Vehicle Comparison**
   - Toyota vs competitors analysis
   - Specs, pricing, advantages
   - Win-back talking points

3. **💰 Used Vehicle Match**
   - Find pre-owned inventory matches
   - CPO status, pricing analysis
   - Test drive recommendations

### 🎛️ AI Model Management
- Multi-model support (Haiku, Sonnet, Opus)
- Smart cost optimization (save 40-62%)
- Real-time usage tracking
- Cost analytics dashboard

---

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/jeffs-command-center)

See [DEPLOY-TO-VERCEL.md](./DEPLOY-TO-VERCEL.md) for detailed instructions.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS (dark theme)
- **Database:** SQLite (local) / Postgres (production)
- **AI:** OpenClaw + Claude Sonnet 4.5
- **Deployment:** Vercel

---

## 📂 Project Structure

```
command-center/
├── app/                    # Next.js pages & API routes
├── components/             # React components
├── lib/                    # Backend logic
├── agents/                 # AI agent prompts
├── data/                   # Database (local only)
└── public/                 # Static assets
```

---

## 🎯 Multi-Agent Tools

### Vehicle Recommendations

```typescript
POST /api/agents/vehicle-recommend
{
  "customer_id": 123,
  "budget": "$30K-$40K",
  "use_case": "Family with 2 kids",
  "priorities": ["Safety", "Fuel Economy"],
  "requirements": "AWD preferred"
}
```

### Vehicle Comparison

```typescript
POST /api/agents/vehicle-compare
{
  "toyota_vehicle": "RAV4 Hybrid XLE",
  "competitor_vehicle": "Honda CR-V Hybrid",
  "categories": ["specs", "price", "features"]
}
```

### Used Vehicle Match

```typescript
POST /api/agents/used-vehicle-match
{
  "budget": "$25K-$32K",
  "vehicle_type": "SUV",
  "features": ["AWD", "Sunroof"],
  "year_min": 2020,
  "max_miles": 40000
}
```

---

## 💰 Cost Analysis

**Monthly AI Usage** (50 customers, 200 interactions):
- Smart model selection: **$0.72/month**
- All Opus: $1.91/month
- **Savings: 62%**

**Per-tool costs:**
- Vehicle Recommendations: $0.003-0.005
- Vehicle Comparison: $0.004-0.006
- Used Vehicle Match: $0.003-0.004

---

## 🔧 Configuration

### Environment Variables

```bash
# .env.local

# OpenClaw Gateway
OPENCLAW_GATEWAY_URL=ws://127.0.0.1:18789

# AI Models
DEFAULT_MODEL=anthropic/claude-sonnet-4-5
HAIKU_MODEL=anthropic/claude-haiku-4-5
OPUS_MODEL=anthropic/claude-opus-4-6

# Database (production)
DATABASE_URL=postgres://...
```

---

## 📖 Documentation

- [Setup Guide](./SETUP-GUIDE.md)
- [Deploy to Vercel](./DEPLOY-TO-VERCEL.md)
- [Multi-Agent Tools](./MULTI-AGENT-TOOLS.md)
- [Demo Summary](./DEMO-SUMMARY.md)

---

## 🤝 Contributing

This is a personal project for Pedersen Toyota. Not accepting external contributions.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **OpenClaw** - AI orchestration platform
- **Anthropic Claude** - AI models
- **Next.js** - React framework
- **Vercel** - Hosting platform

---

**Built by Jeff Lee with Sven (AI Assistant)**  
Pedersen Toyota | Fort Collins, CO

---

## 📞 Contact

Jeff Lee - Sales Consultant  
Pedersen Toyota  
Fort Collins, Colorado

---

⭐ **Star this repo if you find it useful!**
