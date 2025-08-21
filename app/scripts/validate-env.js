
/**
 * Script para validar que todas las variables de entorno requeridas estén configuradas
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'POSTGRES_PRISMA_URL',
  'NEXT_PUBLIC_STACK_PROJECT_ID',
  'NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY',
  'STACK_SECRET_SERVER_KEY',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET'
];

const missingVars = [];

console.log('🔍 Validando variables de entorno...\n');

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.includes('your_') || value.includes('_here')) {
    missingVars.push(varName);
    console.log(`❌ ${varName}: No configurada o contiene valor de ejemplo`);
  } else {
    console.log(`✅ ${varName}: Configurada`);
  }
});

if (missingVars.length > 0) {
  console.log('\n🚨 Variables de entorno faltantes o con valores de ejemplo:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n📝 Por favor, actualiza el archivo .env con los valores reales.');
  process.exit(1);
} else {
  console.log('\n✅ Todas las variables de entorno están configuradas correctamente!');
}
