import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground/60">
      <div className="luminous-rule" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 border border-gold flex items-center justify-center">
                <span className="font-display text-xs font-semibold text-gold tracking-widest">WM</span>
              </div>
              <span className="font-display text-sm tracking-[0.2em] uppercase text-primary-foreground font-medium">
                Wesoły Masaż
              </span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/50 max-w-xs">
              Profesjonalne masaże z dojazdem do klienta i w salonie. Twój komfort jest naszym priorytetem.
            </p>
            <div className="flex gap-4 mt-8">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://wa.me/48000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-primary-foreground text-xs tracking-[0.2em] uppercase mb-6">Nawigacja</h4>
            <ul className="space-y-3">
              {[
                { label: 'Usługi', href: '/#uslugi' },
                { label: 'Jak to działa', href: '/#jak-to-dziala' },
                { label: 'Vouchery prezentowe', href: '/vouchery' },
                { label: 'Zarezerwuj wizytę', href: '/rezerwacja' },
                { label: 'Kontakt', href: '/#kontakt' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/50 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-primary-foreground text-xs tracking-[0.2em] uppercase mb-6">Kontakt</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={14} className="text-gold mt-1 flex-shrink-0" />
                <a href="tel:+48000000000" className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                  +48 000 000 000
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={14} className="text-gold mt-1 flex-shrink-0" />
                <a href="mailto:kontakt@twojmasaz.life" className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                  kontakt@twojmasaz.life
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-gold mt-1 flex-shrink-0" />
                <span className="text-sm text-primary-foreground/50">
                  Dojazd do klienta<br />
                  + Salon stacjonarny
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="luminous-rule mt-16 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/30 tracking-wider">
          <p>© {new Date().getFullYear()} Wesoły Masaż. Wszelkie prawa zastrzeżone.</p>
          <p>Projekt z troską o Twój relaks</p>
        </div>
      </div>
    </footer>
  );
}