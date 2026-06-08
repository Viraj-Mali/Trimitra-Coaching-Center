'use client';

import { useState, useEffect } from 'react';
import { Download, Lock, FileText, Video, Link as LinkIcon, Search, Filter } from 'lucide-react';
import LockModal from '@/components/LockModal';
import { TRACK_LABELS } from '@/lib/utils';

interface Material {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  targetTrack: string;
  isPremium: boolean;
  fileType: string;
  isAccessible: boolean;
}

interface MaterialsClientProps {
  role: string;
  track: string;
  phone: string;
}

const fileIcons: Record<string, typeof FileText> = {
  PDF: FileText, VIDEO: Video, LINK: LinkIcon,
};

export default function MaterialsClient({ role, track, phone }: MaterialsClientProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [lockModal, setLockModal] = useState<{ open: boolean; title: string }>({ open: false, title: '' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');

  useEffect(() => {
    fetch('/api/student/materials')
      .then(r => r.json())
      .then(setMaterials)
      .finally(() => setLoading(false));
  }, []);

  const filtered = materials.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'premium' ? m.isPremium : !m.isPremium);
    return matchSearch && matchFilter;
  });

  const isEnrolled = role === 'ENROLLED' || role === 'ADMIN';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Study Materials</h1>
        <p className="text-slate-400">Access notes, formula sheets, and resources for {TRACK_LABELS[track]}.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'free', 'premium'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-brand-green text-white'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Premium banner for free users */}
      {!isEnrolled && (
        <div className="glass-card border border-brand-amber/30 bg-brand-amber/5 p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-brand-amber font-semibold text-sm">🔒 Some materials require Premium Enrollment</p>
            <p className="text-slate-400 text-xs mt-0.5">Enroll at Trimitra to unlock all premium notes and formula sheets.</p>
          </div>
          <a href={`tel:+91${phone}`} className="btn-primary text-xs py-2">Contact to Enroll</a>
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-5 shimmer-bg h-32 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <FileText size={40} className="mx-auto mb-3 opacity-30" />
          <p>No materials found{search ? ` for "${search}"` : ''}.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(material => {
            const Icon = fileIcons[material.fileType] || FileText;
            const accessible = material.isAccessible;

            return (
              <div
                key={material.id}
                className={`glass-card-hover p-5 relative ${!accessible ? 'opacity-80' : ''}`}
              >
                {/* Premium badge */}
                {material.isPremium && (
                  <div className="absolute top-3 right-3">
                    <span className="badge bg-brand-amber/20 text-brand-amber border-brand-amber/30 text-xs">
                      ⭐ Premium
                    </span>
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  material.isPremium ? 'bg-brand-amber/20 border border-brand-amber/30' : 'bg-brand-green/20 border border-brand-green/30'
                }`}>
                  <Icon size={22} className={material.isPremium ? 'text-brand-amber' : 'text-brand-green'} />
                </div>

                <h3 className="text-white font-semibold text-sm mb-1 pr-16">{material.title}</h3>
                {material.description && (
                  <p className="text-slate-400 text-xs mb-3 line-clamp-2">{material.description}</p>
                )}
                <p className="text-slate-500 text-xs mb-4">{TRACK_LABELS[material.targetTrack] || material.targetTrack}</p>

                {accessible ? (
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-xs py-2 w-full justify-center"
                  >
                    <Download size={14} /> Access Material
                  </a>
                ) : (
                  <button
                    onClick={() => setLockModal({ open: true, title: material.title })}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-slate-400 rounded-xl text-xs hover:bg-white/10 transition-all"
                  >
                    <Lock size={14} /> Unlock — Enroll
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <LockModal
        isOpen={lockModal.open}
        onClose={() => setLockModal({ open: false, title: '' })}
        title={`Premium: ${lockModal.title}`}
      />
    </div>
  );
}
