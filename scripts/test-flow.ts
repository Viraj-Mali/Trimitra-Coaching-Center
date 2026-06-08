import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function runTests() {
  console.log('--- STARTING E2E FLOW TEST ---');
  try {
    // 1. Verify Admin User
    const admin = await prisma.student.findUnique({ where: { mobile: '9999000000' } });
    if (!admin) throw new Error('Admin not found!');
    console.log('✅ Admin user exists:', admin.name);

    // 2. Add a Course
    const course = await prisma.course.create({
      data: {
        title: 'Test Dynamic Course',
        subtitle: 'For E2E Testing',
        description: 'This is a test course created via script.',
        subjects: 'Math, Physics',
        targetTrack: 'COMPETITIVE',
        targetClass: '12th',
        duration: '1 Year',
        isActive: true,
        sortOrder: 1,
      }
    });
    console.log('✅ Course created:', course.title);

    // 3. Confirm Course is active (Landing page fetches active courses)
    const activeCourses = await prisma.course.findMany({ where: { isActive: true } });
    const found = activeCourses.find(c => c.id === course.id);
    if (!found) throw new Error('Course not found in active list!');
    console.log('✅ Course is fetched correctly for landing page!');

    // 4. Submit Demo Form (Enquiry)
    const lead = await prisma.lead.create({
      data: {
        parentName: 'Test Parent',
        studentName: 'Test Student',
        mobile: '8888000000',
        standard: '11th',
        track: 'SCIENCE_11_12',
        notes: 'This is a test enquiry',
      }
    });
    console.log('✅ Enquiry submitted:', lead.studentName);

    // 5. Verify Enquiry in Admin Dashboard
    const adminLeads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
    const foundLead = adminLeads.find(l => l.id === lead.id);
    if (!foundLead) throw new Error('Lead not found for admin!');
    console.log('✅ Enquiry appears in Admin Dashboard!');

    // Cleanup test data
    await prisma.course.delete({ where: { id: course.id } });
    await prisma.lead.delete({ where: { id: lead.id } });
    console.log('✅ Cleaned up test data.');
    console.log('--- ALL TESTS PASSED ---');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
