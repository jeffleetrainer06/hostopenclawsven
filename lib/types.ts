export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  vehicle_interest?: string;
  created_at: number;
  last_contact: number;
  notes?: string;
  unread_count?: number;
  last_message?: string;
}

export interface Conversation {
  id: number;
  customer_id: number;
  message: string;
  sender: 'customer' | 'jeff' | 'sven';
  timestamp: number;
  read: number;
}

export interface FollowUp {
  id: number;
  customer_id: number;
  due_date: number;
  priority: string;
  notes?: string;
  completed: number;
  customer_name?: string;
}

export interface ModelPreference {
  id: number;
  task_type: string;
  model: string;
  description?: string;
}

export interface UsageTracking {
  id: number;
  session_key: string;
  model: string;
  tokens_used: number;
  cost_estimate: number;
  task_type?: string;
  timestamp: number;
}
