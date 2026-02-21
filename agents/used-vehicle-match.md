# Used Vehicle Match Agent

**Purpose:** Find matching pre-owned vehicles from inventory based on customer requirements.

## Input

Customer requirements:
- Budget range
- Vehicle type (sedan, SUV, truck)
- Must-have features
- Preferred year range
- Mileage limit
- Color preferences (nice-to-have)

## Process

1. Parse customer requirements
2. Search available inventory (or simulate search)
3. Rank matches by fit score
4. Include vehicle history highlights (CPO, accidents, owners)
5. Provide pricing context (market value vs asking)
6. Suggest which to test drive first

## Output Format

```
💰 USED VEHICLE MATCHES FOR [CUSTOMER]

Your requirements:
• Budget: $[range]
• Type: [vehicle type]
• Must-haves: [features list]
• Year: [range] | Max Miles: [limit]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🥇 BEST MATCH (95% fit)

[Year] [Make Model Trim]
Stock #: [number] | VIN: [last 8]

📊 Details:
• Price: $[asking] (Market value: $[kbb_value])
• Mileage: [miles] mi
• Color: [exterior] / [interior]
• Previous Owners: [count]
• Accident History: [Clean/Minor/None]

✅ Why this matches:
• [Feature match 1]
• [Feature match 2]
• [Feature match 3]

🔍 Vehicle History:
• [Certified Pre-Owned? maintenance? service records?]
• [Any notable features or condition notes]

💡 Price Analysis: [Excellent/Good/Fair deal - explanation]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🥈 ALSO CONSIDER (88% fit)

[Same format as above]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🥉 ALTERNATIVE (82% fit)

[Same format as above]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 SUMMARY & NEXT STEPS

• [X] vehicles found matching your criteria
• Best value: [Vehicle name]
• Lowest mileage: [Vehicle name]
• Newest: [Vehicle name]

Recommended action:
1. Schedule test drive for [top pick]
2. Run financing pre-approval
3. [Additional recommendation]

Questions to ask during visit:
• [Relevant question 1]
• [Relevant question 2]
```

## Mock Inventory (for demo/testing)

```json
[
  {
    "stock": "T12345",
    "year": 2022,
    "make": "Toyota",
    "model": "RAV4",
    "trim": "XLE",
    "mileage": 28500,
    "price": 29995,
    "color_ext": "Blueprint",
    "color_int": "Black",
    "owners": 1,
    "accidents": "None",
    "cpo": true,
    "features": ["AWD", "Sunroof", "Leather", "Backup Camera", "Apple CarPlay"]
  },
  {
    "stock": "T12346",
    "year": 2021,
    "make": "Toyota",
    "model": "Camry",
    "trim": "SE",
    "mileage": 32100,
    "price": 24995,
    "color_ext": "Wind Chill Pearl",
    "color_int": "Black",
    "owners": 1,
    "accidents": "None",
    "cpo": true,
    "features": ["Sport Seats", "Sunroof", "Blind Spot Monitor", "Apple CarPlay"]
  },
  {
    "stock": "T12347",
    "year": 2020,
    "make": "Toyota",
    "model": "Tacoma",
    "trim": "TRD Off-Road",
    "mileage": 45200,
    "price": 36995,
    "color_ext": "Army Green",
    "color_int": "Cement",
    "owners": 2,
    "accidents": "None",
    "cpo": false,
    "features": ["4WD", "Crawl Control", "Multi-Terrain Select", "Bed Liner", "Tow Package"]
  }
]
```

## Scoring Algorithm

Match score = weighted average:
- Price within budget: 30%
- Must-have features present: 25%
- Mileage within limit: 20%
- Year within range: 15%
- Clean history (CPO, no accidents): 10%

## Prompt Template

```
You are Jeff Lee's AI assistant helping find used vehicles at Pedersen Toyota.

Customer Requirements:
- Name: {customer_name}
- Budget: {budget}
- Vehicle Type: {vehicle_type}
- Must-Have Features: {features}
- Year Range: {year_min}-{year_max}
- Max Mileage: {max_miles}
- Preferred Colors: {colors}

Available Inventory:
{inventory_json}

Task: 
1. Score each vehicle against customer requirements
2. Select top 3 matches
3. Provide detailed analysis for each
4. Include pricing context (use market value estimates)
5. Recommend which to test drive first

Be honest about tradeoffs. If a vehicle is close but missing a feature, explain why it's still worth considering.

Output in the format specified above.
```

## Integration Options

### Option A: Mock Data (Demo/Testing)
Use the mock inventory above for demos and training.

### Option B: VIN Solutions API (Real Inventory)
```javascript
// Connect to dealership inventory system
const inventory = await fetch('https://vin-solutions-api/inventory');
```

### Option C: Manual Input
Jeff provides vehicle details, agent analyzes fit.

## Usage

From Command Center:
```
POST /api/agents/used-vehicle-match
{
  "customer_id": 123,
  "budget": "$25K-$32K",
  "vehicle_type": "SUV",
  "features": ["AWD", "Sunroof", "Backup Camera"],
  "year_min": 2020,
  "year_max": 2023,
  "max_miles": 40000
}
```

From Telegram:
```
/usedmatch budget=$30K type=SUV features="AWD,sunroof" years=2020-2023
```

## Enhancement Ideas

- [ ] Photo links in output
- [ ] Carfax report integration
- [ ] Trade-in value estimator
- [ ] Financing calculator
- [ ] Comparison side-by-side (multiple matches)
- [ ] Alert when new matching inventory arrives
