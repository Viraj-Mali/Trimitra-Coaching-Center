import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export const TRACK_LABELS: Record<string, string> = {
  FOUNDATION_6_9: 'Foundation (Class 6th–8th)',
  BOARD_10: '9th-10th Board Mastery',
  SCIENCE_11_12: '11th–12th Science',
  COMPETITIVE: 'JEE & NEET',
  COMPETITIVE_MHTCET: 'MHT-CET (PCMB Group)',
  COMPETITIVE_NATA: 'NATA',
};

export const TRACK_COLORS: Record<string, string> = {
  FOUNDATION_6_9: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  BOARD_10: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  SCIENCE_11_12: 'bg-green-500/20 text-green-300 border-green-500/30',
  COMPETITIVE: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  COMPETITIVE_MHTCET: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  COMPETITIVE_NATA: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export const TRACK_BADGE_COLORS: Record<string, string> = {
  FOUNDATION_6_9: '#a855f7',
  BOARD_10: '#3b82f6',
  SCIENCE_11_12: '#10B981',
  COMPETITIVE: '#F59E0B',
  COMPETITIVE_MHTCET: '#14b8a6',
  COMPETITIVE_NATA: '#ef4444',
};

export const ROLE_LABELS: Record<string, string> = {
  FREE: 'Free Trial',
  ENROLLED: 'Enrolled Student',
  ADMIN: 'Administrator',
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CALLED: 'Called',
  DEMO_BOOKED: 'Demo Booked',
  JOINED: 'Joined',
  REJECTED: 'Rejected',
};

export const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  CALLED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  DEMO_BOOKED: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  JOINED: 'bg-green-500/20 text-green-300 border-green-500/30',
  REJECTED: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export function generateRollNumber(track: string, year: number, seq: number): string {
  const trackCode: Record<string, string> = {
    FOUNDATION_6_9: 'FND',
    BOARD_10: 'BRD',
    SCIENCE_11_12: 'SCI',
    COMPETITIVE: 'CMP',
    COMPETITIVE_MHTCET: 'CET',
    COMPETITIVE_NATA: 'NAT',
  };
  const code = trackCode[track] || 'STD';
  return `${code}-${year}-${String(seq).padStart(3, '0')}`;
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export const XP_PER_CORRECT = 10;
export const XP_PER_QUIZ_COMPLETE = 50;
export const STREAK_BONUS_XP = 25;
