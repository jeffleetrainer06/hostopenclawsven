# 🔨 Forge + Lovable Integration Guide

## What is Forge?

Forge is your development agent who can:
- Build custom tools and interactive widgets
- Write code (React, TypeScript, Python, etc.)
- Create web apps using Lovable.dev
- Integrate systems and automate workflows
- Choose the best AI model for each task (Claude Opus, Sonnet, Haiku, or Lovable AI)

---

## What is Lovable.dev?

Lovable is an AI-powered web development platform that lets you:
- Describe what you want in plain English
- Watch it build the app in real-time
- Refine with AI chat or visual editor
- Deploy instantly with one click

**Perfect for:**
✅ Customer-facing tools (calculators, forms)  
✅ Marketing landing pages  
✅ Interactive dashboards  
✅ Quick prototypes  
✅ Mobile-friendly web apps  

**Your account:** https://lovable.dev

---

## When Forge Uses Lovable vs. Claude

### Use Lovable When:
- Need a **visual web interface**
- Want it **deployed and hosted**
- Customer-facing tool
- Marketing/sales page
- Form or survey
- **Timeline: Hours, not days**

### Use Claude When:
- **Backend logic** or API integration
- Command Center integration
- Custom business logic
- Data processing scripts
- Multi-step automation
- **Complex calculations**

### Use Both (Hybrid):
- Lovable frontend + API backend
- Interactive UI + Command Center data
- Customer portal extensions
- Advanced analytics dashboards

---

## Example Projects with Forge

### 🧮 Project 1: Trade-In Value Estimator

**What:** Customer tool to estimate their trade-in value

**Tool:** Lovable.dev  
**Time:** 2-3 hours  
**Deploy:** Instant  

**What Forge builds:**
```
lovable.dev/jeff-tradein-tool

Features:
- Year/Make/Model dropdowns
- Mileage input
- Condition selector (Excellent/Good/Fair)
- Instant estimate range
- "Schedule Appraisal" button → sends to Jeff
- Mobile-responsive design
```

**How to use it:**
1. Share link with customers
2. Embed on website
3. Post in social media

---

### 💰 Project 2: Hybrid Savings Calculator

**What:** Show customers how much they save with hybrid vs gas

**Tool:** Lovable.dev  
**Time:** 2 hours  

**What Forge builds:**
```
Features:
- Gas price input ($/gallon)
- Miles driven per year
- Compare: RAV4 vs RAV4 Hybrid
- Show: Annual savings, 5-year savings
- Environmental impact (CO2 saved)
- Financing comparison
```

---

### 📊 Project 3: Customer Follow-Up Automation

**What:** Auto-send personalized follow-ups to cold leads

**Tool:** Claude Sonnet + Command Center  
**Time:** 4-6 hours  

**What Forge builds:**
```javascript
// Script runs daily via cron
1. Read customer database
2. Find leads with no response >3 days
3. Generate personalized message (via Echo)
4. Send via text/email
5. Log activity
6. Alert Jeff if customer responds
```

---

### 🎨 Project 4: Social Media Post Generator

**What:** Buzz creates content, this tool formats and schedules

**Tool:** Lovable UI + API  
**Time:** 1 day  

**What Forge builds:**
```
Features:
- Buzz generates post ideas
- Forge builds:
  - Calendar view
  - Drag-and-drop scheduling
  - Image uploader
  - Hashtag suggester
  - One-click post to Instagram/Facebook
```

---

### 📈 Project 5: Real-Time Inventory Dashboard

**What:** See what's selling fast vs slow

**Tool:** Lovable + API integration  
**Time:** 1-2 days  

**What Forge builds:**
```
Features:
- Grid view of all inventory
- Color-coded: Hot (red) | Warm (yellow) | Cold (blue)
- Click vehicle → see details
- Days on lot, views, test drives
- Filter by model, price, year
- Export to Excel
- Auto-refresh every hour
```

---

## How to Work With Forge

### Step 1: Describe What You Need

**Good request:**
> "Build a calculator customers can use to estimate monthly payments. Needs price input, down payment, interest rate, and term length. Show payment breakdown."

**Even better:**
> "Build a payment calculator for customers. They put in vehicle price, down payment, and we show monthly payments for 36, 48, and 60 month terms at our current rates. Include trade-in value input. Mobile-friendly. Want to embed on website."

### Step 2: Forge Asks Clarifying Questions

Forge might ask:
- Who's the user? (You, customers, team)
- Where does it live? (Web, Command Center, script)
- How urgent? (Today, this week, whenever)
- Integration needs? (Connect to what?)

### Step 3: Forge Chooses Tools

Forge decides:
- **Lovable?** Fast, hosted, UI-focused
- **Claude?** Custom logic, Command Center integration
- **Hybrid?** Best of both

### Step 4: Build & Iterate

1. Forge builds initial version (v1)
2. Shares link or code
3. You test and give feedback
4. Forge refines (v2, v3, etc.)
5. Final deployment

### Step 5: Delivery

You get:
- **For Lovable:** Live URL + edit access
- **For Claude code:** Files + setup instructions
- **For scripts:** Installed and configured
- **Always:** Documentation

---

## Lovable Account Setup

### Giving Forge Access

**Option 1: Share Login (Session-based)**
1. You log in to Lovable
2. Generate a temporary access token
3. Share with Forge for this project only
4. Revoke when done

**Option 2: Collaborate**
1. Forge tells you what to build
2. You create project in Lovable
3. Forge guides you step-by-step
4. You maintain full control

