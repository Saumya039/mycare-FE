import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const roles = [
    { email: 'superadmin@sevraai.com', role: 'SUPER_ADMIN', name: 'Super Admin' },
    { email: 'admin@sevraai.com', role: 'ADMIN', name: 'Admin User' },
    { email: 'doctor@sevraai.com', role: 'DOCTOR', name: 'Dr. Sevra' },
    { email: 'accountant@sevraai.com', role: 'ACCOUNTANT', name: 'Accountant' },
    { email: 'receptionist@sevraai.com', role: 'RECEPTIONIST', name: 'Front Desk' },
    { email: 'pharmacist@sevraai.com', role: 'PHARMACIST', name: 'Pharmacy Manager' },
    { email: 'pathologist@sevraai.com', role: 'PATHOLOGIST', name: 'Pathologist' },
    { email: 'radiologist@sevraai.com', role: 'RADIOLOGIST', name: 'Radiologist' },
  ]

  console.log('Seeding portal users...')

  for (const r of roles) {
    const existingUser = await prisma.user.findUnique({
      where: { email: r.email }
    })
    
    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: r.email,
          password: 'password123', // In a real app this should be hashed, but our mock auth accepts plain for dev
          name: r.name,
          role: r.role,
        }
      })
      console.log(`Created: ${r.email}`)
    } else {
      console.log(`Skipped existing: ${r.email}`)
    }
  }

  // Also create a patient for the patient portal
  const existingPatient = await prisma.patient.findUnique({
    where: { id: 'P-1005' }
  })
  
  if (!existingPatient) {
    await prisma.patient.create({
      data: {
        id: 'P-1005',
        name: 'Patient User',
        age: 30,
        gender: "Male",
        patientId: "PAT-1005",
        diagnosis: "Viral Fever"
      }
    })
    console.log(`Created Patient: P-1005`)
  }

  console.log('Done.')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
