'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Save, AlertTriangle, Building2, Phone, Mail, MapPin, Share2, Globe, FileText, Loader2 } from 'lucide-react';

interface SiteSettings {
  id?: string;
  instituteName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  logoUrl: string;
  mentorImageUrl: string;
  mapsLink: string;
  facebook: string;
  instagram: string;
  youtube: string;
  heroHeadline: string;
  heroSubheadline: string;
  brochureUrl: string;
}

const DEFAULTS: SiteSettings = {
  instituteName: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  logoUrl: '',
  mentorImageUrl: '',
  mapsLink: '',
  facebook: '',
  instagram: '',
  youtube: '',
  heroHeadline: '',
  heroSubheadline: '',
  brochureUrl: '',
};

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
      <div className="w-8 h-8 rounded-lg bg-brand-green/15 border border-brand-green/25 flex items-center justify-center">
        <Icon size={15} className="text-brand-green" />
      </div>
      <h2 className="text-white font-bold text-base">{title}</h2>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-green text-sm';
const textareaCls = `${inputCls} resize-none`;

export default function SettingsClient() {
  const [form, setForm] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setForm({ ...DEFAULTS, ...data });
      }
    } catch {
      toast.error('Failed to load settings');
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const set = (key: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Settings saved successfully!');
        const data = await res.json();
        setForm({ ...DEFAULTS, ...data });
      } else {
        toast.error('Failed to save settings');
      }
    } catch {
      toast.error('Network error');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-brand-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Site Settings</h1>
          <p className="text-slate-400">These settings control the contact info, WhatsApp number, and website content used across the website.</p>
        </div>
        <button
          form="settings-form"
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-green/20 border border-brand-green/40 text-brand-green font-semibold rounded-xl hover:bg-brand-green/30 transition-all text-sm disabled:opacity-50"
        >
          {saving ? <span className="w-4 h-4 border-2 border-brand-green/30 border-t-brand-green rounded-full animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>

      {/* Important notice */}
      <div className="flex items-start gap-3 p-4 bg-brand-amber/10 border border-brand-amber/30 rounded-xl">
        <AlertTriangle size={18} className="text-brand-amber shrink-0 mt-0.5" />
        <p className="text-brand-amber text-sm font-medium">
          After updating WhatsApp number, visitors will be contacted on that number from all CTAs on the website.
        </p>
      </div>

      <form id="settings-form" onSubmit={handleSave} className="space-y-6">
        {/* Institute Information */}
        <div className="glass-card p-6">
          <SectionHeader icon={Building2} title="Institute Information" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Institute Name">
              <input
                type="text"
                placeholder="e.g. Trimitra Coaching Centre"
                value={form.instituteName}
                onChange={set('instituteName')}
                className={inputCls}
              />
            </Field>
            <Field label="Phone Number">
              <input
                type="text"
                placeholder="e.g. +91 98765 43210"
                value={form.phone}
                onChange={set('phone')}
                className={inputCls}
              />
            </Field>
            <Field label="WhatsApp Number">
              <input
                type="text"
                placeholder="e.g. +91 98765 43210 (digits only recommended)"
                value={form.whatsapp}
                onChange={set('whatsapp')}
                className={inputCls}
              />
            </Field>
            <Field label="Email Address">
              <input
                type="email"
                placeholder="e.g. info@trimitra.com"
                value={form.email}
                onChange={set('email')}
                className={inputCls}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Address">
                <input
                  type="text"
                  placeholder="e.g. 123, Main Street, Pune, Maharashtra - 424611"
                  value={form.address}
                  onChange={set('address')}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="glass-card p-6">
          <SectionHeader icon={MapPin} title="Google Maps" />
          <Field label="Google Maps Embed / Link URL">
            <input
              type="url"
              placeholder="https://maps.google.com/maps?q=..."
              value={form.mapsLink}
              onChange={set('mapsLink')}
              className={inputCls}
            />
          </Field>
          {form.mapsLink && (
            <a
              href={form.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-xs text-brand-green hover:underline"
            >
              <Globe size={12} /> Preview link
            </a>
          )}
        </div>

        {/* Social Media */}
        <div className="glass-card p-6">
          <SectionHeader icon={Share2} title="Social Media" />
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Facebook URL">
              <input
                type="url"
                placeholder="https://facebook.com/..."
                value={form.facebook}
                onChange={set('facebook')}
                className={inputCls}
              />
            </Field>
            <Field label="Instagram URL">
              <input
                type="url"
                placeholder="https://instagram.com/..."
                value={form.instagram}
                onChange={set('instagram')}
                className={inputCls}
              />
            </Field>
            <Field label="YouTube URL">
              <input
                type="url"
                placeholder="https://youtube.com/..."
                value={form.youtube}
                onChange={set('youtube')}
                className={inputCls}
              />
            </Field>
          </div>
        </div>

        {/* Website Content */}
        <div className="glass-card p-6">
          <SectionHeader icon={Globe} title="Website Content" />
          <div className="space-y-4">
            <Field label="Hero Headline">
              <textarea
                rows={2}
                placeholder="e.g. Where Students Discover Their Potential"
                value={form.heroHeadline}
                onChange={set('heroHeadline')}
                className={textareaCls}
              />
            </Field>
            <Field label="Hero Sub-headline">
              <textarea
                rows={3}
                placeholder="e.g. Expert coaching for Foundation, Board, Science and Competitive exams…"
                value={form.heroSubheadline}
                onChange={set('heroSubheadline')}
                className={textareaCls}
              />
            </Field>
          </div>
        </div>

        {/* Branding & Images */}
        <div className="glass-card p-6">
          <SectionHeader icon={Building2} title="Branding & Images" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Logo Image URL">
              <input
                type="text"
                placeholder="e.g. /logo.png"
                value={form.logoUrl}
                onChange={set('logoUrl')}
                className={inputCls}
              />
            </Field>
            <Field label="Mentor Image URL">
              <input
                type="text"
                placeholder="e.g. /mentor-sarthak.png"
                value={form.mentorImageUrl}
                onChange={set('mentorImageUrl')}
                className={inputCls}
              />
            </Field>
          </div>
        </div>

        {/* Brochure PDF */}
        <div className="glass-card p-6">
          <SectionHeader icon={FileText} title="Brochure PDF" />
          <Field label="Brochure URL">
            <input
              type="url"
              placeholder="https://example.com/brochure.pdf"
              value={form.brochureUrl}
              onChange={set('brochureUrl')}
              className={inputCls}
            />
          </Field>
          {form.brochureUrl && (
            <a
              href={form.brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-xs text-brand-green hover:underline"
            >
              <FileText size={12} /> Preview PDF
            </a>
          )}
        </div>

        {/* Bottom Save */}
        <div className="flex justify-end pb-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-brand-green/20 border border-brand-green/40 text-brand-green font-bold rounded-xl hover:bg-brand-green/30 transition-all text-sm disabled:opacity-50"
          >
            {saving ? <span className="w-4 h-4 border-2 border-brand-green/30 border-t-brand-green rounded-full animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving…' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
