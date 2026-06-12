import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const steps = [
  { num: 1, label: '1. wizyta' },
  { num: 2, label: '2. wizyta' },
  { num: 3, label: '3. wizyta' },
  { num: 4, label: '4. wizyta' },
  { num: 5, label: '5. wizyta' },
  { num: 6, label: '6. GRATIS', gift: true },
];

const perks = [
  'Dotyczy wszystkich rodzajów masażu',
  'Wizyty można łączyć — dojazd i salon',
  'Punkty nie wygasają',
  'Bez rejestracji — rozpoznam Cię po imieniu',
];

export default function LoyaltySection() {
  return (
    <section id="program-lojalnosciowy" className="py-32 overflow-hidden bg-primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: content */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gold text-xs tracking-[0.4em] uppercase"
            >
              Program lojalnościowy
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="font-display text-4xl lg:text-6xl mt-4 leading-tight text-primary-foreground"
            >
              5 masaży,<br />
              <em className="not-italic text-gold">szósty gratis</em>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="h-px mt-8 mb-8 origin-left bg-gold"
              style={{ width: '5rem' }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-lg leading-relaxed mb-8 text-primary-foreground/60"
            >
              Regularne masaże to najlepsza inwestycja w zdrowie. Dlatego nagradzam lojalność — po każdych pięciu wizytach otrzymujesz szósty masaż całkowicie bezpłatnie. Bez kart, bez aplikacji — wystarczy Twoje imię.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
              className="space-y-3 mb-10"
            >
              {perks.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-primary-foreground/60">
                  <span className="mt-0.5 flex-shrink-0 text-gold">✦</span>
                  {item}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55 }}
            >
              <Link
                to="/rezerwacja"
                className="gold-outline-btn inline-flex items-center gap-3 px-10 py-4 text-sm tracking-widest uppercase font-medium"
              >
                Zacznij zbierać punkty
              </Link>
            </motion.div>
          </div>

          {/* Right: stamp card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative pt-6 pr-6"
          >
            <div
              className="relative p-8 lg:p-10"
              className="border border-primary-foreground/10 bg-primary-foreground/[0.03]"
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold" />

              <div className="text-center mb-8">
                <div className="text-xs tracking-[0.4em] uppercase mb-2 font-display text-gold">Wesoły Masaż</div>
                <div className="text-xs tracking-widest uppercase text-primary-foreground/40">Karta stałego klienta</div>
              </div>

              {/* Stamps */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex flex-col items-center gap-2 p-3"
                    className={step.gift ? 'border border-gold bg-gold/10' : 'border border-primary-foreground/10'}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      className={step.gift ? 'border border-gold bg-gold text-obsidian font-bold' : 'border border-primary-foreground/20 text-primary-foreground/30'}
                    >
                      {step.gift ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 12 20 22 4 22 4 12" />
                          <rect x="2" y="7" width="20" height="5" />
                          <line x1="12" y1="22" x2="12" y2="7" />
                          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                        </svg>
                      ) : (
                        <span className="font-mono text-xs">{step.num}</span>
                      )}
                    </div>
                    <span
                      className="text-xs tracking-wider"
                    className={step.gift ? 'text-gold font-medium' : 'text-primary-foreground/30'}
                    >
                      {step.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <div className="h-px mb-4" style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }} />
                <p className="text-xs tracking-widest uppercase text-primary-foreground/30">
                  Każda wizyta przybliża Cię do nagrody
                </p>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="absolute -top-2 -right-2 w-20 h-20 rounded-full flex flex-col items-center justify-center"
              className="bg-gold"
              style={{ boxShadow: '0 8px 30px rgba(201,169,110,0.4)' }}
            >
              <span className="font-display text-obsidian text-2xl font-bold leading-none">6</span>
              <span className="text-obsidian text-[9px] tracking-wider uppercase font-medium leading-none mt-0.5">gratis</span>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}