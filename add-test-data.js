const Database = require('better-sqlite3');
const db = new Database('./data/command-center.db');

// Add test customers
const customers = [
  {
    name: 'Thomas Lee',
    email: 'thomas@example.com',
    phone: '(555) 123-4567',
    vehicle_interest: '2026 RAV4 Hybrid',
    status: 'configuring',
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 987-6543',
    vehicle_interest: '2026 Camry',
    status: 'inquiry',
  },
  {
    name: 'Mike Davis',
    email: 'mike.davis@example.com',
    phone: '(555) 456-7890',
    vehicle_interest: '2026 Tacoma',
    status: 'test_drive',
  },
];

customers.forEach(customer => {
  const stmt = db.prepare(`
    INSERT INTO customers (name, email, phone, vehicle_interest, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(customer.name, customer.email, customer.phone, customer.vehicle_interest, customer.status);
  console.log(`✅ Added ${customer.name} (ID: ${result.lastInsertRowid})`);
  
  // Add a sample message
  const msgStmt = db.prepare(`
    INSERT INTO conversations (customer_id, message, sender, timestamp)
    VALUES (?, ?, ?, ?)
  `);
  msgStmt.run(result.lastInsertRowid, `Hi Jeff, I'm interested in the ${customer.vehicle_interest}. Can we schedule a test drive?`, 'customer', Math.floor(Date.now() / 1000) - 3600);
});

console.log('\n✨ Test data added successfully!');
db.close();
