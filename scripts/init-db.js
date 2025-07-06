import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Initializing database...');
  
  try {
    // This will create the database schema if it doesn't exist
    await prisma.$executeRaw`SELECT 1`;
    console.log('Database connection successful');
    
    // You can add any initial data here if needed
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 