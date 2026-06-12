import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, ArrowUpRight } from 'lucide-react';

export default function VoucherCTA() {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=900&q=80&auto=format&fit=crop"
                alt="Voucher prezentowy"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            {/* Voucher preview overlay */}
            <div className="absolute -bottom-8 -right-8 lg:right-8 w-48 h-28 bg-primary p-4 border border-gold/20">
              <div className="font-mono text-xs text-gold/60 tracking-widest mb-2">VOUCHER</div>
              <div className="font-display text-xl text-primary-foreground">250 PLN</div>
              <div className="font-mono text-xs text-primary-foreground/30 mt-1">WESOŁY MASAŻ</div>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="pt-12 lg:pt-0"
          >
            <div className="flex items-center gap-3 mb-6">
              <Gift size={18} className="text-gold" />
              <span className="text-gold text-xs tracking-[0.4em] uppercase">Prezenty</span>
            </div>

            <h2 className="font-display text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
              Podaruj chwilę<br />
              <em className="text-gold">prawdziwego</em><br />
              relaksu
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
              Vouchery prezentowe na konkretny masaż lub wybraną kwotę. Personalizowana dedykacja, elegancki design PDF — idealny prezent na każdą okazję.
            </p>

            <ul className="space-y-3 mb-10">
              {[
                'Voucher na konkretną usługę lub dowolną kwotę',
                'Personalizowana dedykacja od Ciebie',
                'Voucher PDF wysyłany natychmiast na e-mail',
                'Ważność 12 miesięcy od daty zakupu',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="text-gold mt-1 flex-shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to="/vouchery"
              className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 text-sm tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all duration-300 focus-gold"
            >
              Kup voucher prezentowy
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}