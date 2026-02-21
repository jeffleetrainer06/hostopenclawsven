const Database = require('better-sqlite3');
const db = new Database('./data/command-center.db');

console.log('\n🤖 AI FOLLOW-UP SUGGESTION DEMO\n');
console.log('═══════════════════════════════════════════════════════\n');

// Get Thomas Lee's conversation
const customer = db.prepare('SELECT * FROM customers WHERE name = ?').get('Thomas Lee');
const messages = db.prepare('SELECT * FROM conversations WHERE customer_id = ? ORDER BY timestamp ASC').all(customer.id);

console.log(`Customer: ${customer.name}`);
console.log(`Vehicle Interest: ${customer.vehicle_interest}`);
console.log(`Status: ${customer.status}`);
console.log(`Days Since Last Contact: ${Math.floor((Date.now() / 1000 - customer.last_contact) / 86400)}`);
console.log(`\nConversation History:`);
messages.forEach(m => {
  console.log(`  ${m.sender}: "${m.message}"`);
});

console.log('\n\n💡 SVEN\'S AI-POWERED SUGGESTION:\n');
console.log('─────────────────────────────────────────────────────');
console.log('Model: Sonnet (balanced for follow-ups)');
console.log('Tone: Professional & Friendly');
console.log('Urgency: Medium\n');

// Simulated AI suggestion (would call OpenClaw in real app)
const suggestion = `Hi Thomas! Hope you're doing well. I wanted to follow up on your interest in the 2026 RAV4 Hybrid XSE. We just got a beautiful Lunar Rock color in stock with all the features you mentioned. 

Would you be available this weekend for a test drive? I can also walk you through the hybrid system and show you the fuel economy benefits. Plus, we're running a special financing promotion this month that could save you some money.

Let me know what works best for your schedule!`;

console.log(suggestion);
console.log('\n─────────────────────────────────────────────────────');
console.log('💰 Estimated cost: ~$0.002 (using Sonnet)');
console.log('⚡ Response time: ~2 seconds');
console.log('\n✅ Jeff can use this message directly, edit it, or request a new one with a different model/tone');

db.close();
