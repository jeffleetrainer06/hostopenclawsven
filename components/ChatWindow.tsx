'use client';

import { useState, useEffect, useRef } from 'react';
import ModelSelector from './ModelSelector';

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  vehicle_interest?: string;
}

interface Message {
  id: number;
  customer_id: number;
  message: string;
  sender: 'customer' | 'jeff' | 'sven';
  timestamp: number;
  read: number;
}

interface ChatWindowProps {
  customer: Customer;
  onCustomerUpdate: () => void;
}

export default function ChatWindow({ customer, onCustomerUpdate }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedModel, setSuggestedModel] = useState('anthropic/claude-sonnet-4-5');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    markAsRead();
  }, [customer.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const res = await fetch(`/api/conversations/${customer.id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const markAsRead = async () => {
    try {
      await fetch(`/api/conversations/${customer.id}/read`, { method: 'POST' });
      onCustomerUpdate();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const messageText = input.trim();
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`/api/conversations/${customer.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          sender: 'jeff',
        }),
      });

      if (res.ok) {
        await loadMessages();
        onCustomerUpdate();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSuggestion = async () => {
    setLoading(true);
    setShowSuggestion(true);

    try {
      const res = await fetch(`/api/conversations/${customer.id}/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: suggestedModel }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiSuggestion(data.suggestion);
      }
    } catch (error) {
      console.error('Failed to get AI suggestion:', error);
      setAiSuggestion('Sorry, I couldn\'t generate a suggestion right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseSuggestion = () => {
    setInput(aiSuggestion);
    setShowSuggestion(false);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Chat Header */}
      <div className="bg-gray-950 border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold">{customer.name}</h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
              {customer.email && <span>📧 {customer.email}</span>}
              {customer.phone && <span>📱 {customer.phone}</span>}
              {customer.vehicle_interest && (
                <span className="text-blue-400">🚗 {customer.vehicle_interest}</span>
              )}
            </div>
          </div>
          <ModelSelector
            currentModel={suggestedModel}
            onModelChange={setSuggestedModel}
            compact
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-5xl mb-4">👋</div>
              <p>Start the conversation with {customer.name}</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isJeff = msg.sender === 'jeff';
              const isSven = msg.sender === 'sven';
              
              return (
                <div
                  key={msg.id}
                  className={`flex ${isJeff || isSven ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-lg ${
                      isJeff
                        ? 'bg-blue-600 text-white'
                        : isSven
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs opacity-75 font-semibold">
                        {isJeff ? 'Jeff' : isSven ? 'Sven (AI)' : customer.name}
                      </span>
                      <span className="text-xs opacity-50">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* AI Suggestion Panel */}
      {showSuggestion && aiSuggestion && (
        <div className="border-t border-gray-800 bg-purple-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🤖</div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Sven's Suggestion:</h4>
              <p className="text-sm text-gray-300 mb-3 whitespace-pre-wrap">{aiSuggestion}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUseSuggestion}
                  className="btn btn-primary text-sm"
                >
                  Use This
                </button>
                <button
                  onClick={() => setShowSuggestion(false)}
                  className="btn btn-secondary text-sm"
                >
                  Dismiss
                </button>
              </div>
            </div>
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
            placeholder={`Message ${customer.name}...`}
            className="flex-1 input resize-none"
            rows={3}
            disabled={loading}
          />
          <div className="flex flex-col gap-2">
            <button
              onClick={handleGetSuggestion}
              disabled={loading}
              className="btn btn-secondary whitespace-nowrap"
              title="Get AI-powered suggestion"
            >
              🤖 Suggest
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="btn btn-primary whitespace-nowrap"
            >
              {loading ? '...' : '📤 Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
