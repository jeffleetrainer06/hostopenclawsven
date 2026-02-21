const Database = require('better-sqlite3');
const db = new Database('./data/command-center.db');

console.log('═══════════════════════════════════════════════════════');
console.log('        📊 JEFF\'S COMMAND CENTER - DASHBOARD');
console.log('═══════════════════════════════════════════════════════\n');

// Get customers
const customers = db.prepare(`
  SELECT 
    c.*,
    (SELECT COUNT(*) FROM conversations WHERE customer_id = c.id AND sender = 'customer' AND read = 0) as unread_count,
    (SELECT message FROM conversations WHERE customer_id = c.id ORDER BY timestamp DESC LIMIT 1) as last_message
  FROM customers c
  ORDER BY last_contact DESC
`).all();

console.log('📈 KEY METRICS\n');
const activeLeads = customers.filter(c => c.status !== 'closed').length;
console.log(`  Active Leads: ${activeLeads}`);
console.log(`  Test Drives Scheduled: 1 (Mike Davis)`);
console.log(`  Monthly Sales: 0 / Target: 20`);

console.log('\n\n💬 CLIENT HUB - ACTIVE CUSTOMERS\n');
console.log('┌─────────────────────┬──────────────────────┬─────────────┬──────────────────────┐');
console.log('│ Name                │ Vehicle Interest     │ Status      │ Last Message         │');
console.log('├─────────────────────┼──────────────────────┼─────────────┼──────────────────────┤');

customers.forEach(c => {
  const name = c.name.padEnd(19);
  const vehicle = (c.vehicle_interest || 'N/A').substring(0, 19).padEnd(19);
  const status = c.status.padEnd(11);
  const lastMsg = (c.last_message || '').substring(0, 18).padEnd(18);
  console.log(`│ ${name} │ ${vehicle} │ ${status} │ ${lastMsg}...│`);
});
console.log('└─────────────────────┴──────────────────────┴─────────────┴──────────────────────┘');

console.log('\n\n💭 RECENT CONVERSATIONS\n');
customers.forEach(c => {
  const messages = db.prepare(`
    SELECT * FROM conversations WHERE customer_id = ? ORDER BY timestamp ASC
  `).all(c.id);
  
  console.log(`\n📧 ${c.name} - ${c.vehicle_interest}`);
  console.log('─'.repeat(60));
  messages.forEach(m => {
    const sender = m.sender === 'customer' ? '👤 Customer' : m.sender === 'jeff' ? '👔 Jeff' : '🤖 Sven';
    const time = new Date(m.timestamp * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    console.log(`${sender} (${time}):`);
    console.log(`  ${m.message}\n`);
  });
});

console.log('\n\n🤖 AI MODEL CONFIGURATION\n');
const prefs = db.prepare('SELECT * FROM model_preferences ORDER BY task_type').all();
prefs.forEach(p => {
  console.log(`  ${p.task_type.padEnd(20)} → ${p.model.includes('haiku') ? '🏃 Haiku' : p.model.includes('sonnet') ? '⚖️  Sonnet' : '🧠 Opus'}`);
  console.log(`     ${p.description}`);
});

db.close();
