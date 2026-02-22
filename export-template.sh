#!/bin/bash

# Export Command Center Template
# Creates a portable package for reuse

TEMPLATE_NAME="command-center-template-$(date +%Y%m%d)"
EXPORT_DIR="/tmp/${TEMPLATE_NAME}"

echo "🔨 Creating Command Center Template..."

# Create export directory
mkdir -p "${EXPORT_DIR}"

# Copy core files (excluding personal data)
echo "📦 Copying core files..."
cp -r app components lib public "${EXPORT_DIR}/"
cp package.json package-lock.json next.config.js tsconfig.json "${EXPORT_DIR}/"
cp tailwind.config.ts postcss.config.js "${EXPORT_DIR}/"

# Copy documentation
echo "📚 Copying documentation..."
cp *.md "${EXPORT_DIR}/"

# Copy agent configurations (remove personal memories)
echo "🤖 Copying agent configurations..."
mkdir -p "${EXPORT_DIR}/agents"
cp agents/*/SOUL.md "${EXPORT_DIR}/agents/" 2>/dev/null || true

# Create template README
cat > "${EXPORT_DIR}/README-TEMPLATE.md" << 'EOF'
# Command Center Template

This is a pre-configured Command Center with:
- ✅ 6-Agent team (Sven, Scout, Buzz, Echo, Atlas, Forge)
- ✅ Customer Hub with portal invites
- ✅ Tools sidebar for customer resources
- ✅ Multi-agent collaboration system
- ✅ Analytics dashboard

## Quick Setup

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Configure environment:
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your settings
   \`\`\`

3. Customize for your use:
   - Update \`lib/customer-tools.ts\` with your links
   - Edit dealer name in components
   - Configure OpenClaw gateway URL

4. Run locally:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Deploy to Vercel:
   - Connect GitHub repo
   - Add environment variables
   - Deploy!

## Customization Guide

See \`CUSTOMIZATION-GUIDE.md\` for detailed instructions.
EOF

# Create customization guide
cat > "${EXPORT_DIR}/CUSTOMIZATION-GUIDE.md" << 'EOF'
# Customization Guide

## Quick Rebrand Checklist

### 1. Dealer/Company Info
- [ ] Update dealer name in \`app/page.tsx\`
- [ ] Change branding colors in \`tailwind.config.ts\`
- [ ] Update USER.md with salesperson info
- [ ] Modify SOUL.md for personality

### 2. Tools & Links
- [ ] Edit \`lib/customer-tools.ts\` with your URLs
- [ ] Update SmartPath link
- [ ] Configure payment calculator
- [ ] Set trade-in appraisal tool

### 3. Agent Personalities
- [ ] Review \`agents/*/SOUL.md\` files
- [ ] Adjust for your brand voice
- [ ] Update industry-specific knowledge

### 4. Database
- [ ] Set up Vercel Postgres or Supabase
- [ ] Update \`lib/database-optional.ts\` connection
- [ ] Run initial migrations

### 5. OpenClaw Connection
- [ ] Configure gateway URL
- [ ] Set environment variables
- [ ] Test agent responses

## Brand Adaptation Examples

### For Ford Dealership
\`\`\`bash
# Change colors
sed -i 's/red-500/blue-600/g' tailwind.config.ts
sed -i 's/Toyota/Ford/g' app/**/*.tsx

# Update vehicle lineup
# Edit lib/customer-tools.ts
# Edit agents/scout/SOUL.md
\`\`\`

### For Real Estate
\`\`\`bash
# Rename entities
sed -i 's/Customer/Client/g' **/*.tsx
sed -i 's/Vehicle/Property/g' **/*.tsx
sed -i 's/Test Drive/Showing/g' **/*.tsx
\`\`\`
EOF

# Remove sensitive data
echo "🔒 Removing sensitive data..."
find "${EXPORT_DIR}" -name "*.db" -delete
find "${EXPORT_DIR}" -name ".env.local" -delete
find "${EXPORT_DIR}" -name "MEMORY.md" -delete
rm -rf "${EXPORT_DIR}/.git" 2>/dev/null || true

# Create archive
echo "📦 Creating archive..."
cd /tmp
tar -czf "${TEMPLATE_NAME}.tar.gz" "${TEMPLATE_NAME}"

echo "✅ Template created: /tmp/${TEMPLATE_NAME}.tar.gz"
echo ""
echo "📤 To share:"
echo "   1. Copy file to safe location"
echo "   2. Upload to GitHub as release"
echo "   3. Or share directly with other users"
echo ""
echo "📥 To use:"
echo "   tar -xzf ${TEMPLATE_NAME}.tar.gz"
echo "   cd ${TEMPLATE_NAME}"
echo "   npm install"
echo "   # Follow README-TEMPLATE.md"

# Cleanup
rm -rf "${EXPORT_DIR}"
