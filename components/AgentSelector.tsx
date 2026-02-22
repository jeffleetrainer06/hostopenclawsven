'use client';

import { useState } from 'react';

interface Agent {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  avatar?: string;
}

// Core 4-agent team (Phase 1)
export const agents: Agent[] = [
  {
    id: 'christi',
    name: 'Christi',
    emoji: '👔',
    description: 'Office Manager - Your right hand',
    color: 'purple',
    avatar: '/avatars/christi.png',
  },
  {
    id: 'isaac',
    name: 'Isaac',
    emoji: '🔬',
    description: 'Research Agent - After Isaac Newton',
    color: 'blue',
    avatar: '/avatars/isaac.png',
  },
  {
    id: 'linda',
    name: 'Linda',
    emoji: '👥',
    description: 'Customer Follow-Up Agent',
    color: 'teal',
    avatar: '/avatars/linda.png',
  },
  {
    id: 'margaret',
    name: 'Margaret',
    emoji: '💻',
    description: 'Chief Coder - After Margaret Hamilton',
    color: 'red',
    avatar: '/avatars/margaret.png',
  },
];

// Coming soon (Phase 2)
export const comingSoonAgents: Agent[] = [
  {
    id: 'seth',
    name: 'Seth',
    emoji: '📱',
    description: 'Social Media Agent - After Seth Godin',
    color: 'orange',
    avatar: '/avatars/seth.png',
  },
  {
    id: 'atlas',
    name: 'Atlas',
    emoji: '📊',
    description: 'Analytics Expert',
    color: 'green',
  },
];

interface AgentSelectorProps {
  activeAgent: string;
  onSelectAgent: (agentId: string) => void;
}

export default function AgentSelector({ activeAgent, onSelectAgent }: AgentSelectorProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const getColorClasses = (agentId: string, isActive: boolean) => {
    const agent = agents.find(a => a.id === agentId);
    const color = agent?.color || 'gray';
    
    if (isActive) {
      const activeColors: Record<string, string> = {
        purple: 'bg-purple-500/20 border-purple-500 text-purple-300',
        blue: 'bg-blue-500/20 border-blue-500 text-blue-300',
        pink: 'bg-pink-500/20 border-pink-500 text-pink-300',
        teal: 'bg-teal-500/20 border-teal-500 text-teal-300',
        orange: 'bg-orange-500/20 border-orange-500 text-orange-300',
        red: 'bg-red-500/20 border-red-500 text-red-300',
      };
      return activeColors[color] || 'bg-gray-500/20 border-gray-500';
    }
    
    return 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750 hover:border-gray-600';
  };

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-gray-400 px-2">YOUR AGENT TEAM (PHASE 1)</h4>
      {agents.map((agent) => {
        const isActive = activeAgent === agent.id;
        return (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(agent.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg border-2 transition-all ${getColorClasses(agent.id, isActive)}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{agent.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{agent.name}</div>
                <div className="text-xs opacity-75 truncate">{agent.description}</div>
              </div>
              {isActive && <span className="text-sm">●</span>}
            </div>
          </button>
        );
      })}
      
      {/* Coming Soon Section */}
      <div className="pt-4 mt-4 border-t border-gray-800">
        <button
          onClick={() => setShowComingSoon(!showComingSoon)}
          className="w-full text-left text-xs font-semibold text-gray-500 px-2 hover:text-gray-400 transition-colors"
        >
          {showComingSoon ? '▼' : '▶'} COMING SOON (PHASE 2)
        </button>
        
        {showComingSoon && (
          <div className="mt-2 space-y-2">
            {comingSoonAgents.map((agent) => (
              <div
                key={agent.id}
                className="px-3 py-2.5 rounded-lg bg-gray-800/50 border-2 border-gray-700/50 opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{agent.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-400">{agent.name}</div>
                    <div className="text-xs text-gray-500 truncate">{agent.description}</div>
                  </div>
                  <span className="text-xs text-gray-500">Soon</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
