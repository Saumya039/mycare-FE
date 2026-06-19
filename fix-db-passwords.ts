import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("Fetching users to secure passwords...");
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    // Bcrypt hashes start with $2a$, $2b$, or $2y$. 
    // If it doesn't start with this, it's plaintext or a dummy value.
    if (!user.password.startsWith('$2')) {
      console.log(`Hashing password for ${user.email}...`);
      
      // If the password is "firebase-managed" or "supabase-managed", we will set it to "password123" by default
      // otherwise we hash whatever plaintext is there (e.g. "password123")
      let rawPassword = user.password;
      if (rawPassword === "firebase-managed" || rawPassword === "supabase-managed") {
         rawPassword = "password123";
      }
      
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
      console.log(`Successfully secured ${user.email}`);
    } else {
      console.log(`User ${user.email} already has a secure bcrypt hash.`);
    }
  }
  
  console.log("All database passwords have been secured.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
