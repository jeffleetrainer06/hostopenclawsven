import { NextResponse } from 'next/server';
import { getOpenClawClient } from '@/lib/openclaw';
import { getCustomer, trackUsage } from '@/lib/database-optional';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const { customer_id, budget, use_case, priorities, requirements } = await request.json();

    if (!customer_id) {
      return NextResponse.json(
        { error: 'customer_id is required' },
        { status: 400 }
      );
    }

    // Get customer info
    const customer = getCustomer(customer_id) as any;
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Load agent prompt
    const agentPrompt = readFileSync(
      join(process.cwd(), 'agents', 'vehicle-recommend.md'),
      'utf-8'
    );

    // Build the prompt
    const prompt = `${agentPrompt}

Customer Profile:
- Name: ${customer.name}
- Budget: ${budget || 'Not specified'}
- Primary Use: ${use_case || 'Not specified'}
- Priorities: ${Array.isArray(priorities) ? priorities.join(', ') : priorities || 'Not specified'}
- Special Needs: ${requirements || 'None'}

Task: Recommend the top 3 Toyota vehicles that best match this customer's needs. Be specific about why each vehicle fits their situation. Include trim recommendations and key selling points.

Output in the format specified in the agent instructions.`;

    // Call OpenClaw
    const client = getOpenClawClient();
    const result = await client.sendMessage(
      `vehicle-recommend-${customer_id}`,
      prompt,
      { model: 'anthropic/claude-sonnet-4-5', taskType: 'vehicle_recommend' }
    );

    // Track usage
    if (result.tokensUsed) {
      trackUsage(
        `vehicle-recommend-${customer_id}`,
        result.model || 'anthropic/claude-sonnet-4-5',
        result.tokensUsed,
        'vehicle_recommend'
      );
    }

    return NextResponse.json({
      success: true,
      recommendation: result.response,
      model: result.model,
      tokensUsed: result.tokensUsed,
    });
  } catch (error) {
    console.error('Failed to generate vehicle recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to generate vehicle recommendation' },
      { status: 500 }
    );
  }
}
