import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import ReachMap from '@/components/home/ReachMap';

export default function ReachMapSection() {
  return (
    <section id="zasięg" className="py-24 lg:py-28 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gold text-xs tracking-[0.4em] uppercase"
            >
              Zasięg dojazdowy
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="font-display text-3xl lg:text-5xl mt-3 text-foreground"
            >
              Dojedziemy<br />do Ciebie
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="h-px mt-6 mb-6 origin-left bg-gold w-16"
            />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="text-muted-foreground text-lg leading-relaxed mb-8"
            >
              Sprawdź na mapie, czy Twoja dzielnica mieści się w naszym zasięgu. Dojeżdżamy do klientów w promieniu <strong className="text-foreground">50 km od Jaczkowic</strong> — województwo dolnośląskie i okolice.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="space-y-3 mb-8"
            >
              {[
                { icon: MapPin, text: 'Centrum zasięgu: Jaczkowice' },
                { icon: Navigation, text: 'Promień dojazdu: 50 km' },
                { icon: MapPin, text: 'Brak dojazdu? Zapraszamy do salonu' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <item.icon size={16} className="text-gold flex-shrink-0" />
                  {item.text}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <ReachMap />
          </motion.div>
        </div>
      </div>
    </section>
  );
}