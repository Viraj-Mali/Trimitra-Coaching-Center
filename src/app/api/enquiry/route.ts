import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentName, parentName, mobile, standard, track, notes, preferredTime } = body;

    if (!studentName || !parentName || !mobile || !standard || !track) {
      return NextResponse.json({ error: 'All required fields must be provided.' }, { status: 400 });
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json({ error: 'Invalid mobile number. Must be a valid 10-digit Indian number.' }, { status: 400 });
    }

    const validTracks = ['FOUNDATION_6_9', 'BOARD_10', 'SCIENCE_11_12', 'COMPETITIVE'];
    if (!validTracks.includes(track)) {
      return NextResponse.json({ error: 'Invalid course track.' }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        studentName: studentName.trim(),
        parentName: parentName.trim(),
        mobile: mobile.trim(),
        standard,
        track,
        notes: notes ? notes.trim() : null,
        preferredTime: preferredTime || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (error) {
    console.error('[ENQUIRY POST]', error);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
