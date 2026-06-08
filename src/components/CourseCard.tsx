import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';
import { cn, TRACK_LABELS } from '@/lib/utils';

interface CourseCardProps {
  track: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  borderColor: string;
  glowColor: string;
  isLocked?: boolean;
  lang: string;
  ctaLabel: string;
  lockedLabel: string;
}

export default function CourseCard({
  track,
  title,
  subtitle,
  description,
  icon,
  color,
  borderColor,
  glowColor,
  isLocked = false,
  lang,
  ctaLabel,
  lockedLabel,
}: CourseCardProps) {
  return (
    <div
      className={cn(
        'glass-card-hover p-6 relative overflow-hidden group',
        `border ${borderColor}`
      )}
    >
      {/* Background glow */}
      <div
        className={cn(
          'absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20',
          glowColor
        )}
      />

      {/* Icon */}
      <div
        className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 border',
          color,
          borderColor
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{subtitle}</p>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>

      {/* CTA */}
      {isLocked ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
          <Lock size={14} />
          {lockedLabel}
        </div>
      ) : (
        <Link
          href={`/${lang}/courses/${track.toLowerCase()}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:gap-3 transition-all duration-200"
        >
          {ctaLabel}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
