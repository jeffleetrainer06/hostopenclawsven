'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import CustomerList from '@/components/CustomerList';
import ChatWindow from '@/components/ChatWindow';
import AddCustomerModal from '@/components/AddCustomerModal';

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

export default function ClientHub() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerAdded = () => {
    loadCustomers();
    setShowAddModal(false);
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.vehicle_interest?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = customers.filter(c => c.status !== 'closed').length;
  const unreadCount = customers.reduce((sum, c) => sum + c.unread_count, 0);

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-950 border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">💬 Jeff's Client Hub</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-gray-400">{activeCount} Active</span>
                </div>
                {unreadCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-gray-400">{unreadCount} Unread</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/requests" className="btn btn-secondary text-sm">
                🚗 Vehicle Request Form
              </Link>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary text-sm"
              >
                + Add Customer
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Customer List */}
          <CustomerList
            customers={filteredCustomers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={handleCustomerSelect}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            loading={loading}
          />

          {/* Chat Window */}
          {selectedCustomer ? (
            <ChatWindow
              customer={selectedCustomer}
              onCustomerUpdate={loadCustomers}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-2xl font-semibold mb-2">Select a conversation</h2>
                <p>Choose a customer from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onCustomerAdded={handleCustomerAdded}
        />
      )}
    </div>
  );
}

// Missing Link import
import Link from 'next/link';
