import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentStudent } from '@/lib/auth';
import bcrypt from 'bcryptjs';

async function requireAdmin() {
  const session = await getCurrentStudent();
  if (!session || session.role !== 'ADMIN') return null;
  return session;
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { leadId } = await request.json();
    if (!leadId) return NextResponse.json({ error: 'Lead ID required.' }, { status: 400 });

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });

    // Check if already a student
    const existing = await prisma.student.findUnique({ where: { mobile: lead.mobile } });
    if (existing) {
      // Just upgrade role if already registered
      await prisma.student.update({ where: { id: existing.id }, data: { role: 'ENROLLED' } });
      await prisma.lead.update({ where: { id: leadId }, data: { status: 'JOINED' } });
      return NextResponse.json({ success: true, rollNumber: existing.rollNumber, upgraded: true });
    }

    // Generate roll number
    const year = new Date().getFullYear();
    const count = await prisma.student.count({ where: { track: lead.track } });
    const trackCode: Record<string, string> = {
      FOUNDATION_6_9: 'FND', BOARD_10: 'BRD', SCIENCE_11_12: 'SCI', COMPETITIVE: 'CMP',
    };
    const rollNumber = `${trackCode[lead.track] || 'STD'}-${year}-${String(count + 1).padStart(3, '0')}`;

    // Temp password = mobile last 4 digits + @trimitra
    const tempPassword = `${lead.mobile.slice(-4)}@trimitra`;
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const student = await prisma.student.create({
      data: {
        name: lead.studentName,
        mobile: lead.mobile,
        passwordHash,
        track: lead.track,
        standard: lead.standard,
        rollNumber,
        role: 'ENROLLED',
        lastActiveAt: new Date(),
      },
    });

    // Update lead status
    await prisma.lead.update({ where: { id: leadId }, data: { status: 'JOINED' } });

    return NextResponse.json({
      success: true,
      rollNumber: student.rollNumber,
      tempPassword,
      name: student.name,
    }, { status: 201 });
  } catch (error) {
    console.error('[PROMOTE POST]', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
