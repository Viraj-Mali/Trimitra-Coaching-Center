'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0–100
  label?: string;
  subject?: string;
  color?: 'green' | 'amber' | 'blue' | 'purple';
  showPercentage?: boolean;
  animate?: boolean;
}

const colorMap = {
  green: 'bg-gradient-to-r from-brand-green-dark to-brand-green',
  amber: 'bg-gradient-to-r from-brand-amber-dark to-brand-amber',
  blue: 'bg-gradient-to-r from-blue-700 to-blue-400',
  purple: 'bg-gradient-to-r from-purple-700 to-purple-400',
};

const textColorMap = {
  green: 'text-brand-green',
  amber: 'text-brand-amber',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
};

export default function ProgressBar({
  value,
  label,
  subject,
  color = 'green',
  showPercentage = true,
  animate = true,
}: ProgressBarProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const clamped = Math.min(100, Math.max(0, value));

  useEffect(() => {
    if (fillRef.current && animate) {
      fillRef.current.style.width = '0%';
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (fillRef.current) {
            fillRef.current.style.transition = 'width 1s ease-out';
            fillRef.current.style.width = `${clamped}%`;
          }
        }, 100);
      });
    }
  }, [clamped, animate]);

  return (
    <div className="space-y-1.5">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          <div>
            {label && <span className="text-sm font-medium text-white">{label}</span>}
            {subject && <span className="text-xs text-slate-400 ml-2">({subject})</span>}
          </div>
          {showPercentage && (
            <span className={cn('text-sm font-bold', textColorMap[color])}>
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div className="progress-bar">
        <div
          ref={fillRef}
          className={cn('progress-bar-fill', colorMap[color])}
          style={animate ? { width: '0%' } : { width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
