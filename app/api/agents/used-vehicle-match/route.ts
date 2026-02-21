import { NextResponse } from 'next/server';
import { getOpenClawClient } from '@/lib/openclaw';
import { getCustomer, trackUsage } from '@/lib/database';
import { readFileSync } from 'fs';
import { join } from 'path';

// Mock inventory for demo
const MOCK_INVENTORY = [
  {
    stock: "T12345",
    year: 2022,
    make: "Toyota",
    model: "RAV4",
    trim: "XLE",
    mileage: 28500,
    price: 29995,
    color_ext: "Blueprint",
    color_int: "Black",
    owners: 1,
    accidents: "None",
    cpo: true,
    features: ["AWD", "Sunroof", "Leather", "Backup Camera", "Apple CarPlay"]
  },
  {
    stock: "T12346",
    year: 2021,
    make: "Toyota",
    model: "Camry",
    trim: "SE",
    mileage: 32100,
    price: 24995,
    color_ext: "Wind Chill Pearl",
    color_int: "Black",
    owners: 1,
    accidents: "None",
    cpo: true,
    features: ["Sport Seats", "Sunroof", "Blind Spot Monitor", "Apple CarPlay"]
  },
  {
    stock: "T12347",
    year: 2020,
    make: "Toyota",
    model: "Tacoma",
    trim: "TRD Off-Road",
    mileage: 45200,
    price: 36995,
    color_ext: "Army Green",
    color_int: "Cement",
    owners: 2,
    accidents: "None",
    cpo: false,
    features: ["4WD", "Crawl Control", "Multi-Terrain Select", "Bed Liner", "Tow Package"]
  },
  {
    stock: "T12348",
    year: 2023,
    make: "Toyota",
    model: "Highlander",
    trim: "XLE AWD",
    mileage: 12400,
    price: 44995,
    color_ext: "Celestial Silver",
    color_int: "Black",
    owners: 1,
    accidents: "None",
    cpo: true,
    features: ["AWD", "3rd Row", "Heated Seats", "Navigation", "Blind Spot", "Moonroof"]
  },
  {
    stock: "T12349",
    year: 2021,
    make: "Toyota",
    model: "Corolla",
    trim: "LE",
    mileage: 29800,
    price: 19995,
    color_ext: "Classic Silver",
    color_int: "Fabric",
    owners: 1,
    accidents: "None",
    cpo: true,
    features: ["Backup Camera", "Apple CarPlay", "Lane Assist", "Adaptive Cruise"]
  }
];

export async function POST(request: Request) {
  try {
    const {
      customer_id,
      budget,
      vehicle_type,
      features,
      year_min,
      year_max,
      max_miles,
      colors
    } = await request.json();

    // Get customer info if provided
    let customer = null;
    if (customer_id) {
      customer = getCustomer(customer_id) as any;
    }

    // Load agent prompt
    const agentPrompt = readFileSync(
      join(process.cwd(), 'agents', 'used-vehicle-match.md'),
      'utf-8'
    );

    // Build the prompt
    const prompt = `${agentPrompt}

Customer Requirements:
- Name: ${customer?.name || 'Customer'}
- Budget: ${budget || 'Not specified'}
- Vehicle Type: ${vehicle_type || 'Any'}
- Must-Have Features: ${Array.isArray(features) ? features.join(', ') : features || 'None specified'}
- Year Range: ${year_min || 'Any'}-${year_max || 'Current'}
- Max Mileage: ${max_miles || 'No limit'}
- Preferred Colors: ${colors || 'No preference'}

Available Inventory:
${JSON.stringify(MOCK_INVENTORY, null, 2)}

Task: 
1. Score each vehicle against customer requirements
2. Select top 3 matches
3. Provide detailed analysis for each
4. Include pricing context
5. Recommend which to test drive first

Be honest about tradeoffs. If a vehicle is close but missing a feature, explain why it's still worth considering.

Output in the format specified in the agent instructions.`;

    // Call OpenClaw
    const client = getOpenClawClient();
    const result = await client.sendMessage(
      customer_id ? `used-match-${customer_id}` : 'used-match',
      prompt,
      { model: 'anthropic/claude-sonnet-4-5', taskType: 'used_vehicle_match' }
    );

    // Track usage
    if (result.tokensUsed) {
      trackUsage(
        customer_id ? `used-match-${customer_id}` : 'used-match',
        result.model || 'anthropic/claude-sonnet-4-5',
        result.tokensUsed,
        'used_vehicle_match'
      );
    }

    return NextResponse.json({
      success: true,
      matches: result.response,
      model: result.model,
      tokensUsed: result.tokensUsed,
    });
  } catch (error) {
    console.error('Failed to find used vehicle matches:', error);
    return NextResponse.json(
      { error: 'Failed to find used vehicle matches' },
      { status: 500 }
    );
  }
}
