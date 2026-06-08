import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XPBadgeProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

export default function XPBadge({ xp, size = 'md' }: XPBadgeProps) {
  const level = Math.floor(xp / 500) + 1;
  const levelLabel = level <= 3 ? 'Beginner' : level <= 6 ? 'Intermediate' : level <= 10 ? 'Advanced' : 'Expert';

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-bold',
          'bg-gradient-to-r from-brand-amber-dark to-brand-amber',
          'text-white shadow-amber',
          sizeMap[size]
        )}
      >
        <Star size={size === 'sm' ? 10 : size === 'md' ? 12 : 16} fill="currentColor" />
        <span>{xp.toLocaleString()} XP</span>
      </div>
      <span className="text-xs text-slate-400">Lv.{level} {levelLabel}</span>
    </div>
  );
}
