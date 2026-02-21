'use client';

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  vehicle_interest?: string;
  last_contact: number;
  unread_count: number;
  last_message?: string;
}

interface CustomerListProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading: boolean;
}

export default function CustomerList({
  customers,
  selectedCustomer,
  onSelectCustomer,
  searchQuery,
  onSearchChange,
  loading,
}: CustomerListProps) {
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      inquiry: 'bg-blue-500',
      configuring: 'bg-purple-500',
      test_drive: 'bg-yellow-500',
      negotiating: 'bg-orange-500',
      closed: 'bg-green-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="w-80 border-r border-gray-800 bg-gray-950 p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-gray-800 bg-gray-950 flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full input pl-10"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Customer List */}
      <div className="flex-1 overflow-y-auto">
        {customers.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <div className="text-4xl mb-2">👥</div>
            <p className="text-sm">
              {searchQuery ? 'No customers found' : 'No customers yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {customers.map((customer) => (
              <button
                key={customer.id}
                onClick={() => onSelectCustomer(customer)}
                className={`w-full text-left p-4 hover:bg-gray-800 transition-colors ${
                  selectedCustomer?.id === customer.id ? 'bg-gray-800' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{customer.name}</h3>
                    {customer.email && (
                      <p className="text-xs text-gray-400 truncate">{customer.email}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {customer.unread_count > 0 && (
                      <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {customer.unread_count}
                      </div>
                    )}
                    <span className="text-xs text-gray-500">
                      {getTimeAgo(customer.last_contact)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(
                      customer.status
                    )} text-white`}
                  >
                    {getStatusLabel(customer.status)}
                  </span>
                  {customer.vehicle_interest && (
                    <span className="text-xs text-gray-500 truncate">
                      🚗 {customer.vehicle_interest}
                    </span>
                  )}
                </div>

                {customer.last_message && (
                  <p className="text-sm text-gray-400 truncate">
                    {customer.last_message}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
