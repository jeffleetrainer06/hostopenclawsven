import { NextResponse } from 'next/server';
import { getCustomer, getConversations, getModelPreference, trackUsage } from '@/lib/database-optional';
import { getOpenClawClient } from '@/lib/openclaw';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id);
    const { model } = await request.json();

    // Get customer and conversation history
    const customer = getCustomer(customerId) as any;
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const messages = getConversations(customerId) as any[];
    
    // Check if customer has responded recently
    const recentCustomerMessage = messages
      .filter(m => m.sender === 'customer')
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    const hasResponded = recentCustomerMessage 
      ? (Date.now() / 1000 - recentCustomerMessage.timestamp) < 86400 * 7 // Within 7 days
      : false;

    // Get AI suggestion
    const client = getOpenClawClient();
    const modelToUse = model || getModelPreference('follow_up')?.model || 'anthropic/claude-sonnet-4-5';
    
    const result = await client.getSuggestedFollowUp(
      customer.name,
      customer.vehicle_interest || 'Not specified',
      messages.map(m => ({
        sender: m.sender,
        message: m.message,
        timestamp: m.timestamp,
      })),
      hasResponded,
      modelToUse
    );

    // Track usage
    if (result.tokensUsed) {
      trackUsage(`customer-${customerId}`, modelToUse, result.tokensUsed, 'follow_up');
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to get AI suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to get AI suggestion' },
      { status: 500 }
    );
  }
}
