import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  
  for (const user of users) {
    if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
      // It's a plain text password, hash it!
      const hashedPassword = await bcrypt.hash(user.password, 10)
      
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      })
      console.log(`Fixed password for: ${user.email}`)
    }
  }

  console.log('All passwords hashed properly!')
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
