import { NextResponse } from 'next/server';
import { getCurrentStudent } from '@/lib/auth';

export async function GET() {
  try {
    const student = await getCurrentStudent();
    if (student) {
      return NextResponse.json({
        user: {
          name: student.name,
          role: student.role,
        }
      });
    }
    return NextResponse.json({ user: null });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
