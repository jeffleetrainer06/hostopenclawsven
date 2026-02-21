// Optional database wrapper - falls back to mock data if SQLite unavailable
let db: any = null;
let useMockData = false;

try {
  // Only import SQLite in Node.js environment (not during build)
  if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
    const Database = require('better-sqlite3');
    const { join } = require('path');
    const dbPath = join(process.cwd(), 'data', 'command-center.db');
    db = new Database(dbPath);
    
    // Initialize schema
    db.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        status TEXT DEFAULT 'inquiry',
        vehicle_interest TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        last_contact INTEGER DEFAULT (strftime('%s', 'now')),
        notes TEXT
      );
      -- ... rest of schema
    `);
  } else {
    useMockData = true;
  }
} catch (error) {
  console.warn('SQLite not available, using mock data:', error);
  useMockData = true;
}

// Mock data for when database is unavailable
const mockCustomers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(970) 555-0123",
    status: "active",
    vehicle_interest: "2024 RAV4 Hybrid",
    created_at: Math.floor(Date.now() / 1000) - 86400 * 3,
    last_contact: Math.floor(Date.now() / 1000) - 3600,
    notes: "Interested in hybrid models",
    unread_count: 2,
    last_message: "Thanks for the info! When can I test drive?"
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    email: "mike.r@company.com",
    phone: "(970) 555-0456",
    status: "hot",
    vehicle_interest: "Tacoma TRD Pro",
    created_at: Math.floor(Date.now() / 1000) - 86400 * 7,
    last_contact: Math.floor(Date.now() / 1000) - 7200,
    notes: "Cash buyer, ready to purchase",
    unread_count: 0,
    last_message: "I'll come by tomorrow at 2pm"
  },
];

export const getCustomers = () => {
  if (useMockData || !db) return mockCustomers;
  
  return db.prepare(`
    SELECT 
      c.*,
      (SELECT COUNT(*) FROM conversations WHERE customer_id = c.id AND sender = 'customer' AND read = 0) as unread_count,
      (SELECT message FROM conversations WHERE customer_id = c.id ORDER BY timestamp DESC LIMIT 1) as last_message
    FROM customers c
    ORDER BY last_contact DESC
  `).all();
};

export const getCustomer = (id: number) => {
  if (useMockData || !db) {
    return mockCustomers.find(c => c.id === id);
  }
  return db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
};

export const addCustomer = (data: any) => {
  if (useMockData || !db) {
    console.warn('Mock mode: customer not persisted');
    return { changes: 1, lastInsertRowid: mockCustomers.length + 1 };
  }
  const stmt = db.prepare(`
    INSERT INTO customers (name, email, phone, vehicle_interest, notes)
    VALUES (?, ?, ?, ?, ?)
  `);
  return stmt.run(
    data.name,
    data.email || null,
    data.phone || null,
    data.vehicle_interest || null,
    data.notes || null
  );
};

// Add other functions with similar mock fallbacks...
export const updateCustomer = (id: number, data: any) => {
  if (useMockData || !db) return { changes: 1 };
  const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
  const values = Object.values(data);
  const stmt = db.prepare(`UPDATE customers SET ${fields}, last_contact = strftime('%s', 'now') WHERE id = ?`);
  return stmt.run(...values, id);
};

export const getConversations = (customerId: number) => {
  if (useMockData || !db) return [];
  return db.prepare('SELECT * FROM conversations WHERE customer_id = ? ORDER BY timestamp ASC').all(customerId);
};

export const addMessage = (customerId: number, message: string, sender: string) => {
  if (useMockData || !db) return { changes: 1 };
  const stmt = db.prepare('INSERT INTO conversations (customer_id, message, sender) VALUES (?, ?, ?)');
  db.prepare('UPDATE customers SET last_contact = strftime(\'%s\', \'now\') WHERE id = ?').run(customerId);
  return stmt.run(customerId, message, sender);
};

export const markAsRead = (customerId: number) => {
  if (useMockData || !db) return { changes: 1 };
  return db.prepare('UPDATE conversations SET read = 1 WHERE customer_id = ? AND sender = \'customer\'').run(customerId);
};

export const getFollowUps = (customerId?: number) => {
  if (useMockData || !db) return [];
  if (customerId) {
    return db.prepare(`
      SELECT f.*, c.name as customer_name FROM follow_ups f
      JOIN customers c ON f.customer_id = c.id
      WHERE f.customer_id = ? AND f.completed = 0 ORDER BY f.due_date ASC
    `).all(customerId);
  }
  return db.prepare(`
    SELECT f.*, c.name as customer_name FROM follow_ups f
    JOIN customers c ON f.customer_id = c.id
    WHERE f.completed = 0 ORDER BY f.due_date ASC
  `).all();
};

export const addFollowUp = (customerId: number, dueDate: number, notes: string, priority = 'medium') => {
  if (useMockData || !db) return { changes: 1 };
  return db.prepare('INSERT INTO follow_ups (customer_id, due_date, notes, priority) VALUES (?, ?, ?, ?)').run(customerId, dueDate, notes, priority);
};

export const completeFollowUp = (id: number) => {
  if (useMockData || !db) return { changes: 1 };
  return db.prepare('UPDATE follow_ups SET completed = 1 WHERE id = ?').run(id);
};

export const getModelPreferences = () => {
  if (useMockData || !db) return [];
  return db.prepare('SELECT * FROM model_preferences ORDER BY task_type').all();
};

export const setModelPreference = (taskType: string, model: string, description?: string) => {
  if (useMockData || !db) return { changes: 1 };
  return db.prepare(`
    INSERT INTO model_preferences (task_type, model, description)
    VALUES (?, ?, ?) ON CONFLICT(task_type) DO UPDATE SET model = ?, description = ?
  `).run(taskType, model, description || null, model, description || null);
};

export const getModelPreference = (taskType: string) => {
  if (useMockData || !db) return null;
  return db.prepare('SELECT * FROM model_preferences WHERE task_type = ?').get(taskType);
};

export const trackUsage = (sessionKey: string, model: string, tokensUsed: number, taskType?: string) => {
  if (useMockData || !db) return { changes: 1 };
  const costPerMillion: { [key: string]: number } = {
    'anthropic/claude-haiku-4-5': 0.80,
    'anthropic/claude-sonnet-4-5': 3.00,
    'anthropic/claude-opus-4-6': 15.00,
  };
  const costEstimate = (tokensUsed / 1_000_000) * (costPerMillion[model] || 3.00);
  return db.prepare('INSERT INTO usage_tracking (session_key, model, tokens_used, cost_estimate, task_type) VALUES (?, ?, ?, ?, ?)').run(sessionKey, model, tokensUsed, costEstimate, taskType || null);
};

export const getUsageStats = (days = 30) => {
  if (useMockData || !db) return [];
  const since = Math.floor(Date.now() / 1000) - (days * 86400);
  return db.prepare(`
    SELECT model, COUNT(*) as request_count, SUM(tokens_used) as total_tokens, SUM(cost_estimate) as total_cost
    FROM usage_tracking WHERE timestamp > ? GROUP BY model ORDER BY total_cost DESC
  `).all(since);
};

export const getUsageByTaskType = (days = 30) => {
  if (useMockData || !db) return [];
  const since = Math.floor(Date.now() / 1000) - (days * 86400);
  return db.prepare(`
    SELECT task_type, model, COUNT(*) as request_count, SUM(tokens_used) as total_tokens, SUM(cost_estimate) as total_cost
    FROM usage_tracking WHERE timestamp > ? AND task_type IS NOT NULL
    GROUP BY task_type, model ORDER BY task_type, total_cost DESC
  `).all(since);
};

export default db;
