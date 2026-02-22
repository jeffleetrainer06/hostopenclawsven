import { NextResponse } from 'next/server';
import WebSocket from 'ws';

// Mark as dynamic
export const dynamic = 'force-dynamic';

// Simple RPC call to OpenClaw gateway
async function sendToAgent(gatewayUrl: string, agentId: string, message: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(gatewayUrl);
    let responseReceived = false;

    const timeout = setTimeout(() => {
      if (!responseReceived) {
        ws.close();
        reject(new Error('Request timeout'));
      }
    }, 30000);

    ws.on('open', () => {
      // Send to main session with agent routing
      const routedMessage = `[Command Center → ${agentId.toUpperCase()}]\n\n${message}\n\n(Respond as ${agentId} from Jeff's Toyota team. See JEFF-AGENTS.md for personality.)`;
      
      const rpcRequest = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'chat',
        params: {
          message: routedMessage
        }
      };
      ws.send(JSON.stringify(rpcRequest));
    });

    ws.on('message', (data) => {
      try {
        const response = JSON.parse(data.toString());
        // Handle RPC response
        if (response.id && (response.result || response.error)) {
          if (response.result) {
            responseReceived = true;
            clearTimeout(timeout);
            ws.close();
            // Extract message from result
            const message = response.result.message || 
                          response.result.content || 
                          response.result.response || 
                          JSON.stringify(response.result);
            resolve(message);
          } else if (response.error) {
            responseReceived = true;
            clearTimeout(timeout);
            ws.close();
            reject(new Error(response.error.message || 'RPC error'));
          }
        }
      } catch (e) {
        console.error('Parse error:', e);
      }
    });

    ws.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    ws.on('close', () => {
      clearTimeout(timeout);
      if (!responseReceived) {
        reject(new Error('Connection closed without response'));
      }
    });
  });
}

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

    try {
      const response = await sendToAgent(gatewayUrl, agent, message);
      return NextResponse.json({ response });
    } catch (error) {
      console.error(`Failed to contact agent ${agent}:`, error);
      return NextResponse.json({
        response: `Sorry, I'm having trouble connecting to ${agent} right now. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
