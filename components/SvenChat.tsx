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
      christi: "Morning, hon! 👔 I'm Christi, your office manager. I keep everything running smoothly around here.\n\n✅ Coordinating Isaac, Linda, and Margaret\n✅ Managing your priorities\n✅ Daily briefings\n✅ Keeping you organized\n\nWhat do you need today?",
      isaac: "Good day, Jeff! 🔬 I'm Isaac, your research specialist. Named after Isaac Newton - I believe in the power of observation and analysis.\n\n✅ Industry trends & automotive news\n✅ Vehicle specs & detailed comparisons\n✅ Competitor intelligence\n✅ Market research & data\n\nWhat shall we investigate today?",
      linda: "Hi Jeff! 👥 I'm Linda, your customer follow-up specialist. I'm here to help you nurture those customer relationships with care and attention.\n\n✅ Personalized follow-up messages\n✅ Thoughtful communication strategies\n✅ Detailed customer tracking\n✅ Kind, professional outreach\n\nWho should we reach out to today?",
      margaret: "Hey Jeff! 💻 I'm Margaret, your chief coder! Named after Margaret Hamilton who got us to the moon - I love building things that work.\n\n✅ Custom tools & calculators\n✅ Quick prototypes (Lovable.dev)\n✅ Automation & integrations\n✅ Command Center features\n\nWhat should we build?",
      seth: "Hey Jeff! 📱 I'm Seth, your social media strategist. Named after Seth Godin - I believe in remarkable content that people want to share.\n\n✅ Content that resonates\n✅ Story-driven posts\n✅ Permission marketing\n✅ Building your tribe\n\nWhat story should we tell today?",
      sven: "Hey Jeff! 👋 I'm Sven, your main assistant. I coordinate the team and help with anything you need.\n\n✅ Managing your Command Center\n✅ Coordinating other agents\n✅ Strategic decisions\n✅ Daily planning\n\nWhat can I help you with today?",
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
      // Call OpenClaw API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent: agentId,
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const agentResponse: Message = {
        id: messages.length + 2,
        sender: 'agent',
        message: data.response || 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now() / 1000,
      };

      setMessages(prev => [...prev, agentResponse]);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMsg: Message = {
        id: messages.length + 2,
        sender: 'agent',
        message: `I'm having trouble connecting to OpenClaw. Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\nMake sure the gateway is running and OPENCLAW_GATEWAY_URL is set.`,
        timestamp: Date.now() / 1000,
      };
      
      setMessages(prev => [...prev, errorMsg]);
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
