'use client';

interface Agent {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

export const agents: Agent[] = [
  {
    id: 'sven',
    name: 'Sven',
    emoji: '🦞',
    description: 'Main Assistant - Coordinates everything',
    color: 'purple',
  },
  {
    id: 'scout',
    name: 'Scout',
    emoji: '🔍',
    description: 'Research & Intelligence',
    color: 'blue',
  },
  {
    id: 'buzz',
    name: 'Buzz',
    emoji: '📱',
    description: 'Social Media & Marketing',
    color: 'pink',
  },
  {
    id: 'echo',
    name: 'Echo',
    emoji: '💬',
    description: 'Customer Communications',
    color: 'teal',
  },
  {
    id: 'atlas',
    name: 'Atlas',
    emoji: '📊',
    description: 'Analytics & Reporting',
    color: 'orange',
  },
  {
    id: 'forge',
    name: 'Forge',
    emoji: '🔨',
    description: 'Development & Tools Builder',
    color: 'red',
  },
];

interface AgentSelectorProps {
  activeAgent: string;
  onSelectAgent: (agentId: string) => void;
}

export default function AgentSelector({ activeAgent, onSelectAgent }: AgentSelectorProps) {
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
      <h4 className="text-xs font-semibold text-gray-400 px-2">YOUR AGENT TEAM</h4>
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
    </div>
  );
}
