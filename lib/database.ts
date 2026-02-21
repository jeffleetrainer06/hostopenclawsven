import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'data', 'command-center.db');
const db = new Database(dbPath);

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

  CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    sender TEXT NOT NULL,
    timestamp INTEGER DEFAULT (strftime('%s', 'now')),
    read INTEGER DEFAULT 0,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );

  CREATE TABLE IF NOT EXISTS follow_ups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    due_date INTEGER NOT NULL,
    priority TEXT DEFAULT 'medium',
    notes TEXT,
    completed INTEGER DEFAULT 0,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );

  CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS model_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_type TEXT NOT NULL UNIQUE,
    model TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS usage_tracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_key TEXT NOT NULL,
    model TEXT NOT NULL,
    tokens_used INTEGER,
    cost_estimate REAL,
    task_type TEXT,
    timestamp INTEGER DEFAULT (strftime('%s', 'now'))
  );

  CREATE INDEX IF NOT EXISTS idx_conversations_customer ON conversations(customer_id);
  CREATE INDEX IF NOT EXISTS idx_follow_ups_customer ON follow_ups(customer_id);
  CREATE INDEX IF NOT EXISTS idx_follow_ups_due ON follow_ups(due_date);
  CREATE INDEX IF NOT EXISTS idx_usage_timestamp ON usage_tracking(timestamp);
`);

export default db;

// Helper functions
export const getCustomers = () => {
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
  return db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
};

export const addCustomer = (data: {
  name: string;
  email?: string;
  phone?: string;
  vehicle_interest?: string;
  notes?: string;
}) => {
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

export const updateCustomer = (id: number, data: Partial<{
  name: string;
  email: string;
  phone: string;
  status: string;
  vehicle_interest: string;
  notes: string;
}>) => {
  const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
  const values = Object.values(data);
  const stmt = db.prepare(`UPDATE customers SET ${fields}, last_contact = strftime('%s', 'now') WHERE id = ?`);
  return stmt.run(...values, id);
};

export const getConversations = (customerId: number) => {
  return db.prepare(`
    SELECT * FROM conversations
    WHERE customer_id = ?
    ORDER BY timestamp ASC
  `).all(customerId);
};

export const addMessage = (customerId: number, message: string, sender: 'customer' | 'jeff' | 'sven') => {
  const stmt = db.prepare(`
    INSERT INTO conversations (customer_id, message, sender)
    VALUES (?, ?, ?)
  `);
  
  // Update last_contact timestamp
  db.prepare('UPDATE customers SET last_contact = strftime(\'%s\', \'now\') WHERE id = ?').run(customerId);
  
  return stmt.run(customerId, message, sender);
};

export const markAsRead = (customerId: number) => {
  return db.prepare(`
    UPDATE conversations
    SET read = 1
    WHERE customer_id = ? AND sender = 'customer'
  `).run(customerId);
};

export const getFollowUps = (customerId?: number) => {
  if (customerId) {
    return db.prepare(`
      SELECT f.*, c.name as customer_name
      FROM follow_ups f
      JOIN customers c ON f.customer_id = c.id
      WHERE f.customer_id = ? AND f.completed = 0
      ORDER BY f.due_date ASC
    `).all(customerId);
  }
  return db.prepare(`
    SELECT f.*, c.name as customer_name
    FROM follow_ups f
    JOIN customers c ON f.customer_id = c.id
    WHERE f.completed = 0
    ORDER BY f.due_date ASC
  `).all();
};

export const addFollowUp = (customerId: number, dueDate: number, notes: string, priority: string = 'medium') => {
  const stmt = db.prepare(`
    INSERT INTO follow_ups (customer_id, due_date, notes, priority)
    VALUES (?, ?, ?, ?)
  `);
  return stmt.run(customerId, dueDate, notes, priority);
};

export const completeFollowUp = (id: number) => {
  return db.prepare('UPDATE follow_ups SET completed = 1 WHERE id = ?').run(id);
};

// Model preference management
export const getModelPreferences = () => {
  return db.prepare('SELECT * FROM model_preferences ORDER BY task_type').all();
};

export const setModelPreference = (taskType: string, model: string, description?: string) => {
  const stmt = db.prepare(`
    INSERT INTO model_preferences (task_type, model, description)
    VALUES (?, ?, ?)
    ON CONFLICT(task_type) DO UPDATE SET model = ?, description = ?
  `);
  return stmt.run(taskType, model, description || null, model, description || null);
};

export const getModelPreference = (taskType: string) => {
  return db.prepare('SELECT * FROM model_preferences WHERE task_type = ?').get(taskType);
};

// Usage tracking
export const trackUsage = (sessionKey: string, model: string, tokensUsed: number, taskType?: string) => {
  // Simple cost estimation (approximate)
  const costPerMillion: { [key: string]: number } = {
    'anthropic/claude-haiku-4-5': 0.80,
    'anthropic/claude-sonnet-4-5': 3.00,
    'anthropic/claude-opus-4-6': 15.00,
  };
  
  const costEstimate = (tokensUsed / 1_000_000) * (costPerMillion[model] || 3.00);
  
  const stmt = db.prepare(`
    INSERT INTO usage_tracking (session_key, model, tokens_used, cost_estimate, task_type)
    VALUES (?, ?, ?, ?, ?)
  `);
  return stmt.run(sessionKey, model, tokensUsed, costEstimate, taskType || null);
};

export const getUsageStats = (days: number = 30) => {
  const since = Math.floor(Date.now() / 1000) - (days * 86400);
  return db.prepare(`
    SELECT 
      model,
      COUNT(*) as request_count,
      SUM(tokens_used) as total_tokens,
      SUM(cost_estimate) as total_cost
    FROM usage_tracking
    WHERE timestamp > ?
    GROUP BY model
    ORDER BY total_cost DESC
  `).all(since);
};

export const getUsageByTaskType = (days: number = 30) => {
  const since = Math.floor(Date.now() / 1000) - (days * 86400);
  return db.prepare(`
    SELECT 
      task_type,
      model,
      COUNT(*) as request_count,
      SUM(tokens_used) as total_tokens,
      SUM(cost_estimate) as total_cost
    FROM usage_tracking
    WHERE timestamp > ? AND task_type IS NOT NULL
    GROUP BY task_type, model
    ORDER BY task_type, total_cost DESC
  `).all(since);
};

// Initialize default model preferences
const initDefaults = () => {
  const defaults = [
    { task_type: 'quick_response', model: 'anthropic/claude-haiku-4-5', description: 'Simple acknowledgments and quick replies' },
    { task_type: 'follow_up', model: 'anthropic/claude-sonnet-4-5', description: 'Follow-up suggestions and drafting' },
    { task_type: 'complex_analysis', model: 'anthropic/claude-opus-4-6', description: 'Complex negotiations and strategy' },
    { task_type: 'customer_chat', model: 'anthropic/claude-sonnet-4-5', description: 'Default for customer conversations' },
  ];
  
  defaults.forEach(({ task_type, model, description }) => {
    const existing = db.prepare('SELECT * FROM model_preferences WHERE task_type = ?').get(task_type);
    if (!existing) {
      setModelPreference(task_type, model, description);
    }
  });
};

initDefaults();
