'use client';

import { useState, useEffect } from 'react';

interface Model {
  id: string;
  name: string;
  cost: string;
  speed: string;
  description: string;
  color: string;
}

const MODELS: Model[] = [
  {
    id: 'anthropic/claude-haiku-4-5',
    name: 'Claude Haiku',
    cost: '$0.80/M tokens',
    speed: 'Fastest',
    description: 'Quick responses, simple tasks',
    color: 'bg-green-500',
  },
  {
    id: 'anthropic/claude-sonnet-4-5',
    name: 'Claude Sonnet',
    cost: '$3.00/M tokens',
    speed: 'Balanced',
    description: 'Most conversations, drafting',
    color: 'bg-blue-500',
  },
  {
    id: 'anthropic/claude-opus-4-6',
    name: 'Claude Opus',
    cost: '$15.00/M tokens',
    speed: 'Powerful',
    description: 'Complex analysis, strategy',
    color: 'bg-purple-500',
  },
];

interface ModelSelectorProps {
  currentModel?: string;
  taskType?: string;
  onModelChange: (model: string) => void;
  compact?: boolean;
}

export default function ModelSelector({ 
  currentModel, 
  taskType,
  onModelChange, 
  compact = false 
}: ModelSelectorProps) {
  const [selected, setSelected] = useState(currentModel || 'anthropic/claude-sonnet-4-5');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (currentModel) {
      setSelected(currentModel);
    }
  }, [currentModel]);

  const handleSelect = (modelId: string) => {
    setSelected(modelId);
    onModelChange(modelId);
    setShowDropdown(false);
  };

  const selectedModel = MODELS.find(m => m.id === selected) || MODELS[1];

  if (compact) {
    return (
      <div className="relative inline-block">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          <div className={`w-2 h-2 rounded-full ${selectedModel.color}`} />
          <span className="font-medium">{selectedModel.name}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => handleSelect(model.id)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  model.id === selected ? 'bg-gray-700' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 ${model.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-xs text-gray-400">{model.cost}</span>
                    </div>
                    <p className="text-xs text-gray-400">{model.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        AI Model {taskType && `(${taskType.replace('_', ' ')})`}
      </label>
      <div className="grid gap-3">
        {MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => handleSelect(model.id)}
            className={`text-left p-4 rounded-lg border transition-all ${
              model.id === selected
                ? 'border-red-500 bg-red-500/10'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-4 h-4 rounded-full mt-1 ${model.color}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{model.name}</span>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">{model.speed}</span>
                    <span className="text-gray-500">{model.cost}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{model.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
