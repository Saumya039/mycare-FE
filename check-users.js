const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  for (const u of users) {
    console.log(`User: ${u.email}, Hash: ${u.password}`);
    // Check if password123 matches the hash
    if (u.password) {
      const match = await bcrypt.compare('password123', u.password);
      console.log(`Matches 'password123': ${match}`);
    } else {
      console.log('No password stored');
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
