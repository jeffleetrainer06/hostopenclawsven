const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'command-center.db');
console.log('📂 Database path:', dbPath);

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
  CREATE INDEX IF NOT EXISTS idx_usage_timestamp ON usage_tracking(timestamp);
`);

console.log('✅ Database schema created');

// Add default model preferences
const defaults = [
  { task_type: 'quick_response', model: 'anthropic/claude-haiku-4-5', description: 'Simple acknowledgments and quick replies' },
  { task_type: 'follow_up', model: 'anthropic/claude-sonnet-4-5', description: 'Follow-up suggestions and drafting' },
  { task_type: 'complex_analysis', model: 'anthropic/claude-opus-4-6', description: 'Complex negotiations and strategy' },
  { task_type: 'customer_chat', model: 'anthropic/claude-sonnet-4-5', description: 'Default for customer conversations' },
];

defaults.forEach(({ task_type, model, description }) => {
  const existing = db.prepare('SELECT * FROM model_preferences WHERE task_type = ?').get(task_type);
  if (!existing) {
    db.prepare(`
      INSERT INTO model_preferences (task_type, model, description)
      VALUES (?, ?, ?)
    `).run(task_type, model, description);
    console.log(`  ✓ Added model preference: ${task_type}`);
  }
});

// Add test customers
const customers = [
  {
    name: 'Thomas Lee',
    email: 'thomas@example.com',
    phone: '(555) 123-4567',
    vehicle_interest: '2026 RAV4 Hybrid XSE',
    status: 'configuring',
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 987-6543',
    vehicle_interest: '2026 Camry Hybrid',
    status: 'inquiry',
  },
  {
    name: 'Mike Davis',
    email: 'mike.davis@example.com',
    phone: '(555) 456-7890',
    vehicle_interest: '2026 Tacoma TRD Pro',
    status: 'test_drive',
  },
];

console.log('\n📝 Adding test customers...');

customers.forEach(customer => {
  const stmt = db.prepare(`
    INSERT INTO customers (name, email, phone, vehicle_interest, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(customer.name, customer.email, customer.phone, customer.vehicle_interest, customer.status);
  console.log(`  ✅ Added ${customer.name} (ID: ${result.lastInsertRowid})`);
  
  // Add sample conversations
  const now = Math.floor(Date.now() / 1000);
  const msgStmt = db.prepare(`
    INSERT INTO conversations (customer_id, message, sender, timestamp)
    VALUES (?, ?, ?, ?)
  `);
  
  // Customer message
  msgStmt.run(result.lastInsertRowid, `Hi Jeff! I'm interested in the ${customer.vehicle_interest}. Can we discuss options?`, 'customer', now - 7200);
  
  // Jeff's reply
  msgStmt.run(result.lastInsertRowid, `Hi ${customer.name.split(' ')[0]}! Absolutely, I'd be happy to help. The ${customer.vehicle_interest} is a great choice. When would be a good time for you to come in for a test drive?`, 'jeff', now - 3600);
  
  console.log(`    💬 Added conversation history`);
});

console.log('\n✨ Database initialized with test data!');
console.log('\n📊 Summary:');
console.log(`  - ${customers.length} test customers`);
console.log(`  - ${customers.length * 2} messages`);
console.log(`  - 4 model preferences configured`);

db.close();
