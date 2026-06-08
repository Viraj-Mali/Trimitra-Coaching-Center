'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, Eye, EyeOff, X, Check, Image as ImageIcon } from 'lucide-react';

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  altText: string;
  sortOrder: number;
  isActive: boolean;
}

const BLANK = {
  imageUrl: '',
  caption: '',
  altText: '',
  sortOrder: 0,
  isActive: true,
};

export default function GalleryClient() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/gallery?all=true');
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const openAdd = () => {
    setEditing(null);
    setForm(BLANK);
    setShowForm(true);
  };

  const openEdit = (g: GalleryItem) => {
    setEditing(g);
    setForm({
      imageUrl: g.imageUrl,
      caption: g.caption,
      altText: g.altText,
      sortOrder: g.sortOrder,
      isActive: g.isActive,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? 'PATCH' : 'POST';
      const body = editing ? { id: editing.id, ...form } : form;
      const res = await fetch('/api/admin/gallery', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(editing ? 'Updated!' : 'Created!');
        setShowForm(false);
        fetch_();
      } else {
        toast.error('Failed to save');
      }
    } catch {
      toast.error('Network error');
    }
    setSaving(false);
  };

  const toggleActive = async (g: GalleryItem) => {
    const res = await fetch('/api/admin/gallery', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: g.id, isActive: !g.isActive }),
    });
    if (res.ok) {
      toast.success(g.isActive ? 'Hidden' : 'Activated!');
      fetch_();
    }
  };

  const del = async (g: GalleryItem) => {
    if (!confirm(`Delete this gallery image?`)) return;
    const res = await fetch('/api/admin/gallery', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: g.id }),
    });
    if (res.ok) {
      toast.success('Deleted');
      fetch_();
    } else {
      toast.error('Failed');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Gallery Management</h1>
          <p className="text-slate-400">Manage photos and images displayed in the website gallery.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-green/20 border border-brand-green/40 text-brand-green font-semibold rounded-xl hover:bg-brand-green/30 transition-all text-sm"
        >
          <Plus size={16} /> Add Image
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F2E5A] border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">{editing ? 'Edit' : 'Add'} Gallery Image</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {/* Preview */}
              {form.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-white/10 h-40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.imageUrl}
                    alt={form.altText || 'Preview'}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Image URL *</label>
                  <input
                    required
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={form.imageUrl}
                    onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Caption</label>
                  <input
                    type="text"
                    placeholder="e.g. Students at Annual Science Fest 2024"
                    value={form.caption}
                    onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Alt Text</label>
                  <input
                    type="text"
                    placeholder="Descriptive alt text for accessibility"
                    value={form.altText}
                    onChange={e => setForm(f => ({ ...f, altText: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <div
                      className={`w-11 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-brand-green' : 'bg-white/10'}`}
                      onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-sm text-slate-300">Active (visible on website)</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-green/20 border border-brand-green/40 text-brand-green font-bold rounded-xl hover:bg-brand-green/30 text-sm disabled:opacity-50"
                >
                  {saving ? <span className="w-4 h-4 border-2 border-brand-green/30 border-t-brand-green rounded-full animate-spin" /> : <Check size={16} />}
                  {editing ? 'Save Changes' : 'Add Image'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border border-white/20 text-slate-300 rounded-xl hover:bg-white/5 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div className="glass-card p-8 text-center text-slate-400">Loading...</div>
      ) : items.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <ImageIcon size={36} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No images yet. Click &quot;Add Image&quot; to upload one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(g => (
            <div key={g.id} className="glass-card overflow-hidden group">
              {/* Image Preview */}
              <div className="relative h-32 bg-white/5 overflow-hidden">
                {g.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={g.imageUrl}
                    alt={g.altText || g.caption || 'Gallery image'}
                    className="w-full h-full object-cover rounded-t-xl"
                    onError={e => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      el.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`${g.imageUrl ? 'hidden' : 'flex'} h-full items-center justify-center`}>
                  <ImageIcon size={28} className="text-slate-600" />
                </div>
                {/* Status Badge */}
                <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full border font-semibold ${g.isActive ? 'bg-brand-green/80 text-white border-brand-green' : 'bg-black/60 text-slate-400 border-white/20'}`}>
                  {g.isActive ? '● Active' : '○ Hidden'}
                </div>
              </div>
              {/* Info */}
              <div className="p-3">
                {g.caption && (
                  <p className="text-white text-xs font-medium truncate mb-0.5">{g.caption}</p>
                )}
                {g.altText && (
                  <p className="text-slate-500 text-xs truncate">{g.altText}</p>
                )}
                {/* Actions */}
                <div className="flex items-center gap-1 mt-2.5 pt-2.5 border-t border-white/10">
                  <button onClick={() => openEdit(g)} title="Edit" className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg flex-1 flex items-center justify-center">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => toggleActive(g)} title={g.isActive ? 'Hide' : 'Activate'} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg flex-1 flex items-center justify-center">
                    {g.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button onClick={() => del(g)} title="Delete" className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg flex-1 flex items-center justify-center">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
