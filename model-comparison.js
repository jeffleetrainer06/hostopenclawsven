console.log('\n💰 MODEL COST COMPARISON\n');
console.log('═══════════════════════════════════════════════════════\n');

const scenarios = [
  { task: 'Quick acknowledgment ("Thanks, I\'ll check!")', tokens: 150, best: 'Haiku' },
  { task: 'Follow-up suggestion (like above)', tokens: 800, best: 'Sonnet' },
  { task: 'Complex objection handling', tokens: 1500, best: 'Opus' },
  { task: 'Customer conversation (standard)', tokens: 600, best: 'Sonnet' },
];

const costs = {
  'Haiku': 0.80 / 1000000,
  'Sonnet': 3.00 / 1000000,
  'Opus': 15.00 / 1000000,
};

console.log('Task                                Tokens   Haiku    Sonnet   Opus     Recommended');
console.log('─'.repeat(85));

scenarios.forEach(s => {
  const taskName = s.task.substring(0, 35).padEnd(35);
  const tokensStr = s.tokens.toString().padEnd(8);
  const haikuCost = (s.tokens * costs.Haiku).toFixed(4).padStart(8);
  const sonnetCost = (s.tokens * costs.Sonnet).toFixed(4).padStart(8);
  const opusCost = (s.tokens * costs.Opus).toFixed(4).padStart(8);
  
  console.log(`${taskName} ${tokensStr} $${haikuCost} $${sonnetCost} $${opusCost}  → ${s.best}`);
});

console.log('\n\n📊 MONTHLY USAGE PROJECTION\n');
console.log('Scenario: 50 customers, ~200 AI interactions/month\n');

const monthly = {
  quick: { count: 60, tokens: 150 },
  followUp: { count: 80, tokens: 800 },
  complex: { count: 20, tokens: 1500 },
  chat: { count: 40, tokens: 600 },
};

const calculateCost = (interactions, model) => {
  let total = 0;
  Object.values(interactions).forEach(({ count, tokens }) => {
    total += count * tokens * costs[model];
  });
  return total;
};

const allOpus = calculateCost(monthly, 'Opus');
const allSonnet = calculateCost(monthly, 'Sonnet');
const optimized = 
  monthly.quick.count * monthly.quick.tokens * costs['Haiku'] +
  monthly.followUp.count * monthly.followUp.tokens * costs['Sonnet'] +
  monthly.complex.count * monthly.complex.tokens * costs['Opus'] +
  monthly.chat.count * monthly.chat.tokens * costs['Sonnet'];

console.log('Strategy                      Monthly Cost   vs All-Opus');
console.log('─'.repeat(55));
console.log(`All Opus (most powerful)      $${allOpus.toFixed(2).padStart(10)}   baseline`);
console.log(`All Sonnet (balanced)         $${allSonnet.toFixed(2).padStart(10)}   -${((1 - allSonnet/allOpus) * 100).toFixed(0)}%`);
console.log(`Smart Mix (recommended)       $${optimized.toFixed(2).padStart(10)}   -${((1 - optimized/allOpus) * 100).toFixed(0)}%`);

console.log('\n\n💡 OPTIMIZATION TIPS\n');
console.log('  ✓ Use Haiku for quick "thanks" and acknowledgments');
console.log('  ✓ Use Sonnet for most customer conversations');
console.log('  ✓ Reserve Opus for high-stakes negotiations and complex analysis');
console.log(`  ✓ Potential monthly savings: $${(allOpus - optimized).toFixed(2)} (${((1 - optimized/allOpus) * 100).toFixed(0)}% reduction)`);
