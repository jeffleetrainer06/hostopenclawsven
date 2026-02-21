'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export default function Sidebar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/', icon: '📊' },
    { label: "Jeff's Client Hub", href: '/client-hub', icon: '💬' },
    { label: 'Calendar', href: '/calendar', icon: '📅' },
    { label: 'Lead Follow Up', href: '/follow-up', icon: '👥' },
    { label: 'Vehicle Comparison', href: '/vehicles', icon: '🚗' },
    { label: 'Vehicle Request', href: '/requests', icon: '📝' },
    { label: 'Multi-Agent Tools', href: '/tools', icon: '🛠️' },
    { label: 'Memory', href: '/memory', icon: '🧠' },
    { label: 'Budget Monitor', href: '/budget', icon: '💰' },
    { label: 'Brochure Library', href: '/library', icon: '📚' },
  ];

  return (
    <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-xl font-bold">
            S
          </div>
          <div>
            <h1 className="font-bold text-lg">SVEN</h1>
            <p className="text-xs text-gray-400">Pedersen Toyota</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <div>
            <p className="text-sm font-medium">Sven Online</p>
            <p className="text-xs text-gray-400">Ready to assist</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
