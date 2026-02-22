# 🎨 Agent Avatar Creation Guide

## Avatar Descriptions

### 👔 **Christi** - Office Manager
**Physical Description:**
- Age: Mid-40s, experienced and confident
- Hair: Long, brown, professional style
- Glasses: Yes, stylish frames
- Clothing: Business casual - blazer over nice blouse
- Expression: Warm, approachable smile
- Vibe: Your trusted office manager who's been there forever

**AI Generation Prompt:**
```
Professional woman office manager, mid-40s, long brown hair, 
stylish glasses, warm approachable smile, business casual blazer 
and blouse, confident but friendly, professional headshot, 
photorealistic, studio lighting, neutral background
```

---

### 🔍 **Scout** - Research Analyst
**Physical Description:**
- Age: Late 20s, energetic
- Hair: Short blonde, modern cut
- Eyes: Bright, curious expression
- Clothing: Smart casual - button-up shirt, jeans
- Props: Holding tablet or notepad
- Vibe: Data nerd who gets excited about findings

**AI Generation Prompt:**
```
Young woman research analyst, late 20s, short blonde hair modern style, 
bright curious eyes, smart casual button-up shirt, holding tablet, 
energetic intelligent expression, professional headshot, photorealistic, 
studio lighting, neutral background
```

---

### 💬 **Echo** - Customer Concierge
**Physical Description:**
- Age: Early 30s, personable
- Hair: Shoulder-length black hair
- Expression: Warm, empathetic, friendly
- Clothing: Casual professional
- Props: Wearing headset or holding phone
- Vibe: The person everyone wants to talk to

**AI Generation Prompt:**
```
Friendly woman customer service specialist, early 30s, 
shoulder-length black hair, warm empathetic smile, 
casual professional attire, wearing headset, approachable 
and kind expression, professional headshot, photorealistic, 
studio lighting, neutral background
```

---

### 🔨 **Forge** - Development Specialist
**Physical Description:**
- Age: Late 20s, creative energy
- Hair: Red hair in messy bun
- Glasses: Yes, tech-chic style
- Clothing: Hoodie with tech company logos
- Props: Laptop with stickers visible
- Vibe: Maker, builder, ships fast

**AI Generation Prompt:**
```
Creative woman developer, late 20s, red messy bun hair, 
stylish tech glasses, confident creative expression, hoodie with 
tech logos, laptop with stickers, maker vibe, professional headshot, 
photorealistic, studio lighting, neutral background
```

---

## Generation Options

### Option 1: AI Art Generators

**DALL-E (OpenAI):**
- Cost: $15 for 115 images
- Quality: Photorealistic
- URL: https://openai.com/dall-e-2
- Best for: Quick, consistent style

**Midjourney:**
- Cost: $10/month
- Quality: Excellent, artistic
- URL: https://midjourney.com
- Best for: Stylized, professional look

**Stable Diffusion:**
- Cost: Free (self-hosted) or $9/month
- Quality: Good, customizable
- URL: https://stability.ai
- Best for: Full control, iterations

### Option 2: Commission Artist

**Fiverr:**
- Cost: $20-50 per character
- Turnaround: 2-7 days
- URL: https://fiverr.com
- Search: "character avatar illustration"

**Upwork:**
- Cost: $50-100 per character
- Turnaround: 3-10 days
- URL: https://upwork.com
- Search: "character design avatar"

### Option 3: Stock Photos + Editing

**Free Stock Sites:**
- Unsplash: https://unsplash.com
- Pexels: https://pexels.com
- Search: "professional woman office", "developer", etc.

**Paid Stock Sites:**
- iStock: https://istockphoto.com
- Shutterstock: https://shutterstock.com
- Higher quality, more options

**Photo Editing:**
- Remove.bg (remove background)
- Canva (add effects, crop)
- Photoshop (if available)

---

## Image Specifications

### Technical Requirements:
- **Format:** PNG (with transparency) or JPG
- **Size:** 512x512 pixels minimum
- **Aspect Ratio:** 1:1 (square)
- **File Size:** Under 500KB for web performance
- **Resolution:** 72-150 DPI for screens

### Style Guidelines:
- **Background:** Neutral or transparent
- **Lighting:** Studio-quality, even lighting
- **Framing:** Headshot (shoulders up)
- **Expression:** Match personality description
- **Consistency:** Similar style across all 4 agents

---

## Adding Avatars to Command Center

### Step 1: Prepare Images
```bash
# Create avatars directory
mkdir -p /data/.openclaw/workspace/command-center/public/avatars

# Place your images:
# public/avatars/christi.png
# public/avatars/scout.png
# public/avatars/echo.png
# public/avatars/forge.png
```

### Step 2: Update Agent Configuration

Edit `components/AgentSelector.tsx`:

```typescript
export const agents: Agent[] = [
  {
    id: 'christi',
    name: 'Christi',
    emoji: '👔',
    description: 'Office Manager - Your right hand',
    color: 'purple',
    avatar: '/avatars/christi.png', // ← Add this
  },
  // ... repeat for other agents
];
```

