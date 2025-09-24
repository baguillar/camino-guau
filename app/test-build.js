#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Testing Prisma client generation and TypeScript compilation...');

try {
  // Check if node_modules exists
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    execSync('npm ci', { stdio: 'inherit' });
  }

  // Generate Prisma client
  console.log('🔄 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Check if Prisma client was generated
  const prismaClientPath = path.join('node_modules', '.prisma', 'client');
  if (fs.existsSync(prismaClientPath)) {
    console.log('✅ Prisma client generated successfully');
    
    // Check if AchievementType is exported
    const indexPath = path.join(prismaClientPath, 'index.d.ts');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      if (content.includes('AchievementType')) {
        console.log('✅ AchievementType enum found in generated client');
      } else {
        console.log('⚠️  AchievementType enum not found in generated client');
      }
    }
  } else {
    console.log('❌ Prisma client not generated');
  }

  // Test TypeScript compilation
  console.log('🔍 Testing TypeScript compilation...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful');

  console.log('🎉 All tests passed!');
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
