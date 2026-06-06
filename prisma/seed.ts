import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding Phase 2 Database...")

  const hash = await bcrypt.hash("password123", 10)

  // 1. Seed Users (Staff)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mycare.com' },
    update: {},
    create: { email: 'admin@mycare.com', password: hash, name: 'System Admin', role: 'ADMIN', department: 'Administration' },
  })
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@mycare.com' },
    update: {},
    create: { email: 'doctor@mycare.com', password: hash, name: 'Dr. Sarah Jenkins', role: 'DOCTOR', department: 'Emergency', shiftStart: '08:00', shiftEnd: '20:00' },
  })
  const nurse = await prisma.user.upsert({
    where: { email: 'nurse@mycare.com' },
    update: {},
    create: { email: 'nurse@mycare.com', password: hash, name: 'Nurse John Smith', role: 'NURSE', department: 'ICU', shiftStart: '20:00', shiftEnd: '08:00' },
  })

  // 2. Seed Beds
  const depts = ["Emergency", "ICU", "Cardiology", "Neurology", "Pediatrics"]
  for (let i = 1; i <= 20; i++) {
    await prisma.bed.upsert({
      where: { label: `BED-${String(i).padStart(2, '0')}` },
      update: {},
      create: {
        label: `BED-${String(i).padStart(2, '0')}`,
        departmentName: depts[i % depts.length],
        floor: (i % 3) + 1,
        wing: ["North", "South", "East"][i % 3],
      }
    })
  }

  // 3. Seed Patients
  const patient1 = await prisma.patient.upsert({
    where: { patientId: 'P-1001' },
    update: {},
    create: { patientId: 'P-1001', name: 'Robert Paulson', age: 45, gender: 'Male', diagnosis: 'Pneumonia', status: 'stable', departmentName: 'Emergency', doctorName: doctor.name }
  })

  // 4. Seed Inventory
  await prisma.inventoryItem.upsert({
    where: { itemName: 'Paracetamol 500mg' },
    update: {},
    create: { itemName: 'Paracetamol 500mg', category: 'Medicine', quantity: 5000, minimumThreshold: 1000 }
  })
  await prisma.inventoryItem.upsert({
    where: { itemName: 'Oxygen Cylinders (Large)' },
    update: {},
    create: { itemName: 'Oxygen Cylinders (Large)', category: 'Equipment', quantity: 5, minimumThreshold: 20 }
  })

  // 5. Seed Appointment
  await prisma.appointment.create({
    data: { patientId: patient1.id, doctorId: doctor.id, date: new Date(Date.now() + 86400000), reason: 'Follow-up' }
  })

  console.log("Phase 2 Seeding Complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
