import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    title: 'Wybierz usługę',
    description: 'Przeglądaj nasze masaże, wybierz ten odpowiedni dla Ciebie — klasyczny, głęboki, relaksacyjny lub specjalistyczny.',
  },
  {
    number: '02',
    title: 'Wybierz miejsce i termin',
    description: 'Dojazd do Twojego domu lub wizyta w salonie. Wybierz dostępny termin w kalendarzu — rezerwacja zajmuje minutę.',
  },
  {
    number: '03',
    title: 'Potwierdź i zrelaksuj się',
    description: 'Potwierdzenie rezerwacji trafia na Twój e-mail. Dzień przed wizytą przypomnę Ci przez WhatsApp.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="jak-to-dziala" className="section-padding bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gold text-xs tracking-[0.4em] uppercase"
            >
              Proces
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl lg:text-6xl mt-4 text-primary-foreground"
            >
              Jak to<br />działa
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-end"
          >
            <p className="text-primary-foreground/40 text-lg max-w-md">
              Trzy kroki dzielą Cię od chwili prawdziwego odprężenia. Bez telefonów, bez oczekiwania.
            </p>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="relative border-r border-white/5 last:border-r-0 px-0 md:px-10 first:pl-0 last:pr-0 pb-16 md:pb-0"
            >
              {/* Gold accent line at top */}
              <div className="h-px bg-gradient-to-r from-gold to-transparent mb-10 w-1/2" />

              <div className="font-mono text-xs text-gold tracking-widest mb-6">
                {step.number}
              </div>
              <h3 className="font-display text-2xl text-primary-foreground mb-4">
                {step.title}
              </h3>
              <p className="text-primary-foreground/40 text-base leading-relaxed">
                {step.description}
              </p>

              {/* Connector arrow (mobile only) */}
              {index < steps.length - 1 && (
                <div className="md:hidden absolute bottom-4 left-0 text-gold/30 text-2xl">↓</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-24 flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <Link
            to="/rezerwacja"
            className="gold-outline-btn px-10 py-4 text-sm tracking-widest uppercase font-medium focus-gold"
          >
            Zarezerwuj teraz
          </Link>
          <span className="text-primary-foreground/30 text-sm">Bez karty kredytowej · Bez rejestracji · 60 sekund</span>
        </motion.div>
      </div>
    </section>
  );
}