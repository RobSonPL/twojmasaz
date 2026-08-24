import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Building2, Clock, Wallet, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const defaultServices = [
  { id: '1', name: 'Masaż Całościowy', price: 200, duration_minutes: 60, is_available_home: true, is_available_studio: true },
  { id: '2', name: 'Masaż Klasyczny', price: 200, duration_minutes: 60, is_available_home: true, is_available_studio: true },
  { id: '3', name: 'Masaż Głęboki', price: 150, duration_minutes: 30, is_available_home: true, is_available_studio: true },
  { id: '4', name: 'Masaż Gorącymi Kamieniami', price: 200, duration_minutes: 60, is_available_home: false, is_available_studio: true },
  { id: '5', name: 'Masaż Sportowy', price: 200, duration_minutes: 60, is_available_home: true, is_available_studio: true },
  { id: '6', name: 'Masaż Twarzy', price: 100, duration_minutes: 30, is_available_home: false, is_available_studio: true },
  { id: '7', name: 'Masaż Bańką Chińską', price: 100, duration_minutes: 30, is_available_home: true, is_available_studio: true },
  { id: '8', name: 'Masaż Nerwu Błędnego', price: 200, duration_minutes: 45, is_available_home: true, is_available_studio: true },
  { id: '9', name: 'Drenaż Limfatyczny', price: 200, duration_minutes: 60, is_available_home: true, is_available_studio: true },
  { id: '10', name: 'Masaż na Zmęczenie', price: 200, duration_minutes: 60, is_available_home: true, is_available_studio: true },
  { id: '11', name: 'Masaż Ból Łopatki/Pleców', price: 200, duration_minutes: 60, is_available_home: true, is_available_studio: true },
  { id: '12', name: 'Masaż Łokieć Tenisisty', price: 100, duration_minutes: 30, is_available_home: true, is_available_studio: true },
  { id: '13', name: 'Masaż Kręgosłupa', price: 200, duration_minutes: 45, is_available_home: true, is_available_studio: true },
  { id: '14', name: 'Masaż Lędźwi', price: 200, duration_minutes: 60, is_available_home: true, is_available_studio: true },
  { id: '15', name: 'Masaż Nóg i Ud', price: 200, duration_minutes: 45, is_available_home: true, is_available_studio: true },
  { id: '16', name: 'Masaż Indywidualny', price: 0, duration_minutes: 120, is_available_home: true, is_available_studio: true },
];

export default function PriceCalculator() {
  const [services, setServices] = useState(defaultServices);
  const [selectedId, setSelectedId] = useState(defaultServices[0].id);
  const [bookingType, setBookingType] = useState('studio');

  useEffect(() => {
    base44.entities.Service.filter({ is_active: true }, 'sort_order', 20)
      .then(data => { if (data.length > 0) setServices(data); })
      .catch(() => {});
  }, []);

  const selected = services.find(s => s.id === selectedId) || services[0];

  // Auto-switch type if current selection unavailable
  useEffect(() => {
    if (bookingType === 'home' && !selected.is_available_home) setBookingType('studio');
    if (bookingType === 'studio' && !selected.is_available_studio) setBookingType('home');
  }, [selectedId]);

  const canHome = selected.is_available_home;
  const canStudio = selected.is_available_studio;

  return (
    <section id="kalkulator" className="py-24 lg:py-28 bg-background">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold text-xs tracking-[0.4em] uppercase"
          >
            Kalkulator cen
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="font-display text-3xl lg:text-5xl mt-3 text-foreground"
          >
            Sprawdź cenę<br />swojego masażu
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="text-muted-foreground text-base mt-4 max-w-lg mx-auto"
          >
            Wybierz usługę i miejsce — kalkulator pokaże koszt i czas trwania przed rezerwacją.
          </motion.p>
        </div>

        {/* Calculator card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="border border-border bg-card p-6 lg:p-10"
        >
          {/* Service selector */}
          <div className="mb-8">
            <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Wybierz usługę</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`text-left px-4 py-3 border text-sm transition-all duration-200 ${
                    selectedId === s.id
                      ? 'border-gold bg-gold/5 text-foreground'
                      : 'border-border text-muted-foreground hover:border-gold/40 hover:text-foreground'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Type toggle */}
          <div className="mb-8">
            <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Miejsce</label>
            <div className="flex gap-3">
              <button
                onClick={() => canHome && setBookingType('home')}
                disabled={!canHome}
                className={`flex items-center gap-2 px-5 py-3 border text-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
                  bookingType === 'home'
                    ? 'border-gold bg-gold/5 text-foreground'
                    : 'border-border text-muted-foreground hover:border-gold/40 hover:text-foreground'
                }`}
              >
                <Home size={14} /> Dojazd
              </button>
              <button
                onClick={() => canStudio && setBookingType('studio')}
                disabled={!canStudio}
                className={`flex items-center gap-2 px-5 py-3 border text-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
                  bookingType === 'studio'
                    ? 'border-gold bg-gold/5 text-foreground'
                    : 'border-border text-muted-foreground hover:border-gold/40 hover:text-foreground'
                }`}
              >
                <Building2 size={14} /> Salon
              </button>
            </div>
            {!canHome && !canStudio && (
              <p className="text-xs text-muted-foreground mt-2">Ta usługa jest obecnie niedostępna.</p>
            )}
          </div>

          {/* Result */}
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                  <Wallet size={12} /> Cena
                </div>
                <div className="font-mono text-3xl text-foreground font-medium">{selected.price} PLN</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                  <Clock size={12} /> Czas
                </div>
                <div className="font-mono text-3xl text-foreground font-medium">{selected.duration_minutes} min</div>
              </div>
            </div>

            <Link
              to={`/rezerwacja?service=${selected.id}&type=${bookingType}`}
              className="flex items-center gap-2 bg-foreground text-background px-6 py-3 text-xs tracking-widest uppercase font-medium hover:bg-gold hover:text-obsidian transition-all duration-300 focus-gold"
            >
              Rezerwuj
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {bookingType === 'home' && (
            <p className="text-xs text-muted-foreground mt-4">
              * Dojazd powyżej 50 km od Jaczkowic doliczany jest zgodnie z cennikiem. Dokładny koszt zostanie podany podczas rezerwacji.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}