**Option 3: Team Account**
1. Add Forge as team member (if Lovable supports)
2. Set project-level permissions
3. Revoke access anytime

**Security note:** Forge never stores credentials. Session-based access only.

---

## Lovable Project Examples

### Example 1: ROI Calculator

**Lovable prompt Forge would use:**

```
Build a hybrid vehicle ROI calculator.

Layout:
- Header: "See How Much You Save with a Hybrid"
- Left column: Input form
  • Vehicle MSRP
  • Gas price ($/gallon, default 3.50)
  • Miles per year (default 15,000)
  • Years to calculate (default 5)
- Right column: Results
  • Annual savings
  • 5-year total savings
  • Break-even point
  • Environmental impact (CO2 saved)
  
Style:
- Clean, modern
- Toyota brand colors (red, white, black)
- Mobile-responsive
- Large text, easy to read

CTA:
- "Calculate Your Savings" button
- "Schedule Test Drive" button that links to Jeff's calendar
```

**Time:** ~2 hours in Lovable  
**Result:** Deployed app at `lovable.app/hybrid-roi`

---

### Example 2: Appointment Scheduler

**Lovable prompt:**

```
Build an appointment scheduler for test drives.

Features:
- Customer enters:
  • Name, phone, email
  • Vehicle interested in (dropdown)
  • Preferred date/time (calendar picker)
  • Message (optional)
  
- Shows:
  • Jeff's availability (integrate with calendar API)
  • Time slots in 30-min increments
  • Business hours: Mon-Sat 9 AM - 7 PM

- After submission:
  • Confirmation message
  • Email to customer (confirmation)
  • Email to Jeff (new appointment)
  • SMS reminder 24h before

Style:
- Professional, trustworthy
- Toyota branding
- Mobile-first design
```

**Time:** ~4 hours (includes calendar integration)  
**Result:** Embed widget for website

---

## Cost Breakdown

### Lovable Costs
- **Your subscription:** $20-30/month (check your plan)
- **Projects:** Unlimited
- **Hosting:** Included
- **Deploys:** Instant, free

### Claude Costs (for custom code)
- **Simple tool:** $0.01-0.05 (Haiku/Sonnet)
- **Medium project:** $0.10-0.50 (Sonnet)
- **Complex project:** $0.50-2.00 (Opus)

**Bottom line:** Most Forge projects cost **less than $1** in AI tokens!

---

## Maintenance & Updates

### Lovable Projects
- **You can edit** in Lovable UI anytime
- **Or ask Forge** to make changes
- **Auto-deploys** when you save

### Command Center Code
- **Forge updates** via GitHub
- **Vercel auto-deploys** when pushed
- **Version controlled** (can rollback)

### Standalone Scripts
- **Forge provides** update instructions
- **You can modify** if comfortable
- **Or request changes** from Forge

---

## Best Practices

✅ **Start simple** - MVP first, then enhance  
✅ **Test with real data** - Use actual customer scenarios  
✅ **Mobile-first** - Most customers use phones  
✅ **Get feedback early** - Show prototypes, iterate  
✅ **Document everything** - For future reference  

❌ Don't over-engineer on v1  
❌ Don't build if tool exists  
❌ Don't skip testing  
❌ Don't forget mobile  

---

## Real Conversation with Forge

**You:** "I need a tool to show customers hybrid savings"

**Forge:** "Great idea! A few questions:
- Is this for customers to use themselves, or for you to show in person?
- Should it be on your website, or standalone link?
- Any specific hybrids to include? (RAV4, Camry, Highlander?)
- Need to capture their contact info?"

**You:** "For customers to use themselves. Want to share link via text. Focus on RAV4 Hybrid. Yes, capture email if they want info."

**Forge:** "Perfect! I'll use Lovable for this - we'll have it done in 2 hours.

Features:
- Simple form: gas price, miles/year
- Results: annual savings, 5-year total
- Optional: enter email for detailed breakdown
- Mobile-optimized
- Share link: `lovable.app/rav4-savings`

Sound good? Want to add anything?"

**You:** "Perfect! Maybe also show environmental impact?"

**Forge:** "On it! Adding:
- Gallons of gas saved
- CO2 emissions prevented (in pounds)
- Tree equivalent (for impact visual)

Building now... I'll share the link in ~2 hours."

---

## Project Ideas for Forge

### Customer-Facing Tools
- [ ] Trade-in value estimator
- [ ] Payment calculator with real rates
- [ ] Hybrid savings ROI calculator
- [ ] Test drive scheduler
- [ ] Financing pre-qualification form
- [ ] Vehicle comparison widget
- [ ] Maintenance cost estimator

### Internal Tools
- [ ] Inventory turnover dashboard
- [ ] Follow-up automation system
- [ ] Lead scoring calculator
- [ ] Commission tracker
- [ ] Social media post scheduler
- [ ] Customer satisfaction survey
- [ ] Referral tracking system

### Integrations
- [ ] Dealership inventory sync
- [ ] Financing API connection
- [ ] Carfax integration
- [ ] Google Calendar sync
- [ ] WhatsApp automation
- [ ] Email marketing integration

---

## Next Steps

1. **Try Forge in Command Center** (after next deploy)
2. **Pick one quick project** (trade-in calculator?)
3. **Share Lovable access** (if using Lovable)
4. **Get first tool built** (2-3 hours)
5. **Test with customers** (get feedback)
6. **Iterate and improve**

---

**Forge is ready to build. What's first?** 🔨🚀
