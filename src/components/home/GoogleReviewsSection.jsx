import { motion } from 'framer-motion';
import { Star, ExternalLink, MessageSquare } from 'lucide-react';

// ══════════════════════════════════════════════════════════════════
//  KONFIGURACJA WIDGETU OPINII GOOGLE
//  1. Wejdź na https://www.trustindex.io/t/google-reviews-widget
//     (lub https://elfsight.com/google-reviews-widget/) i utwórz
//     darmowy widget powiązany z Twoją wizytówką Google.
//  2. W wygenerowanym kodzie osadzania znajdź adres URL atrybutu
//     src znacznika <iframe> (Trustindex) i wklej go poniżej.
//  3. Opcjonalnie uzupełnij średnią ocenę i liczbę opinii w plakietce.
// ══════════════════════════════════════════════════════════════════
const WIDGET_URL = ''; // np. 'https://widget.trustindex.io/google/XXXXXXXX'
const GOOGLE_RATING = '5.0';
const REVIEWS_COUNT = ''; // np. '48'
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Weso%C5%82y+Masa%C5%BC+Jaczkowice';

function GoogleG({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export default function GoogleReviewsSection() {
  const hasWidget = Boolean(WIDGET_URL);

  return (
    <section id="opinie" className="section-padding bg-primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header + Google badge */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gold text-xs tracking-[0.4em] uppercase"
            >
              Opinie Google
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl lg:text-6xl mt-4 text-primary-foreground"
            >
              Zaufali nam<br />setki klientów
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 border border-primary-foreground/10 px-6 py-4"
          >
            <GoogleG size={32} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl text-primary-foreground">{GOOGLE_RATING}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="text-gold fill-gold" />
                  ))}
                </div>
              </div>
              <div className="text-primary-foreground/40 text-xs tracking-wider mt-1">
                {REVIEWS_COUNT ? `${REVIEWS_COUNT} opinii w Google` : 'Opinie z wizytówki Google'}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Widget lub instrukcja konfiguracji */}
        {hasWidget ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border border-primary-foreground/10 overflow-hidden bg-primary-foreground/5"
          >
            <iframe
              src={WIDGET_URL}
              title="Opinie Google — Wesoły Masaż"
              className="w-full"
              style={{ minHeight: '540px', border: 0 }}
              loading="lazy"
              allowFullScreen
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border border-dashed border-primary-foreground/20 p-12 text-center"
          >
            <MessageSquare size={32} className="text-gold/50 mx-auto mb-4" />
            <p className="text-primary-foreground/60 max-w-lg mx-auto mb-6">
              Tu pojawią się opinie pobierane automatycznie z Twojej wizytówki Google.
              Skonfiguruj widget w pliku{' '}
              <code className="text-gold font-mono text-sm">GoogleReviewsSection.jsx</code>.
            </p>
            <a
              href="https://www.trustindex.io/t/google-reviews-widget"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold text-sm tracking-widest uppercase hover:text-gold-light transition-colors"
            >
              Utwórz darmowy widget
              <ExternalLink size={14} />
            </a>
          </motion.div>
        )}

        {/* CTA — wizytówka Google */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary-foreground/40 hover:text-gold transition-colors text-sm tracking-wider"
          >
            <GoogleG size={16} />
            Zobacz wizytówkę i zostaw opinię w Google
            <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}