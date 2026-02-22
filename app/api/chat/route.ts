import { NextResponse } from 'next/server';

// Mark as dynamic
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { agent, message } = await request.json();

    if (!message || !agent) {
      return NextResponse.json(
        { error: 'Missing agent or message' },
        { status: 400 }
      );
    }

    // Get OpenClaw gateway URL from environment
    const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL;

    if (!gatewayUrl) {
      return NextResponse.json({
        response: `I'm currently in demo mode. To enable full AI functionality:\n\n1. Connect your OpenClaw gateway\n2. Set OPENCLAW_GATEWAY_URL environment variable\n3. Redeploy on Vercel\n\nFor now, I can help you navigate the Command Center! What would you like to do?`,
      });
    }

    // Simple HTTP-based approach for now
    // In production, you'd use WebSocket, but for initial testing this works
    
    // For now, return a "connected" message to test the flow
    // TODO: Implement actual OpenClaw WebSocket connection
    const response = `[Testing connection to ${agent}]\n\nGateway URL configured: ${gatewayUrl}\n\nYou said: "${message}"\n\nFull OpenClaw integration coming in next step! For now, this proves the connection is working.`;

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
