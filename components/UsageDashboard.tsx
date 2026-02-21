'use client';

import { useEffect, useState } from 'react';

interface UsageStats {
  model: string;
  request_count: number;
  total_tokens: number;
  total_cost: number;
}

interface TaskUsage {
  task_type: string;
  model: string;
  request_count: number;
  total_tokens: number;
  total_cost: number;
}

export default function UsageDashboard() {
  const [stats, setStats] = useState<UsageStats[]>([]);
  const [taskStats, setTaskStats] = useState<TaskUsage[]>([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [days]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/usage?days=${days}`);
      const data = await res.json();
      setStats(data.byModel || []);
      setTaskStats(data.byTask || []);
    } catch (error) {
      console.error('Failed to load usage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalCost = stats.reduce((sum, s) => sum + s.total_cost, 0);
  const totalTokens = stats.reduce((sum, s) => sum + s.total_tokens, 0);
  const totalRequests = stats.reduce((sum, s) => sum + s.request_count, 0);

  const getModelName = (fullId: string) => {
    if (fullId.includes('haiku')) return 'Haiku';
    if (fullId.includes('sonnet')) return 'Sonnet';
    if (fullId.includes('opus')) return 'Opus';
    return fullId;
  };

  const getModelColor = (fullId: string) => {
    if (fullId.includes('haiku')) return 'bg-green-500';
    if (fullId.includes('sonnet')) return 'bg-blue-500';
    if (fullId.includes('opus')) return 'bg-purple-500';
    return 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-24 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Usage & Costs</h2>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="input"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="metric-label">Total Cost</div>
          <div className="metric-value text-red-500">${totalCost.toFixed(2)}</div>
        </div>
        <div className="card">
          <div className="metric-label">Total Tokens</div>
          <div className="metric-value">{(totalTokens / 1000).toFixed(1)}K</div>
        </div>
        <div className="card">
          <div className="metric-label">Requests</div>
          <div className="metric-value">{totalRequests}</div>
        </div>
      </div>

      {/* By Model */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Usage by Model</h3>
        <div className="space-y-3">
          {stats.map((stat) => (
            <div key={stat.model} className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${getModelColor(stat.model)}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{getModelName(stat.model)}</span>
                  <span className="text-sm text-gray-400">${stat.total_cost.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{stat.request_count} requests</span>
                  <span>{(stat.total_tokens / 1000).toFixed(1)}K tokens</span>
                </div>
              </div>
              <div className="w-32">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getModelColor(stat.model)}`}
                    style={{ width: `${(stat.total_cost / totalCost) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* By Task Type */}
      {taskStats.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Usage by Task Type</h3>
          <div className="space-y-4">
            {Object.entries(
              taskStats.reduce((acc, stat) => {
                if (!acc[stat.task_type]) acc[stat.task_type] = [];
                acc[stat.task_type].push(stat);
                return acc;
              }, {} as Record<string, TaskUsage[]>)
            ).map(([taskType, tasks]) => {
              const taskTotal = tasks.reduce((sum, t) => sum + t.total_cost, 0);
              return (
                <div key={taskType}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">
                      {taskType.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-400">${taskTotal.toFixed(2)}</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    {tasks.map((task) => (
                      <div key={task.model} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getModelColor(task.model)}`} />
                          <span className="text-gray-400">{getModelName(task.model)}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500">
                          <span>{task.request_count}x</span>
                          <span>${task.total_cost.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Optimization Suggestions */}
      {stats.length > 0 && (
        <div className="card bg-blue-500/10 border-blue-500/30">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <span>💡</span> Optimization Tips
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {stats.find(s => s.model.includes('opus')) && (
              <li>
                • Consider using <strong>Sonnet</strong> for routine conversations to reduce costs
              </li>
            )}
            {stats.find(s => s.model.includes('sonnet')) && (
              <li>
                • Use <strong>Haiku</strong> for quick acknowledgments and simple follow-ups
              </li>
            )}
            {totalCost > 10 && (
              <li>
                • You could save ~40% by using cheaper models for simple tasks
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
