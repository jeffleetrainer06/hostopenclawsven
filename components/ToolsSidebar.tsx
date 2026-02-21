'use client';

import { useState } from 'react';
import { customerTools, getFavoriteTools, type CustomerTool } from '@/lib/customer-tools';

interface ToolsSidebarProps {
  customerId?: number;
}

export default function ToolsSidebar({ customerId }: ToolsSidebarProps) {
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(getFavoriteTools().map(t => t.id))
  );

  const toggleFavorite = (toolId: string) => {
    setFavorites(prev => {
      const updated = new Set(prev);
      if (updated.has(toolId)) {
        updated.delete(toolId);
      } else {
        updated.add(toolId);
      }
      return updated;
    });
  };

  const copyToolLink = (tool: CustomerTool) => {
    const message = `Hi! 👋

${tool.description}

Here's your link:
🔗 ${tool.url}

Let me know if you have any questions!

- Jeff`;

    navigator.clipboard.writeText(message);
    alert(`✅ Message copied! Paste it in the chat or text to your customer.`);
  };

  const sendViaEmail = (tool: CustomerTool) => {
    const subject = encodeURIComponent(`${tool.name} - From Jeff at Pedersen Toyota`);
    const body = encodeURIComponent(`Hi!

${tool.description}

Here's your link:
${tool.url}

Let me know if you have any questions!

Best regards,
Jeff Lee
Pedersen Toyota
(970) 223-2804`);

    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const favoriteTools = customerTools.filter(t => favorites.has(t.id));
  const allTools = customerTools;

  return (
    <div className="w-80 bg-gray-950 border-l border-gray-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
          🔗 TOOLS TO SEND CUSTOMER
        </h3>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Favorites */}
        {favoriteTools.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
              ⭐ Favorites
            </h4>
            <div className="space-y-2">
              {favoriteTools.map(tool => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                  onCopyLink={copyToolLink}
                  onSendEmail={sendViaEmail}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Tools */}
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            All Tools (click ⭐ to favorite)
          </h4>
          <div className="space-y-2">
            {allTools.map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isFavorite={favorites.has(tool.id)}
                onToggleFavorite={toggleFavorite}
                onCopyLink={copyToolLink}
                onSendEmail={sendViaEmail}
              />
            ))}
          </div>
        </div>

        {/* Customer Portal Section */}
        {customerId && (
          <div className="pt-4 border-t border-gray-800">
            <h4 className="text-sm font-semibold text-teal-400 mb-3">
              CUSTOMER PORTAL (90-DAY ACCESS)
            </h4>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 transition-colors">
                <div className="flex items-center gap-2 text-sm">
                  <span>📋</span>
                  <span className="text-teal-300">Get Link to Text Customer (90 days)</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-750 transition-colors">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span>✉️</span>
                  <span>Send Portal Invite (in chat)</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Customer Actions */}
        {customerId && (
          <div className="pt-4 border-t border-gray-800">
            <h4 className="text-sm font-semibold text-orange-400 mb-3">
              CUSTOMER ACTIONS
            </h4>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 transition-colors">
                <div className="flex items-center gap-2 text-sm">
                  <span>⏰</span>
                  <span className="text-orange-300">Close Portal Access (Purchased/Not Interested)</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors">
                <div className="flex items-center gap-2 text-sm">
                  <span>🗑️</span>
                  <span className="text-red-300">Delete Customer Permanently</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ToolCardProps {
  tool: CustomerTool;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
  onCopyLink: (tool: CustomerTool) => void;
  onSendEmail: (tool: CustomerTool) => void;
}

function ToolCard({ tool, isFavorite, onToggleFavorite, onCopyLink, onSendEmail }: ToolCardProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="relative p-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 transition-all group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0">{tool.icon}</span>
          <div className="flex-1 min-w-0">
            <h5 className="font-medium text-sm text-white truncate">{tool.name}</h5>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{tool.description}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(tool.id);
          }}
          className="flex-shrink-0 text-lg hover:scale-110 transition-transform"
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      {/* Quick Actions */}
      {showActions && (
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-700">
          <button
            onClick={() => onCopyLink(tool)}
            className="flex-1 text-xs py-1.5 px-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            title="Copy message to clipboard"
          >
            📋 Copy
          </button>
          <button
            onClick={() => onSendEmail(tool)}
            className="flex-1 text-xs py-1.5 px-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
            title="Send via email"
          >
            ✉️ Email
          </button>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-xs py-1.5 px-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-center"
            title="Open link"
          >
            🔗 Open
          </a>
        </div>
      )}
    </div>
  );
}
