import { getDictionary } from '@/dictionaries';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { prisma } from '@/lib/prisma';

interface Props { params: { lang: string } }

export default async function ContactPage({ params }: Props) {
  const { lang } = params;
  const dict = await getDictionary(lang);

  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  const address = settings?.address || dict.footer.address;
  const phone = settings?.phone || dict.footer.phone;
  const email = settings?.email || dict.footer.email;
  const whatsapp = settings?.whatsapp || '9665269059';
  const waLink = `https://wa.me/91${whatsapp}?text=Hello%2C%20I%20am%20interested%20in%20enrolling%20at%20Trimitra%20Coaching%20Centre.`;

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle">Reach out to us for admissions, queries, or to enroll in our classes.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-6">Get In Touch</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-green/20 border border-brand-green/30 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={22} className="text-brand-green" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Address</h4>
                    <p className="text-slate-400 text-sm">{address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-amber/20 border border-brand-amber/30 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={22} className="text-brand-amber" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Phone</h4>
                    <a href={`tel:+91${phone}`} className="text-brand-amber hover:underline">+91 {phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center shrink-0">
                    <Mail size={22} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Email</h4>
                    <a href={`mailto:${email}`} className="text-blue-400 hover:underline">{email}</a>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full justify-center"
                >
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="glass-card p-6 text-center">
              <div className="bg-white/5 rounded-xl p-4 min-h-[10rem] flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={32} className="text-brand-green mx-auto mb-2" />
                  <p className="text-slate-400 text-sm font-semibold">Trimitra Coaching Centre</p>
                  <p className="text-slate-500 text-xs mt-1">{address}</p>
                  {settings?.mapsLink && (
                    <a
                      href={settings.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-green hover:underline text-xs mt-2.5 block font-medium"
                    >
                      View on Google Maps →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Lead Form */}
          <div>
            <LeadCaptureForm dict={dict.lead_form} />
          </div>
        </div>
      </div>
    </div>
  );
}
