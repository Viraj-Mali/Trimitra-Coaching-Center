import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, mobile, password, confirmPassword, track, standard } = await request.json();

    if (!name || !mobile || !password || !track || !standard) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json({ error: 'Invalid mobile number.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }

    // Check duplicate
    const existing = await prisma.student.findUnique({ where: { mobile } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this mobile number already exists.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Generate roll number for free accounts
    const count = await prisma.student.count({ where: { track } });
    const year = new Date().getFullYear();
    const trackCode: Record<string, string> = {
      FOUNDATION_6_9: 'FND', BOARD_10: 'BRD', SCIENCE_11_12: 'SCI', COMPETITIVE: 'CMP',
    };
    const rollNumber = `${trackCode[track] || 'STD'}-${year}-${String(count + 1).padStart(3, '0')}`;

    const student = await prisma.student.create({
      data: { name, mobile, passwordHash, track, standard, rollNumber, role: 'FREE', lastActiveAt: new Date() },
    });

    const token = await signToken({
      id: student.id,
      name: student.name,
      mobile: student.mobile,
      role: 'FREE',
      track: student.track,
      rollNumber: student.rollNumber,
    });

    const response = NextResponse.json({ success: true, rollNumber: student.rollNumber }, { status: 201 });
    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    return response;
  } catch (error) {
    console.error('[REGISTER POST]', error);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
