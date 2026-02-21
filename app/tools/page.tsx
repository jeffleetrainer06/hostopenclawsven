'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  telegramCommand: string;
}

const TOOLS: Tool[] = [
  {
    id: 'vehicle-recommend',
    name: 'Vehicle Recommendations',
    description: 'Get personalized Toyota recommendations based on customer needs',
    icon: '🚗',
    color: 'bg-red-500',
    telegramCommand: '/recommend',
  },
  {
    id: 'vehicle-compare',
    name: 'Vehicle Comparison',
    description: 'Compare Toyota vs competitors with specs, pricing & advantages',
    icon: '⚖️',
    color: 'bg-yellow-500',
    telegramCommand: '/compare',
  },
  {
    id: 'used-vehicle-match',
    name: 'Used Vehicle Match',
    description: 'Find matching pre-owned vehicles for customer requirements',
    icon: '💰',
    color: 'bg-green-500',
    telegramCommand: '/usedmatch',
  },
];

export default function MultiAgentTools() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-gray-950 border-b border-gray-800 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-2xl">
              🛠️
            </div>
            <div>
              <h1 className="text-3xl font-bold">Multi-Agent Tools</h1>
              <p className="text-gray-400 mt-1">
                Select a workflow to run with Sven's AI-powered analysis
              </p>
            </div>
          </div>
        </header>

        {/* Tool Selection */}
        <div className="p-6">
          {!selectedTool ? (
            <div className="space-y-4 max-w-4xl">
              {TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool)}
                  className="w-full text-left p-6 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 hover:bg-gray-750 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 ${tool.color} rounded-lg flex items-center justify-center text-3xl`}>
                      {tool.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-red-500 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-gray-400">{tool.description}</p>
                    </div>
                    <svg
                      className="w-6 h-6 text-gray-500 group-hover:text-red-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              ))}

              {/* Info Box */}
              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">ℹ️</div>
                  <div>
                    <p className="text-sm text-gray-300">
                      <strong>These tools are also available via Telegram:</strong>
                    </p>
                    <div className="mt-2 space-x-3 text-sm font-mono text-gray-400">
                      {TOOLS.map((tool, i) => (
                        <span key={tool.id}>
                          <span className="text-blue-400">{tool.telegramCommand}</span>
                          {i < TOOLS.length - 1 && <span className="text-gray-600"> , </span>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ToolInterface tool={selectedTool} onBack={() => setSelectedTool(null)} />
          )}
        </div>
      </main>
    </div>
  );
}

interface ToolInterfaceProps {
  tool: Tool;
  onBack: () => void;
}

function ToolInterface({ tool, onBack }: ToolInterfaceProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/agents/${tool.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.recommendation || data.comparison || data.matches || 'Result generated successfully');
      } else {
        setResult('Error: Failed to generate result');
      }
    } catch (error) {
      console.error('Tool execution failed:', error);
      setResult('Error: Failed to execute tool');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (tool.id) {
      case 'vehicle-recommend':
        return (
          <>
            <FormField
              label="Budget Range"
              name="budget"
              placeholder="e.g., $30K-$40K"
              value={formData.budget || ''}
              onChange={(v) => setFormData({ ...formData, budget: v })}
            />
            <FormField
              label="Primary Use Case"
              name="use_case"
              placeholder="e.g., Family with 2 kids, Daily commute, Weekend adventures"
              value={formData.use_case || ''}
              onChange={(v) => setFormData({ ...formData, use_case: v })}
            />
            <FormField
              label="Priorities (comma-separated)"
              name="priorities"
              placeholder="e.g., Safety, Fuel Economy, Space"
              value={formData.priorities || ''}
              onChange={(v) => setFormData({ ...formData, priorities: v })}
            />
            <FormField
              label="Special Requirements"
              name="requirements"
              placeholder="e.g., AWD, Third row seating, Towing capacity"
              value={formData.requirements || ''}
              onChange={(v) => setFormData({ ...formData, requirements: v })}
            />
          </>
        );

      case 'vehicle-compare':
        return (
          <>
            <FormField
              label="Toyota Vehicle"
              name="toyota_vehicle"
              placeholder="e.g., RAV4 Hybrid XLE"
              value={formData.toyota_vehicle || ''}
              onChange={(v) => setFormData({ ...formData, toyota_vehicle: v })}
              required
            />
            <FormField
              label="Competitor Vehicle"
              name="competitor_vehicle"
              placeholder="e.g., Honda CR-V Hybrid Sport"
              value={formData.competitor_vehicle || ''}
              onChange={(v) => setFormData({ ...formData, competitor_vehicle: v })}
              required
            />
            <FormField
              label="Focus Areas (comma-separated)"
              name="categories"
              placeholder="e.g., specs, price, features, reliability"
              value={formData.categories || ''}
              onChange={(v) => setFormData({ ...formData, categories: v })}
            />
          </>
        );

      case 'used-vehicle-match':
        return (
          <>
            <FormField
              label="Budget Range"
              name="budget"
              placeholder="e.g., $25K-$32K"
              value={formData.budget || ''}
              onChange={(v) => setFormData({ ...formData, budget: v })}
            />
            <FormField
              label="Vehicle Type"
              name="vehicle_type"
              placeholder="e.g., SUV, Sedan, Truck"
              value={formData.vehicle_type || ''}
              onChange={(v) => setFormData({ ...formData, vehicle_type: v })}
            />
            <FormField
              label="Must-Have Features (comma-separated)"
              name="features"
              placeholder="e.g., AWD, Sunroof, Backup Camera"
              value={formData.features || ''}
              onChange={(v) => setFormData({ ...formData, features: v })}
            />
            <FormField
              label="Max Mileage"
              name="max_miles"
              placeholder="e.g., 40000"
              type="number"
              value={formData.max_miles || ''}
              onChange={(v) => setFormData({ ...formData, max_miles: v })}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to tools
      </button>

      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 ${tool.color} rounded-lg flex items-center justify-center text-3xl`}>
            {tool.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{tool.name}</h2>
            <p className="text-gray-400 mt-1">{tool.description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderForm()}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary"
          >
            {loading ? '🤖 Analyzing...' : `Run ${tool.icon} ${tool.name}`}
          </button>
        </form>
      </div>

      {result && (
        <div className="card bg-gray-950">
          <h3 className="text-xl font-bold mb-4">Results:</h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono bg-gray-900 p-4 rounded-lg overflow-x-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}

function FormField({ label, name, placeholder, value, onChange, type = 'text', required = false }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input w-full"
        required={required}
      />
    </div>
  );
}
