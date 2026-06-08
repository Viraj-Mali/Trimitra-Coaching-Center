import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { mobile, password } = await request.json();

    if (!mobile || !password) {
      return NextResponse.json({ error: 'Mobile and password are required.' }, { status: 400 });
    }

    const student = await prisma.student.findUnique({ where: { mobile } });
    if (!student) {
      return NextResponse.json({ error: 'No account found with this mobile number.' }, { status: 401 });
    }

    if (!student.isActive) {
      return NextResponse.json({ error: 'Your account has been deactivated. Please contact admin.' }, { status: 403 });
    }

    const isValid = await bcrypt.compare(password, student.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }

    // Update last active
    await prisma.student.update({
      where: { id: student.id },
      data: { lastActiveAt: new Date() },
    });

    const token = await signToken({
      id: student.id,
      name: student.name,
      mobile: student.mobile,
      role: student.role as 'FREE' | 'ENROLLED' | 'ADMIN',
      track: student.track,
      rollNumber: student.rollNumber,
    });

    const response = NextResponse.json({
      success: true,
      role: student.role,
      name: student.name,
    });
    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    return response;
  } catch (error) {
    console.error('[LOGIN POST]', error);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
