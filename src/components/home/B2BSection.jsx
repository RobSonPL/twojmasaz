import { motion } from 'framer-motion';
import { Building2, ExternalLink, Handshake } from 'lucide-react';

const partners = [
  {
    name: 'Care Solutions Polska',
    tagline: 'Programy wellbeing dla firm',
    description: 'Współpracujemy w zakresie masażu w miejscu pracy — programy prozdrowotne dla pracowników biurowych i fizycznych. Działamy na terenie całej Polski.',
    url: 'https://caresolutions.pl/',
    label: 'caresolutions.pl',
  },
  {
    name: 'Młyńskie SPA',
    tagline: 'Partner SPA & Wellness',
    description: 'Współpraca w zakresie usług SPA i relaksacyjnych — łączymy siły, aby oferować kompleksowe doświadczenia wellness dla naszych klientów.',
    url: 'https://www.facebook.com/mlynskiespa/?locale=pl_PL',
    label: 'facebook.com/mlynskiespa',
  },
  {
    name: 'Synapse Creative',
    tagline: 'Wydawnictwo cyfrowe & AI',
    description: 'Partner technologiczny — stworzenie i utrzymanie naszej platformy rezerwacji online, automatyzacje oraz rozwiązania AI wspierające obsługę klienta.',
    url: 'https://synapsehub.pl/',
    label: 'synapsehub.pl',
  },
];

export default function B2BSection() {
  return (
    <section id="wspolpraca" className="py-20 lg:py-24 bg-secondary/40 border-y border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold text-xs tracking-[0.4em] uppercase"
          >
            Współpraca B2B
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="font-display text-3xl lg:text-5xl mt-3 text-foreground"
          >
            Zaufali nam
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto mt-4"
          >
            Współpracujemy z firmami i organizacjami, które — tak jak my — stawiają na zdrowie, relaks i jakość. Poznaj naszych partnerów.
          </motion.p>
        </div>

        {/* Partner cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {partners.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="group border border-border bg-card p-6 lg:p-8 hover:border-gold/40 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-obsidian transition-all duration-300">
                  <Building2 size={18} />
                </div>
                <ExternalLink size={16} className="text-muted-foreground group-hover:text-gold transition-colors" />
              </div>

              <h3 className="font-display text-xl text-foreground mb-1">{p.name}</h3>
              <div className="text-gold text-xs tracking-[0.2em] uppercase mb-4">{p.tagline}</div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">{p.description}</p>
              <div className="font-mono text-xs text-muted-foreground/60 group-hover:text-gold transition-colors">
                {p.label}
              </div>
            </motion.a>
          ))}
        </div>

        {/* Collaboration CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="border border-gold/20 bg-card p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 border border-gold/40 flex items-center justify-center text-gold flex-shrink-0">
              <Handshake size={24} />
            </div>
            <div>
              <h3 className="font-display text-2xl text-foreground mb-1">Chcesz współpracować?</h3>
              <p className="text-muted-foreground text-sm max-w-xl">
                Jesteśmy otwarci na nowe partnerstwa — z firmami, SPA, strefami wellness oraz organizatorami eventów. Stwórzmy wspólnie program prozdrowotny dla Twoich pracowników lub klientów.
              </p>
            </div>
          </div>
          <a
            href="/#kontakt"
            className="flex-shrink-0 gold-outline-btn px-8 py-4 text-sm tracking-widest uppercase font-medium focus-gold"
          >
            Napisz do nas
          </a>
        </motion.div>
      </div>
    </section>
  );
}