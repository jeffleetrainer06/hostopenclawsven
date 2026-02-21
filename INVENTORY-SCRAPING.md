# 🚗 Live Inventory Scraping Setup

## Current Status

✅ **Natural language input working** - Users can describe what they're looking for  
✅ **Smart matching algorithm** - Scores vehicles by fit  
✅ **Mock inventory loaded** - 8 realistic Pedersen Toyota vehicles  
⏳ **Live scraping** - Ready to implement when needed

---

## How It Works Now

The **Used Vehicle Match** tool currently uses mock data that looks like real Pedersen Toyota inventory:

- 2022 RAV4 XLE Premium AWD - $31,995, 28.5K mi, CPO
- 2021 Camry SE - $24,995, 32.1K mi, CPO
- 2020 Tacoma TRD Off-Road - $36,995, 45.2K mi
- 2023 Highlander XLE AWD - $44,995, 12.4K mi, CPO
- 2021 Corolla LE - $19,995, 29.8K mi, CPO
- 2022 4Runner SR5 - $42,995, 35.6K mi, CPO
- 2021 Sienna XLE Hybrid - $39,995, 24.3K mi, CPO
- 2020 Highlander LE Plus - $32,995, 48.9K mi

**This works great for demos and testing!** Customers get real-looking matches with pricing, mileage, CPO status, features, etc.

---

## When You Want Live Inventory

### Option 1: VIN Solutions API (Recommended)

If you have access to your dealership's VIN Solutions account:

1. Get API credentials from VIN Solutions
2. Update `lib/inventory-scraper.ts`:

```typescript
export async function fetchFromDealerAPI(apiKey: string) {
  const response = await fetch('https://api.vinsolutions.com/inventory', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}
```

3. Add to `.env.local`:
```
VIN_SOLUTIONS_API_KEY=your_api_key_here
```

4. Update `app/api/agents/used-vehicle-match/route.ts`:
```typescript
const fullInventory = await fetchFromDealerAPI(process.env.VIN_SOLUTIONS_API_KEY);
```

---

### Option 2: Dealership Feed

Most dealerships have an XML/JSON inventory feed:

```typescript
export async function fetchInventoryFeed(feedUrl: string) {
  const response = await fetch(feedUrl);
  const data = await response.text();
  
  // Parse XML or JSON
  const vehicles = parseInventoryFeed(data);
  return vehicles;
}
```

Common feed URLs:
- `https://www.pedersentoyota.com/inventory-feed.xml`
- `https://www.pedersentoyota.com/api/inventory.json`

(Ask your IT/website team for the feed URL)

---

### Option 3: Web Scraping (Advanced)

If no API is available, scrape the website directly.

**Challenge:** The Pedersen Toyota website loads inventory via JavaScript, so simple HTML parsing won't work.

**Solution:** Use browser automation:

```typescript
import { chromium } from 'playwright'; // or puppeteer

export async function scrapeInventory() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://www.pedersentoyota.com/searchused.aspx');
  await page.waitForSelector('.vehicle-listing'); // Wait for listings to load
  
  const vehicles = await page.evaluate(() => {
    const listings = document.querySelectorAll('.vehicle-listing');
    return Array.from(listings).map(listing => ({
      // Extract data from DOM
      year: parseInt(listing.querySelector('.year')?.textContent || '0'),
      make: listing.querySelector('.make')?.textContent || '',
      model: listing.querySelector('.model')?.textContent || '',
      // ... etc
    }));
  });
  
  await browser.close();
  return vehicles;
}
```

**Note:** This requires:
- Installing playwright/puppeteer: `npm install playwright`
- Running a browser in your environment
- May break if website structure changes

---

## Testing Live Inventory

Once you've set up one of the options above:

1. Update `lib/inventory-scraper.ts`:
```typescript
export async function fetchLiveInventory() {
  try {
    // Option 1: API
    return await fetchFromDealerAPI(process.env.VIN_SOLUTIONS_API_KEY!);
    
    // Option 2: Feed
    // return await fetchInventoryFeed('https://www.pedersentoyota.com/feed.xml');
    
    // Option 3: Scraping
    // return await scrapeInventory();
  } catch (error) {
    console.error('Failed to fetch live inventory:', error);
    return getMockInventory(); // Fallback
  }
}
```

2. Update `app/api/agents/used-vehicle-match/route.ts`:
```typescript
async function getInventory() {
  return await fetchLiveInventory(); // Changed from getMockInventory()
}
```

3. Test it:
```bash
npm run dev
# Try the Used Vehicle Match tool
```

---

## Current Workflow (Using Mock Data)

**Customer asks:** "Looking for a reliable SUV under $35K, low miles"

**You do:**
1. Go to Multi-Agent Tools → Used Vehicle Match
2. Type: `budget $35k, SUV, low miles, reliable`
3. Click "Run Analysis"

**Sven analyzes and returns:**
```
💰 USED VEHICLE MATCHES

🥇 BEST MATCH (95% fit)
   2022 RAV4 XLE Premium AWD
   Price: $31,995 | Mileage: 28,500 mi
   
   Why this matches:
   • Well under $35K budget
   • Low mileage for year
   • CPO = Toyota reliability guarantee
   • Perfect SUV size for most needs
   
   🔍 Vehicle History: Certified Pre-Owned, 1 owner, no accidents
```

**This works perfectly with mock data!** It's fast, reliable, and looks professional.

---

## Recommendation

**Start with mock data** (what you have now):
- ✅ Works immediately
- ✅ Great for demos and training
- ✅ No API setup needed
- ✅ No ongoing maintenance

**Switch to live inventory when:**
- You're using the tool heavily (10+ times/day)
- Mock data becomes outdated
- You have API access or IT support

---

## Updating Mock Data

To keep mock data realistic, update `lib/inventory-scraper.ts` monthly:

```typescript
export function getMockInventory(): VehicleListing[] {
  return [
    {
      stock: "P24-1234A",
      year: 2023, // ← Update with current inventory
      make: "Toyota",
      model: "RAV4",
      trim: "XLE Premium AWD",
      mileage: 18500, // ← Realistic mileage
      price: 33995, // ← Current market pricing
      // ... etc
    },
    // Add/remove vehicles to match your actual inventory mix
  ];
}
```

**Pro tip:** Ask your sales manager for a list of 8-10 popular vehicles currently in stock, then copy those details into the mock data.

---

## Questions?

- **"How often should inventory update?"** 
  - API/Feed: Real-time or hourly
  - Scraping: Daily (to avoid overload)
  - Mock: Monthly manual updates

- **"What if a vehicle sells?"**
  - API/Feed: Auto-removed
  - Scraping: Removed next update
  - Mock: Update manually (or customers ask about it anyway!)

- **"Can I mix mock + live data?"**
  - Yes! Keep popular models in mock, supplement with live feed

---

## Support

Need help setting this up? Options:

1. **VIN Solutions**: Contact your VIN Solutions account manager
2. **Website team**: Ask for inventory feed URL
3. **IT department**: Help with API credentials
4. **Sven**: Can help with code once you have the data source

---

**Bottom line:** Mock data works great for now. Switch to live inventory when you're ready! 🚀
