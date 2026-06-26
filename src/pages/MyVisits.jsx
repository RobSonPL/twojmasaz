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
                placeholder="+48 787 907 141"
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
                  {/* Big loyalty counter */}
                  <div className={`mb-8 p-8 border-2 text-center relative overflow-hidden ${visitsToFree === 0 ? 'border-gold bg-gold/5' : 'border-border bg-secondary/40'}`}>
                    {visitsToFree === 0 ? (
                      <>
                        <div className="text-5xl mb-3">🎁</div>
                        <div className="font-display text-2xl text-gold mb-1">Twoja darmowa wizyta czeka!</div>
                        <p className="text-muted-foreground text-sm">Skontaktuj się, aby zarezerwować bezpłatny masaż.</p>
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-3">Do darmowego masażu</div>
                        <div className="font-mono text-7xl font-medium text-gold leading-none mb-2">{visitsToFree}</div>
                        <div className="text-muted-foreground text-sm">
                          {visitsToFree === 1 ? 'jeszcze jedna wizyta' : `jeszcze ${visitsToFree} wizyty`}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Stamp card */}
                  <div className="mb-8 p-6 border border-border bg-background">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs text-muted-foreground tracking-[0.25em] uppercase">Karta stemplowa</span>
                      <span className="text-xs text-muted-foreground">{cyclePosition === 0 && completedCount > 0 ? 5 : cyclePosition} / 5 w tym cyklu</span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-border rounded-full overflow-hidden mb-5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((cyclePosition === 0 && completedCount > 0 ? 5 : cyclePosition) / 5) * 100}%` }}
                        transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                        className="h-full bg-gold rounded-full"
                      />
                    </div>

                    {/* Stamps */}
                    <div className="flex justify-between gap-2">
                      {[1, 2, 3, 4, 5].map((n) => {
                        const filled = cyclePosition === 0 && completedCount > 0 ? true : n <= cyclePosition;
                        return (
                          <motion.div
                            key={n}
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 * n, type: 'spring', stiffness: 280 }}
                            className="flex-1 flex flex-col items-center gap-1.5"
                          >
                            <div
                              className="w-full aspect-square max-w-[52px] rounded-full border-2 flex items-center justify-center text-sm font-mono transition-all duration-300"
                              style={{
                                borderColor: filled ? '#C9A96E' : 'hsl(var(--border))',
                                backgroundColor: filled ? '#C9A96E' : 'transparent',
                                color: filled ? '#0A0A0A' : 'hsl(var(--muted-foreground))',
                                fontWeight: filled ? '700' : 'normal',
                              }}
                            >
                              {filled ? '✓' : n}
                            </div>
                          </motion.div>
                        );
                      })}
                      {/* 6th = gift */}
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, type: 'spring', stiffness: 280 }}
                        className="flex-1 flex flex-col items-center gap-1.5"
                      >
                        <div
                          className="w-full aspect-square max-w-[52px] rounded-full border-2 flex items-center justify-center transition-all duration-300"
                          style={{
                            borderColor: visitsToFree === 0 ? '#C9A96E' : 'hsl(var(--border))',
                            backgroundColor: visitsToFree === 0 ? '#C9A96E' : 'transparent',
                          }}
                        >
                          <Gift size={18} style={{ color: visitsToFree === 0 ? '#0A0A0A' : 'hsl(var(--muted-foreground))' }} />
                        </div>
                      </motion.div>
                    </div>

                    <div className="mt-4 text-center text-xs text-muted-foreground">
                      Łącznie {completedCount} ukończonych {completedCount === 1 ? 'wizyta' : 'wizyt'} · {earnedFree} {earnedFree === 1 ? 'darmowa wizyta' : 'darmowych wizyt'} zdobyta
                    </div>
                  </div>

                  {/* CTA */}
                  {visitsToFree === 0 ? (
                    <div className="border border-gold bg-gold/10 p-6 text-center mb-6">
                      <div className="text-gold text-2xl mb-2">🎁</div>
                      <div className="font-display text-xl mb-2">Masz darmową wizytę!</div>
                      <p className="text-muted-foreground text-sm mb-4">Skontaktuj się, aby zarezerwować swój bezpłatny masaż.</p>
                      <a
                        href="https://wa.me/48787907141?text=Cześć!%20Mam%20darmową%20wizytę%20z%20programu%20lojalnościowego%20i%20chciałbym/am%20ją%20zarezerwować."
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