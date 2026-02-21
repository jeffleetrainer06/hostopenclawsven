# 🚀 Deploy Command Center to Vercel

## Quick Start (5 minutes)

### Step 1: Push to GitHub

1. **Create a new GitHub repository:**
   - Go to https://github.com/new
   - Name it: `jeffs-command-center` (or whatever you prefer)
   - Make it **Private** (contains customer data/config)
   - **Do NOT initialize** with README (we already have files)

2. **Push your code:**

```bash
cd /data/.openclaw/workspace/command-center

# Configure git (first time only)
git config user.email "your-email@example.com"
git config user.name "Jeff Lee"

# Add all files
git add .

# Commit
git commit -m "Initial commit - Jeff's Command Center"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/jeffs-command-center.git

# Push
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com/new
   - Sign in with GitHub

2. **Import your repository:**
   - Click "Import Project"
   - Select your `jeffs-command-center` repository
   - Click "Import"

3. **Configure build settings:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build`
   - Output Directory: `.next` (auto-detected)

4. **Add environment variables** (optional for now):
   ```
   OPENCLAW_GATEWAY_URL=wss://your-vps-ip:18789
   ```

5. **Click "Deploy"**
   - Wait ~2 minutes for build
   - You'll get a URL like: `jeffs-command-center.vercel.app`

---

## ⚠️ Important: Database Limitation

**Issue:** SQLite doesn't work on Vercel (serverless environment).

**What works immediately:**
- ✅ UI/Dashboard (all pages load)
- ✅ Navigation and layout
- ✅ Design and styling
- ❌ Customer data (needs database)
- ❌ AI features (needs backend connection)

**Solutions:**

### Option 1: Vercel Postgres (Recommended)
Add Vercel Postgres to your project:
1. Go to your Vercel project dashboard
2. Click "Storage" tab
3. Click "Create Database" → "Postgres"
4. Vercel will add `DATABASE_URL` env variable automatically

Then update `lib/database.ts` to use Postgres instead of SQLite.

### Option 2: Supabase (Free tier available)
1. Create account at https://supabase.com
2. Create new project
3. Copy connection string
4. Add to Vercel env: `DATABASE_URL`

### Option 3: Hybrid (UI on Vercel, API on VPS)
- Deploy frontend to Vercel
- Keep API running on your VPS
- Set `NEXT_PUBLIC_API_URL` to point to your VPS

---

## 🎨 What You'll See (First Deploy)

Even without database, you'll see:
- ✅ Beautiful dashboard UI
- ✅ Client Hub interface (empty list)
- ✅ Multi-Agent Tools page
- ✅ Model selector
- ✅ All navigation working

This lets you **preview the design** and **show it to others** while you set up the database.

---

## 🔧 After First Deploy

### Add Database (Choose One)

**Quick: Vercel Postgres**
```bash
# In your Vercel project:
# Storage → Create Database → Postgres → Create

# Then update lib/database.ts to use Postgres
```

**Free: Supabase**
```bash
# 1. Sign up at supabase.com
# 2. Create project
# 3. Copy DATABASE_URL
# 4. Add to Vercel env variables
# 5. Redeploy
```

### Connect OpenClaw (Optional)
If you want AI features:
1. Make sure OpenClaw gateway is accessible from internet
2. Add `OPENCLAW_GATEWAY_URL` to Vercel env
3. Update firewall to allow Vercel IP ranges

---

## 🚀 Automatic Deployments

Once connected to GitHub:
- Every `git push` to `main` = automatic deploy
- Preview deployments for other branches
- Instant rollbacks if needed

---

## 📱 Custom Domain (Optional)

Add your own domain:
1. Go to Vercel project settings
2. Domains tab
3. Add `jeff-command-center.com` (or your domain)
4. Follow DNS instructions

---

## 💡 Pro Tips

1. **Keep secrets secret:**
   - Never commit `.env.local`
   - Use Vercel environment variables

2. **Preview before merge:**
   - Create a branch: `git checkout -b feature/calendar`
   - Push: `git push origin feature/calendar`
   - Vercel creates preview URL automatically

3. **Monitor usage:**
   - Vercel dashboard shows analytics
   - Free tier: 100GB bandwidth, unlimited requests

---

## 🆘 Troubleshooting

**Build fails:**
- Check build logs in Vercel dashboard
- Make sure all dependencies are in `package.json`
- Try building locally: `npm run build`

**Database errors:**
- Expected on first deploy (no database yet)
- Add Vercel Postgres or external database
- Update connection string in env variables

**Can't see changes:**
- Wait ~30 seconds for deployment
- Hard refresh: Ctrl+Shift+R (Chrome) or Cmd+Shift+R (Mac)
- Check Vercel deployment log

---

## ✅ Success Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel connected to GitHub
- [ ] First deployment successful
- [ ] URL opens and shows dashboard
- [ ] Database added (Vercel Postgres or Supabase)
- [ ] Test data loads
- [ ] AI features connected (optional)

---

**Next:** Share your Vercel URL and show off your Command Center! 🎉
