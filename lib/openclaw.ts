import WebSocket from 'ws';

interface OpenClawMessage {
  type: string;
  sessionKey?: string;
  message?: string;
  [key: string]: any;
}

class OpenClawClient {
  private ws: WebSocket | null = null;
  private gatewayUrl: string;
  private sessions: Map<string, string> = new Map(); // customerId -> sessionKey

  constructor(gatewayUrl: string = 'ws://127.0.0.1:18789') {
    this.gatewayUrl = gatewayUrl;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.gatewayUrl);
      
      this.ws.on('open', () => {
        console.log('✅ Connected to OpenClaw gateway');
        resolve();
      });

      this.ws.on('error', (error) => {
        console.error('❌ OpenClaw connection error:', error);
        reject(error);
      });

      this.ws.on('close', () => {
        console.log('🔌 Disconnected from OpenClaw');
      });
    });
  }

  async sendMessage(
    customerId: string, 
    message: string, 
    options?: { model?: string; taskType?: string }
  ): Promise<{ response: string; tokensUsed?: number; model?: string }> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect();
    }

    // Use customer-specific session or create new one
    const sessionKey = this.sessions.get(customerId) || `customer-${customerId}`;
    this.sessions.set(customerId, sessionKey);

    return new Promise((resolve, reject) => {
      const payload: OpenClawMessage = {
        type: 'message',
        sessionKey,
        message,
        model: options?.model, // Optional model override
      };

      this.ws!.send(JSON.stringify(payload));

      // Wait for response
      const handler = (data: WebSocket.Data) => {
        try {
          const response = JSON.parse(data.toString());
          if (response.sessionKey === sessionKey) {
            this.ws!.off('message', handler);
            resolve({
              response: response.content || response.message || '',
              tokensUsed: response.usage?.total_tokens,
              model: response.model || options?.model,
            });
          }
        } catch (e) {
          console.error('Failed to parse response:', e);
        }
      };

      this.ws!.on('message', handler);

      // Timeout after 30 seconds
      setTimeout(() => {
        this.ws!.off('message', handler);
        reject(new Error('Request timeout'));
      }, 30000);
    });
  }

  /**
   * Get AI-suggested follow-up based on customer conversation history
   */
  async getSuggestedFollowUp(
    customerName: string,
    vehicleInterest: string,
    conversationHistory: Array<{ sender: string; message: string; timestamp: number }>,
    hasResponded: boolean,
    model?: string
  ): Promise<{ suggestion: string; tone: string; urgency: string; tokensUsed?: number }> {
    const lastContact = conversationHistory[conversationHistory.length - 1];
    const daysSinceContact = Math.floor((Date.now() / 1000 - lastContact.timestamp) / 86400);

    const prompt = `
You are helping Jeff Lee, a sales consultant at Pedersen Toyota, follow up with a customer.

Customer: ${customerName}
Vehicle Interest: ${vehicleInterest || 'Not specified'}
Days Since Last Contact: ${daysSinceContact}
Customer Has Responded: ${hasResponded ? 'Yes' : 'No'}

Recent conversation:
${conversationHistory.slice(-5).map(msg => `${msg.sender}: ${msg.message}`).join('\n')}

Task: Suggest a follow-up message for Jeff to send. Consider:
- If customer hasn't responded, use a gentle re-engagement approach
- If customer has responded, keep momentum and move toward next step
- Match Jeff's professional but friendly tone
- Include a clear call-to-action

Return ONLY a JSON object with this structure:
{
  "suggestion": "The suggested message text",
  "tone": "professional|friendly|urgent",
  "urgency": "low|medium|high"
}
`;

    try {
      const result = await this.sendMessage('follow-up-assistant', prompt, { model, taskType: 'follow_up' });
      // Try to parse JSON response
      const match = result.response.match(/\{[\s\S]*\}/);
      if (match) {
        return {
          ...JSON.parse(match[0]),
          tokensUsed: result.tokensUsed,
        };
      }
      // Fallback if not JSON
      return {
        suggestion: result.response,
        tone: 'friendly',
        urgency: hasResponded ? 'low' : 'medium',
        tokensUsed: result.tokensUsed,
      };
    } catch (error) {
      console.error('Failed to get AI suggestion:', error);
      return {
        suggestion: hasResponded
          ? `Hi ${customerName}, thanks for getting back to me! How can I help you move forward with the ${vehicleInterest}?`
          : `Hi ${customerName}, just wanted to follow up on your interest in the ${vehicleInterest}. Any questions I can answer?`,
        tone: 'friendly',
        urgency: 'medium'
      };
    }
  }

  /**
   * Get AI-powered response to customer question
   */
  async getCustomerResponse(
    customerName: string,
    vehicleInterest: string,
    customerMessage: string,
    conversationHistory: Array<{ sender: string; message: string }>,
    model?: string
  ): Promise<{ response: string; tokensUsed?: number }> {
    const prompt = `
You are assisting Jeff Lee respond to a customer at Pedersen Toyota.

Customer: ${customerName}
Vehicle Interest: ${vehicleInterest}
Customer's Latest Message: "${customerMessage}"

Context (recent conversation):
${conversationHistory.slice(-5).map(msg => `${msg.sender}: ${msg.message}`).join('\n')}

Draft a helpful, professional response for Jeff. Include:
- Answer their question or acknowledge their concern
- Provide relevant info about Toyota vehicles/inventory/process
- Move conversation toward next step (test drive, pricing, financing, etc.)
- Keep tone warm but professional

Response:
`;

    try {
      const result = await this.sendMessage(`customer-${customerName}`, prompt, { model, taskType: 'customer_chat' });
      return {
        response: result.response,
        tokensUsed: result.tokensUsed,
      };
    } catch (error) {
      console.error('Failed to get customer response:', error);
      return {
        response: `Thanks for reaching out! I'll look into that and get back to you shortly.`,
      };
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Singleton instance
let client: OpenClawClient | null = null;

export const getOpenClawClient = (): OpenClawClient => {
  if (!client) {
    client = new OpenClawClient();
  }
  return client;
};

export default OpenClawClient;