### Step 3: Update UI Components

The avatar will automatically show in:
- Agent selector buttons
- Chat window header
- Agent profile cards

### Step 4: Deploy
```bash
git add public/avatars/*.png
git add components/AgentSelector.tsx
git commit -m "Add custom agent avatars"
git push origin main
```

---

## Quick Start with AI Generation

### Using DALL-E (Easiest):

1. **Go to:** https://openai.com/dall-e-2
2. **Sign up** and add $15 credits
3. **Paste prompts** from above (one at a time)
4. **Generate** 4 variations each
5. **Download** your favorites
6. **Crop to square** (512x512)
7. **Upload to Command Center**

**Total cost:** ~$1.50 for all 4 avatars  
**Total time:** 30 minutes

---

## Using Midjourney (Best Quality):

1. **Join Discord:** https://discord.gg/midjourney
2. **Subscribe:** $10/month basic plan
3. **In #general channel:**
   ```
   /imagine professional woman office manager, mid-40s, long brown hair, stylish glasses, warm smile, business casual, professional headshot --v 6 --style raw
   ```
4. **Upscale** your favorite (U1, U2, U3, U4)
5. **Download** high-res image
6. **Repeat** for other 3 agents
7. **Cancel subscription** after you have images

**Total cost:** $10 (one month)  
**Total time:** 1 hour  
**Quality:** Excellent

---

## Free Alternative: Stable Diffusion

### Using DreamStudio (Web Interface):

1. **Go to:** https://beta.dreamstudio.ai
2. **Sign up** (get free credits)
3. **Paste prompts** from above
4. **Generate** multiple versions
5. **Download** favorites

**Cost:** Free credits, then $1.18 per 100 images  
**Quality:** Good, may need iterations

---

## Temporary Solution: High-Quality Emoji

Until you have custom avatars, use better emoji avatars:

```typescript
avatar: '👩‍💼', // Christi - businesswoman
avatar: '👩‍💻', // Scout - woman technologist
avatar: '👩‍🏫', // Echo - woman teacher (helpful vibe)
avatar: '👩‍🔧', // Forge - woman mechanic (builder vibe)
```

Or use these Unicode symbols:
```typescript
avatar: '🧑‍💼', // Gender-neutral professional
avatar: '🔬', // Microscope (research)
avatar: '💬', // Speech bubble (communication)
avatar: '🛠️', // Tools (building)
```

---

## Avatar Display Examples

### In Agent Selector:
```
┌─────────────────────────────┐
│ [👩‍💼] Christi              [⭐]│
│     Office Manager           │
└─────────────────────────────┘
```

### In Chat Header:
```
┌─────────────────────────────────┐
│ [👩‍💼] Christi               [≡] │
│     Office Manager               │
└─────────────────────────────────┘
```

### In Messages:
```
┌─────────────────────────┐
│ [👩‍💼] Christi            │
│ 2:34 PM                 │
│                         │
│ Got it, hon. Let me     │
│ coordinate this...      │
└─────────────────────────┘
```

---

## Pro Tips

### Consistency:
- Use same AI generator for all 4
- Use same style prompt keywords
- Same lighting and background
- Same framing and angle

### Personality:
- Expression should match personality
- Christi: Warm and professional
- Scout: Curious and bright
- Echo: Friendly and empathetic
- Forge: Creative and confident

### File Organization:
```
public/
└── avatars/
    ├── christi.png       (512x512)
    ├── scout.png         (512x512)
    ├── echo.png          (512x512)
    └── forge.png         (512x512)
```

### Optimization:
- Compress images (TinyPNG.com)
- Use WebP format if possible
- Lazy load for performance

---

## Budget Breakdown

### Option 1: DIY AI Generation
- DALL-E credits: $1.50
- Image editing: Free (Canva)
- **Total: $1.50**
- **Time: 30 minutes**

### Option 2: Midjourney Quality
- Midjourney: $10/month
- Cancel after: $0 ongoing
- **Total: $10**
- **Time: 1 hour**

### Option 3: Professional Artist
- Fiverr commission: $20-50 each
- **Total: $80-200**
- **Time: 3-7 days**

### Option 4: Free Stock Photos
- Stock photos: Free
- Photo editing: Free
- **Total: $0**
- **Time: 2 hours**

---

## Recommended Approach

**For Quick Launch:**
1. Use high-quality emoji (5 minutes)
2. Launch with emoji avatars
3. Generate AI avatars later
4. Update when ready

**For Professional Look:**
1. Spend $10 on Midjourney
2. Generate all 4 avatars
3. Get exactly what you want
4. Launch with custom avatars

**For Perfect Result:**
1. Commission artist on Fiverr
2. Provide detailed descriptions
3. Get unique, polished avatars
4. Launch when artwork complete

---

**My Recommendation:** Start with emoji, launch quickly, then add custom avatars when you have time!

The functionality matters more than the avatars at first. Get agents working, then make them pretty! 🎨
