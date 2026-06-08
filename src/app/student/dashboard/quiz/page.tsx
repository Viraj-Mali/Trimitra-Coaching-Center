import { getCurrentStudent } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getTodayDateString } from '@/lib/utils';
import QuizClient from './QuizClient';

// API route for fetching quiz questions
export default async function QuizPage() {
  const session = await getCurrentStudent();
  if (!session) redirect('/student/login');

  const student = await prisma.student.findUnique({ where: { id: session.id } });
  if (!student) redirect('/student/login');

  const alreadyDone = student.lastQuizDate === getTodayDateString();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Daily Quiz</h1>
        <p className="text-slate-400">Complete today&apos;s quiz to maintain your streak and earn XP.</p>
      </div>
      <QuizClient alreadyDone={alreadyDone} track={student.track} />
    </div>
  );
}
