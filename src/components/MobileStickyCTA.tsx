'use client';

import { Phone, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MobileStickyCTA({ phone, whatsapp, lang }: { phone: string, whatsapp: string, lang: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling past the hero section
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const waLink = `https://wa.me/91${whatsapp}?text=Hello%2C%20I%20am%20interested%20in%20a%20free%20demo%20class%20at%20Trimitra%20Coaching%20Centre.`;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-[#0F2E5A] border-t border-white/10 p-3 sm:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.3)] transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="flex gap-3">
        <a
          href={`tel:+91${phone}`}
          className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-colors border border-white/10"
        >
          <Phone size={18} />
          <span>{lang === 'mr' ? 'कॉल करा' : 'Call Now'}</span>
        </a>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-green-500/30"
        >
          <MessageCircle size={18} />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
