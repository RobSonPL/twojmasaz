import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Anna K.',
    text: 'Najlepszy masaż, jaki miałam. Dojazd do domu to dla mnie ogromna wygoda — nie muszę dojeżdżać przez pół miasta po relaksie. Polecam każdemu!',
    rating: 5,
    service: 'Masaż Relaksacyjny',
  },
  {
    name: 'Marek W.',
    text: 'Masaż głęboki naprawdę pomógł z bólem pleców, który mnie męczył od miesięcy. Profesjonalne podejście, poczułem różnicę już po pierwszej wizycie.',
    rating: 5,
    service: 'Masaż Głęboki',
  },
  {
    name: 'Joanna P.',
    text: 'Rezerwacja online w 2 minuty, przypomnienie dzień przed wizytą — wszystko bez zadzwaniania. Sama usługa była fenomenalna. Wracam regularnie.',
    rating: 5,
    service: 'Masaż Klasyczny',
  },
];

export default function TestimonialsSection() {
  return (
    <section id="opinie" className="section-padding bg-primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold text-xs tracking-[0.4em] uppercase"
          >
            Opinie
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl lg:text-6xl mt-4 text-primary-foreground"
          >
            Co mówią<br />klienci
          </motion.h2>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="border border-primary-foreground/10 p-8 hover:border-gold/20 transition-all duration-500 group"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={12} className="text-gold fill-gold" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-primary-foreground/60 text-base leading-relaxed mb-8 italic font-display">
                „{t.text}"
              </p>

              {/* Author */}
              <div className="border-t border-primary-foreground/10 pt-6 flex justify-between items-end">
                <div>
                  <div className="text-primary-foreground text-sm font-medium">{t.name}</div>
                  <div className="text-primary-foreground/30 text-xs tracking-wider mt-1">{t.service}</div>
                </div>
                <div className="font-mono text-xs text-gold/40 group-hover:text-gold/70 transition-colors">★ {t.rating}.0</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rating summary */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 border border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            <div className="font-mono text-5xl text-primary-foreground">4.9</div>
            <div className="text-primary-foreground/30 text-xs tracking-widest uppercase mt-2">Średnia ze wszystkich opinii</div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} className="text-gold fill-gold" />
            ))}
          </div>
          <div className="text-primary-foreground/30 text-sm text-center md:text-right max-w-xs">
            Ponad 500 zadowolonych klientów. Dołącz do nich — zarezerwuj swoją wizytę już dziś.
          </div>
        </motion.div>
      </div>
    </section>
  );
}