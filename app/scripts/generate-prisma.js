const { exec } = require('child_process');
const path = require('path');

console.log('🔄 Generating Prisma Client...');
console.log('Current directory:', process.cwd());
console.log('Prisma schema path:', path.join(process.cwd(), 'prisma/schema.prisma'));

exec('npx prisma generate --schema=./prisma/schema.prisma', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error generating Prisma Client:', error);
    process.exit(1);
  }
  if (stderr) {
    console.warn('⚠️ Prisma warnings:', stderr);
  }
  console.log('✅ Prisma Client generated successfully');
  console.log(stdout);
});