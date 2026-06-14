const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const patientId = 'P-1001';

  let patient = await prisma.patient.findUnique({
    where: { patientId }
  });

  if (!patient) {
    patient = await prisma.patient.create({
      data: {
        patientId,
        name: 'Sarah Connor',
        age: 35,
        gender: 'Female',
        guardianRelation: 'Father',
        guardianPhone: '555-0987',
        guardianEmail: 'robert.smith@email.com',
        portalPin: '1234',
        diagnosis: 'Acute Bronchitis',
        status: 'stable',
        departmentName: 'Pulmonology',
        doctorName: 'Dr. Sevra',
        allergies: 'Penicillin',
        dischargeEta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        appointments: {
          create: [
            {
              doctorId: (await prisma.user.findFirst({ where: { role: 'DOCTOR' } }))?.id || '',
              date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
              reason: 'Follow-up Checkup',
              status: 'scheduled'
            }
          ]
        },
        prescriptions: {
          create: [
            {
              doctorId: (await prisma.user.findFirst({ where: { role: 'DOCTOR' } }))?.id || '',
              medicationName: 'Amoxicillin',
              dosage: '500mg',
              frequency: 'Twice daily',
              duration: '7 Days',
              status: 'active'
            },
            {
              doctorId: (await prisma.user.findFirst({ where: { role: 'DOCTOR' } }))?.id || '',
              medicationName: 'Ibuprofen',
              dosage: '400mg',
              frequency: 'As needed for pain',
              duration: '5 Days',
              status: 'active'
            }
          ]
        },
        labTests: {
          create: [
            {
              testName: 'Complete Blood Count (CBC)',
              status: 'completed',
              resultText: 'All counts within normal range. WBC slightly elevated.'
            },
            {
              testName: 'Chest X-Ray',
              status: 'pending'
            }
          ]
        }
      }
    });
    console.log(`Successfully created test patient: ${patientId}`);
  } else {
    console.log(`Test patient ${patientId} already exists!`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
