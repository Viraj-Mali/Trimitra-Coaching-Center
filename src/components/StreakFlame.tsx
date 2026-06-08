'use client';

import { cn } from '@/lib/utils';

interface StreakFlameProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeMap = {
  sm: { emoji: 'text-xl', count: 'text-lg', label: 'text-xs' },
  md: { emoji: 'text-3xl', count: 'text-2xl', label: 'text-sm' },
  lg: { emoji: 'text-5xl', count: 'text-4xl', label: 'text-base' },
};

export default function StreakFlame({ count, size = 'md', showLabel = true }: StreakFlameProps) {
  const s = sizeMap[size];
  const isActive = count > 0;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center">
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-brand-amber/20 animate-ping opacity-30" />
          </div>
        )}
        <span
          className={cn(
            s.emoji,
            'animate-flame',
            !isActive && 'grayscale opacity-30'
          )}
        >
          🔥
        </span>
      </div>
      <span
        className={cn(
          s.count,
          'font-black leading-none',
          isActive ? 'text-brand-amber' : 'text-slate-500'
        )}
      >
        {count}
      </span>
      {showLabel && (
        <span className={cn(s.label, 'text-slate-400 font-medium')}>
          day streak
        </span>
      )}
    </div>
  );
}
