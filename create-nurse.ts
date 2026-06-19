import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // check if exists first
  let nurse = await prisma.user.findUnique({ where: { email: 'nurse@sevraai.com' }});
  
  if (!nurse) {
    await prisma.user.create({
      data: {
        email: 'nurse@sevraai.com',
        name: 'Nurse',
        password: hashedPassword,
        role: 'NURSE'
      }
    });
    console.log('Nurse created successfully.');
  } else {
    console.log('Nurse already exists.');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
