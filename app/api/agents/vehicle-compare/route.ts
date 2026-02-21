import { NextResponse } from 'next/server';
import { getOpenClawClient } from '@/lib/openclaw';
import { trackUsage } from '@/lib/database-optional';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const { toyota_vehicle, competitor_vehicle, categories } = await request.json();

    if (!toyota_vehicle || !competitor_vehicle) {
      return NextResponse.json(
        { error: 'toyota_vehicle and competitor_vehicle are required' },
        { status: 400 }
      );
    }

    // Load agent prompt
    const agentPrompt = readFileSync(
      join(process.cwd(), 'agents', 'vehicle-compare.md'),
      'utf-8'
    );

    // Build the prompt
    const prompt = `${agentPrompt}

Comparison Request:
- Toyota Vehicle: ${toyota_vehicle}
- Competitor: ${competitor_vehicle}
- Focus Areas: ${Array.isArray(categories) ? categories.join(', ') : categories || 'all'}

Task: Create a detailed, honest comparison highlighting Toyota's advantages while acknowledging competitor strengths. Include:
1. Side-by-side spec comparison
2. Toyota advantages with specific details
3. Fair assessment of competitor strengths with counter-points
4. Value analysis (TCO, resale)
5. Closing talking points for Jeff

Be factually accurate. Use web search if needed for current specs.

Output in the format specified in the agent instructions.`;

    // Call OpenClaw
    const client = getOpenClawClient();
    const result = await client.sendMessage(
      'vehicle-compare',
      prompt,
      { model: 'anthropic/claude-sonnet-4-5', taskType: 'vehicle_compare' }
    );

    // Track usage
    if (result.tokensUsed) {
      trackUsage(
        'vehicle-compare',
        result.model || 'anthropic/claude-sonnet-4-5',
        result.tokensUsed,
        'vehicle_compare'
      );
    }

    return NextResponse.json({
      success: true,
      comparison: result.response,
      model: result.model,
      tokensUsed: result.tokensUsed,
    });
  } catch (error) {
    console.error('Failed to generate vehicle comparison:', error);
    return NextResponse.json(
      { error: 'Failed to generate vehicle comparison' },
      { status: 500 }
    );
  }
}
