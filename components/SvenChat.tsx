'use client';

import { useState, useEffect, useRef } from 'react';
import ModelSelector from './ModelSelector';
import { agents } from './AgentSelector';

interface Message {
  id: number;
  sender: 'jeff' | 'agent';
  message: string;
  timestamp: number;
}

interface SvenChatProps {
  agentId?: string;
}

export default function SvenChat({ agentId = 'sven' }: SvenChatProps) {
  const agent = agents.find(a => a.id === agentId) || agents[0];
  const getInitialMessage = (agentId: string): Message => {
    const messages: Record<string, string> = {
      sven: "Hey Jeff! 👋 I'm Sven, your main assistant. I coordinate the team and help with anything you need.\n\n✅ Managing your Command Center\n✅ Coordinating other agents\n✅ Strategic decisions\n✅ Daily planning\n\nWhat can I help you with today?",
      scout: "Hey Jeff! 🔍 I'm Scout, your research specialist.\n\n✅ Industry trends & news\n✅ Vehicle specs & comparisons\n✅ Competitor analysis\n✅ Market intelligence\n\nWhat do you want to research?",
      buzz: "Hey Jeff! 📱 I'm Buzz, your social media strategist.\n\n✅ Content ideas (Instagram, Facebook, TikTok)\n✅ Post copy & video scripts\n✅ Hashtag strategy\n✅ Campaign planning\n\nNeed content for today?",
      echo: "Hey Jeff! 💬 I'm Echo, your customer communication specialist.\n\n✅ Follow-up message drafting\n✅ Appointment reminders\n✅ Objection handling scripts\n✅ Re-engagement campaigns\n\nWho needs a follow-up?",
      atlas: "Hey Jeff! 📊 I'm Atlas, your analytics specialist.\n\n✅ Performance dashboards\n✅ Sales tracking\n✅ Goal progress\n✅ Forecasting\n\nWhat metrics do you want to see?",
      forge: "Hey Jeff! 🔨 I'm Forge, your development specialist.\n\n✅ Build custom tools & calculators\n✅ Code generation (React, TypeScript, Python)\n✅ Lovable.dev integrations\n✅ Automation scripts\n\nWhat should we build today?",
    };
    
    return {
      id: 1,
      sender: 'agent',
      message: messages[agentId] || messages.sven,
      timestamp: Date.now() / 1000,
    };
  };

  const [messages, setMessages] = useState<Message[]>([getInitialMessage(agentId)]);

  // Reset messages when agent changes
  useEffect(() => {
    setMessages([getInitialMessage(agentId)]);
  }, [agentId]);
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

      const agentResponse: Message = {
        id: messages.length + 2,
        sender: 'agent',
        message: `I'm currently in demo mode. To enable full AI functionality:\n\n1. Connect your OpenClaw gateway\n2. Set OPENCLAW_GATEWAY_URL environment variable\n3. Redeploy on Vercel\n\nFor now, I can help you navigate the Command Center! What would you like to do?`,
        timestamp: Date.now() / 1000,
      };

      setMessages(prev => [...prev, agentResponse]);
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
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${agent.color}-500 to-${agent.color}-600 flex items-center justify-center text-xl`}>
              {agent.emoji}
            </div>
            <div>
              <h3 className="font-bold">{agent.name}</h3>
              <p className="text-xs text-gray-400">{agent.description}</p>
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
                  {msg.sender === 'jeff' ? 'Jeff' : agent.name}
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
            placeholder={`Ask ${agent.name} anything...`}
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
