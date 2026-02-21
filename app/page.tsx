'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import ModelSelector from '@/components/ModelSelector';

export default function Dashboard() {
  const [currentModel, setCurrentModel] = useState('anthropic/claude-sonnet-4-5');
  const [stats, setStats] = useState({
    activeLeads: 0,
    testDrives: 0,
    monthlySales: 0,
    salesTarget: 20,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  const today = new Date();
  const monthName = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-gray-950 border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Jeff's Command Center</h1>
              <p className="text-gray-400 mt-1">
                {monthName} {year} · Pedersen Toyota
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ModelSelector
                currentModel={currentModel}
                onModelChange={setCurrentModel}
                compact
              />
              <Link
                href="/client-hub"
                className="btn btn-primary flex items-center gap-2"
              >
                <span>💬</span>
                Chat with Sven
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Quote */}
          <div className="card bg-gradient-to-r from-red-500/20 to-purple-500/20 border-red-500/30">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div className="flex-1">
                <p className="text-lg italic mb-2">
                  "Don't find customers for your products, find products for your customers."
                </p>
                <p className="text-sm text-gray-400">— Seth Godin</p>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="metric-label">Active Leads</div>
              <div className="metric-value text-blue-500">{stats.activeLeads}</div>
              <div className="text-sm text-green-500 flex items-center gap-1">
                <span>↗</span>
                <span>+0 this week</span>
              </div>
            </div>

            <div className="card">
              <div className="metric-label">Scheduled Test Drives</div>
              <div className="metric-value text-purple-500">{stats.testDrives}</div>
              <div className="text-sm text-gray-400">Today's: 0</div>
            </div>

            <div className="card">
              <div className="metric-label">Monthly Sales</div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="metric-value text-green-500">{stats.monthlySales}</div>
                <div className="text-xl text-gray-400">/ {stats.salesTarget}</div>
              </div>
              <div className="text-sm text-gray-400">
                Target: {stats.salesTarget}
              </div>
            </div>
          </div>

          {/* Urgent Tasks & Follow-ups */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="text-red-500">⚠️</span>
                URGENT TASKS & FOLLOW-UPS
              </h2>
              <button className="btn btn-secondary text-sm">
                + Add
              </button>
            </div>
            
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-lg">No tasks yet. Add your first task!</p>
              <Link href="/client-hub" className="mt-4 text-red-500 hover:underline">
                Go to Client Hub →
              </Link>
            </div>
          </div>

          {/* Calendar & Appointments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mini Calendar */}
            <div className="card lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4">{monthName} {year}</h3>
              <div className="text-center text-gray-400 py-8">
                <div className="text-5xl mb-2">{today.getDate()}</div>
                <div className="text-sm">Today</div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-400">Customer</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-400">Personal</span>
                </div>
              </div>
            </div>

            {/* Today's Appointments */}
            <div className="card lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">TODAY'S APPOINTMENTS</h3>
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="text-5xl mb-4">📅</div>
                <p>No appointments scheduled</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/client-hub" className="card hover:bg-gray-700 transition-colors cursor-pointer text-center">
              <div className="text-4xl mb-2">💬</div>
              <div className="font-medium">Client Hub</div>
            </Link>
            <Link href="/follow-up" className="card hover:bg-gray-700 transition-colors cursor-pointer text-center">
              <div className="text-4xl mb-2">📞</div>
              <div className="font-medium">Follow Up</div>
            </Link>
            <Link href="/vehicles" className="card hover:bg-gray-700 transition-colors cursor-pointer text-center">
              <div className="text-4xl mb-2">🚗</div>
              <div className="font-medium">Vehicles</div>
            </Link>
            <Link href="/budget" className="card hover:bg-gray-700 transition-colors cursor-pointer text-center">
              <div className="text-4xl mb-2">💰</div>
              <div className="font-medium">Budget</div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
