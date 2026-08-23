import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Home, Building2 } from 'lucide-react';

const defaultServices = [
  {
    id: '1', name: 'Masaż Klasyczny', category: 'relaksacyjny',
    price: 150, duration_minutes: 60,
    description: 'Relaksujący masaż całego ciała technikami klasycznymi — uśmierza napięcia i poprawia krążenie.',
    is_available_home: true, is_available_studio: true,
    image_url: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800&q=80&auto=format&fit=crop'
  },
  {
    id: '2', name: 'Masaż Głęboki', category: 'terapeutyczny',
    price: 180, duration_minutes: 60,
    description: 'Intensywna praca na głębszych warstwach mięśni — ideał przy chronicznych bólach i przykurczach.',
    is_available_home: true, is_available_studio: true,
    image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop'
  },
  {
    id: '3', name: 'Masaż Relaksacyjny', category: 'relaksacyjny',
    price: 200, duration_minutes: 90,
    description: 'Długi, kojący masaż z aromaterapią — pełne odprężenie ciała i umysłu.',
    is_available_home: true, is_available_studio: true,
    image_url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80&auto=format&fit=crop'
  },
  {
    id: '4', name: 'Gorące Kamienie', category: 'specjalistyczny',
    price: 250, duration_minutes: 90,
    description: 'Masaż bazaltowymi kamieniami wulkanicznymi — głęboka relaksacja i poprawa metabolizmu.',
    is_available_home: false, is_available_studio: true,
    image_url: 'https://images.unsplash.com/photo-1580161520529-5e2e0a3a6d6b?w=800&q=80&auto=format&fit=crop'
  },
  {
    id: '5', name: 'Masaż Sportowy', category: 'sportowy',
    price: 170, duration_minutes: 60,
    description: 'Dedykowany sportowcom — przyspiesza regenerację, zmniejsza ryzyko kontuzji.',
    is_available_home: true, is_available_studio: true,
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop'
  },
  {
    id: '6', name: 'Masaż Twarzy', category: 'specjalistyczny',
    price: 100, duration_minutes: 30,
    description: 'Delikatny lifting manualny i drenaż limfatyczny — promienna cera i redukcja napięć.',
    is_available_home: false, is_available_studio: true,
    image_url: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80&auto=format&fit=crop'
  },
];

function ServiceRow({ service, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <div
        className="border-b border-border group cursor-pointer"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* Main row */}
        <div className="flex items-center justify-between py-6 lg:py-8 gap-6">
          <div className="flex items-center gap-6 flex-1 min-w-0">
            <span className="font-mono text-xs text-muted-foreground w-6 flex-shrink-0">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-xl lg:text-2xl text-foreground group-hover:text-gold transition-colors duration-300 truncate">
                {service.name}
              </h3>
              <div className="flex items-center gap-4 mt-1">
                {service.is_available_home && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Home size={10} /> Dojazd
                  </span>
                )}
                {service.is_available_studio && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Building2 size={10} /> Salon
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <div className="font-mono text-lg lg:text-xl font-medium text-foreground">
                {service.price} PLN
              </div>
              <div className="text-xs text-muted-foreground tracking-widest">
                {service.duration_minutes} MIN
              </div>
            </div>
            <Link
              to={`/rezerwacja?service=${service.id}`}
              className="w-10 h-10 border border-border group-hover:border-gold flex items-center justify-center transition-all duration-300 hover:bg-gold hover:text-obsidian focus-gold"
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-gold" />
            </Link>
          </div>
        </div>

        {/* Expanded row */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex gap-4 mt-4 sm:hidden">
                    <span className="font-mono text-sm font-medium">{service.price} PLN</span>
                    <span className="text-muted-foreground text-sm">{service.duration_minutes} min</span>
                  </div>
                </div>
                {service.image_url && (
                  <div className="aspect-video lg:aspect-square overflow-hidden">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function ServicesSection({ services }) {
  const displayServices = services?.length > 0 ? services : defaultServices;

  return (
    <section id="uslugi" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-5">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gold text-xs tracking-[0.4em] uppercase"
            >
              Oferta
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl lg:text-6xl mt-4 text-foreground"
            >
              Nasze<br />masaże
            </motion.h2>
          </div>
          <div className="lg:col-span-7 lg:flex lg:items-end lg:pb-4">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-lg max-w-lg"
            >
              Każda technika zaprojektowana z konkretnym celem — od głębokiego relaksu po skuteczną regenerację. Najedź kursorem, aby zobaczyć szczegóły.
            </motion.p>
          </div>
        </div>

        {/* Service list */}
        <div>
          {displayServices.map((service, index) => (
            <ServiceRow key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col sm:flex-row gap-4 items-start"
        >
          <Link
            to="/rezerwacja"
            className="bg-foreground text-background px-8 py-4 text-sm tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all duration-300 focus-gold"
          >
            Zarezerwuj wizytę online
          </Link>
        </motion.div>
      </div>
    </section>
  );
}