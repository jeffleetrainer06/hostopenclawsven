'use client';

import { useState, useEffect, useRef } from 'react';
import ModelSelector from './ModelSelector';

interface Message {
  id: number;
  sender: 'jeff' | 'sven';
  message: string;
  timestamp: number;
}

export default function SvenChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'sven',
      message: "Hey Jeff! 👋 I'm Sven, your AI assistant. I'm here to help you with:\n\n✅ Analyzing customer data\n✅ Drafting messages\n✅ Managing your Command Center\n✅ Finding vehicle information\n✅ Generating reports\n\nWhat can I help you with today?",
      timestamp: Date.now() / 1000,
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState('anthropic/claude-sonnet-4-5');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const timestamp = Date.now() / 1000;

    // Add user message
    const newUserMsg: Message = {
      id: messages.length + 1,
      sender: 'jeff',
      message: userMessage,
      timestamp,
    };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setLoading(true);

    try {
      // TODO: Connect to OpenClaw gateway
      // For now, show a helpful response
      await new Promise(resolve => setTimeout(resolve, 1000));

      const svenResponse: Message = {
        id: messages.length + 2,
        sender: 'sven',
        message: "I'm currently in demo mode. To enable full AI functionality:\n\n1. Connect your OpenClaw gateway\n2. Set OPENCLAW_GATEWAY_URL environment variable\n3. Redeploy on Vercel\n\nFor now, I can help you navigate the Command Center! What would you like to do?",
        timestamp: Date.now() / 1000,
      };

      setMessages(prev => [...prev, svenResponse]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const quickActions = [
    { label: 'Analyze today\'s leads', action: 'analyze-leads' },
    { label: 'Draft follow-up message', action: 'draft-followup' },
    { label: 'Check inventory status', action: 'check-inventory' },
    { label: 'Sales report this month', action: 'sales-report' },
  ];

  const handleQuickAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      'analyze-leads': 'Analyze my active leads and tell me who needs follow-up',
      'draft-followup': 'Help me draft a follow-up message for a customer',
      'check-inventory': 'What\'s our current inventory status?',
      'sales-report': 'Generate a sales report for this month',
    };
    setInput(actionMessages[action] || '');
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="bg-gray-950 border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <h3 className="font-bold">Sven</h3>
              <p className="text-xs text-gray-400">Your AI Assistant</p>
            </div>
          </div>
          <ModelSelector
            currentModel={currentModel}
            onModelChange={setCurrentModel}
            compact
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'jeff' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-lg ${
                msg.sender === 'jeff'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs opacity-75 font-semibold">
                  {msg.sender === 'jeff' ? 'Jeff' : 'Sven'}
                </span>
                <span className="text-xs opacity-50">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="px-4 pb-3 border-t border-gray-800 pt-3 bg-gray-950/50">
          <p className="text-xs text-gray-400 mb-2">Quick Actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action.action}
                onClick={() => handleQuickAction(action.action)}
                className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-800 p-4 bg-gray-950">
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Sven anything..."
            className="flex-1 input resize-none"
            rows={2}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="btn btn-primary whitespace-nowrap px-6"
          >
            {loading ? '...' : '📤'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
