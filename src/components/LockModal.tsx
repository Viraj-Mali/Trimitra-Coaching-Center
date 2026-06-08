'use client';

import { useEffect } from 'react';
import { Lock, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LockModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function LockModal({
  isOpen,
  onClose,
  title = 'Premium Content',
  description = 'This content is available for enrolled students only. Please enroll at Trimitra Coaching Centre to access all premium study materials and mock tests.',
}: LockModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        className="relative glass-card border border-white/20 p-8 max-w-md w-full shadow-card-hover animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        >
          <X size={18} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-brand-amber/20 border border-brand-amber/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Lock size={28} className="text-brand-amber" />
          </div>

          <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{description}</p>

          <div className="space-y-3">
            <a
              href="tel:+919999000000"
              className="btn-primary w-full justify-center"
            >
              <ArrowRight size={16} />
              Contact to Enroll
            </a>
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
