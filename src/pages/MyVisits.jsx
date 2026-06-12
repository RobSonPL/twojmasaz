import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layout/PageLayout';
import { Gift, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const LOYALTY_GOAL = 6;

export default function MyVisits() {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    const all = await base44.entities.Booking.filter({ client_phone: phone.trim(), status: 'completed' });
    setBookings(all);
    setSubmitted(true);
    setLoading(false);
  };

  const completedCount = bookings.length;
  const cyclePosition = completedCount % (LOYALTY_GOAL - 1); // position in current cycle (0-4)
  const cyclesCompleted = Math.floor(completedCount / (LOYALTY_GOAL - 1));
  const visitsToFree = cyclePosition === 0 && completedCount > 0 ? 0 : (LOYALTY_GOAL - 1) - cyclePosition;
  const earnedFree = cyclesCompleted;

  return (
    <PageLayout>
      <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-gold text-xs tracking-[0.4em] uppercase">Program lojalnościowy</span>
            <h1 className="font-display text-4xl lg:text-5xl mt-3 mb-4" style={{ color: 'var(--foreground-heading, inherit)' }}>
              Moje wizyty
            </h1>
            <p className="text-muted-foreground mb-10">
              Wpisz swój numer telefonu, aby sprawdzić postęp w programie lojalnościowym.
            </p>
          </motion.div>

          {/* Search form */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="flex gap-3 mb-12"
          >
            <div className="flex-1 relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+48 000 000 000"
                className="w-full border border-border bg-background pl-10 pr-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold transition-colors text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-obsidian text-bone px-6 py-3 text-sm tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all duration-300 disabled:opacity-50 whitespace-nowrap"
              style={{ backgroundColor: 'var(--color-obsidian, #0A0A0A)', color: '#FAFAFA' }}
            >
              {loading ? 'Szukam...' : 'Sprawdź'}
            </button>
          </motion.form>

          {/* Results */}
          {submitted && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {bookings.length === 0 ? (
                <div className="text-center py-16 border border-border">
                  <p className="text-muted-foreground mb-4">Nie znaleziono wizyt dla tego numeru.</p>
                  <Link to="/rezerwacja" className="text-gold text-sm tracking-widest uppercase hover:underline">
                    Zarezerwuj pierwszą wizytę →
                  </Link>
                </div>
              ) : (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="border border-border p-5 text-center">
                      <div className="font-mono text-3xl font-medium text-gold">{completedCount}</div>
                      <div className="text-xs text-muted-foreground tracking-widest uppercase mt-1">Wizyt łącznie</div>
                    </div>
                    <div className="border border-border p-5 text-center">
                      <div className="font-mono text-3xl font-medium" style={{ color: visitsToFree === 0 ? '#C9A96E' : 'inherit' }}>
                        {visitsToFree === 0 ? '🎁' : visitsToFree}
                      </div>
                      <div className="text-xs text-muted-foreground tracking-widest uppercase mt-1">
                        {visitsToFree === 0 ? 'Gratis gotowy!' : 'Do darmowej'}
                      </div>
                    </div>
                    <div className="border border-border p-5 text-center">
                      <div className="font-mono text-3xl font-medium text-gold">{earnedFree}</div>
                      <div className="text-xs text-muted-foreground tracking-widest uppercase mt-1">Darmowe wizyty</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-10">
                    <div className="flex justify-between text-xs text-muted-foreground tracking-widest uppercase mb-3">
                      <span>Postęp w bieżącym cyklu</span>
                      <span>{cyclePosition === 0 && completedCount > 0 ? 5 : cyclePosition} / 5</span>
                    </div>
                    <div className="h-2 bg-border relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((cyclePosition === 0 && completedCount > 0 ? 5 : cyclePosition) / 5) * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full"
                        style={{ backgroundColor: '#C9A96E' }}
                      />
                    </div>

                    {/* Stamp dots */}
                    <div className="grid grid-cols-6 gap-2 mt-4">
                      {[1, 2, 3, 4, 5].map((n) => {
                        const filled = cyclePosition === 0 && completedCount > 0 ? true : n <= cyclePosition;
                        return (
                          <div
                            key={n}
                            className="flex flex-col items-center gap-1"
                          >
                            <div
                              className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-mono transition-all"
                              style={{
                                borderColor: filled ? '#C9A96E' : 'var(--border-color, #e5e5e5)',
                                backgroundColor: filled ? '#C9A96E' : 'transparent',
                                color: filled ? '#0A0A0A' : 'var(--muted-color, #999)',
                                fontWeight: filled ? '600' : 'normal',
                              }}
                            >
                              {filled ? '✓' : n}
                            </div>
                          </div>
                        );
                      })}
                      {/* 6th = gift */}
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all"
                          style={{
                            borderColor: visitsToFree === 0 ? '#C9A96E' : 'var(--border-color, #e5e5e5)',
                            backgroundColor: visitsToFree === 0 ? '#C9A96E' : 'transparent',
                          }}
                        >
                          <Gift size={16} style={{ color: visitsToFree === 0 ? '#0A0A0A' : '#999' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  {visitsToFree === 0 ? (
                    <div className="border border-gold bg-gold/10 p-6 text-center mb-6">
                      <div className="text-gold text-2xl mb-2">🎁</div>
                      <div className="font-display text-xl mb-2">Masz darmową wizytę!</div>
                      <p className="text-muted-foreground text-sm mb-4">Skontaktuj się, aby zarezerwować swój bezpłatny masaż.</p>
                      <a
                        href="https://wa.me/48884060680?text=Cześć!%20Mam%20darmową%20wizytę%20z%20programu%20lojalnościowego%20i%20chciałbym/am%20ją%20zarezerwować."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm tracking-widest uppercase font-medium transition-colors"
                        style={{ backgroundColor: '#25D366', color: 'white' }}
                      >
                        Zarezerwuj przez WhatsApp
                      </a>
                    </div>
                  ) : (
                    <Link
                      to="/rezerwacja"
                      className="block text-center border border-border px-6 py-4 text-sm tracking-widest uppercase hover:border-gold hover:text-gold transition-colors"
                    >
                      Zarezerwuj kolejną wizytę →
                    </Link>
                  )}

                  {/* Visit history */}
                  <div className="mt-10">
                    <div className="text-xs text-muted-foreground tracking-widest uppercase mb-4">Historia wizyt</div>
                    <div className="space-y-2">
                      {[...bookings].reverse().map((b, i) => (
                        <div key={b.id} className="flex items-center justify-between border border-border px-4 py-3 text-sm">
                          <div>
                            <span className="font-medium">{b.service_name}</span>
                            <span className="text-muted-foreground ml-3">{b.booking_date}</span>
                          </div>
                          <span className="font-mono text-gold">{b.service_price} PLN</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}