import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layout/PageLayout';
import { Link } from 'react-router-dom';
import { Gift, Calendar, Tag, User, LogOut, ChevronRight, Star, LayoutDashboard, X, Package, Users } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import LoyaltyTiers from '@/components/account/LoyaltyTiers';
import PackagesTab from '@/components/account/PackagesTab';
import ReferralSection from '@/components/referral/ReferralSection';
import ClientCard from '@/components/account/ClientCard';

const LOYALTY_GOAL = 5;

const tabs = [
  { id: 'overview', label: 'Przegląd', icon: User },
  { id: 'visits', label: 'Wizyty', icon: Calendar },
  { id: 'loyalty', label: 'Lojalność', icon: Star },
  { id: 'vouchers', label: 'Vouchery', icon: Tag },
  { id: 'packages', label: 'Karnety', icon: Package },
  { id: 'referral', label: 'Polecenia', icon: Users },
];

export default function AccountPage() {
  const { user, isAuthenticated, isLoadingAuth, logout, navigateToLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    setLoadingData(true);
    const [b, v, p] = await Promise.all([
      base44.entities.Booking.filter({ client_email: user.email }, '-booking_date', 50),
      base44.entities.Voucher.filter({ buyer_email: user.email }, '-created_date', 20),
      base44.entities.Package.filter({ owner_email: user.email }, '-created_date', 20),
    ]);
    setBookings(b);
    setVouchers(v);
    setPackages(p);
    setLoadingData(false);
  };

  if (isLoadingAuth) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-border border-t-gold rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 border border-border flex items-center justify-center mx-auto mb-6">
              <User size={24} className="text-muted-foreground" />
            </div>
            <h1 className="font-display text-3xl mb-4 text-foreground">Zaloguj się</h1>
            <p className="text-muted-foreground mb-8">
              Zaloguj się, aby zobaczyć historię wizyt, postęp programu lojalnościowego i swoje vouchery.
            </p>
            <button
              onClick={navigateToLogin}
              className="bg-foreground text-background px-10 py-4 text-sm tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all duration-300"
            >
              Zaloguj się
            </button>
            <div className="mt-4">
              <Link to="/register" className="text-muted-foreground text-sm hover:text-gold transition-colors">
                Nie masz konta? Zarejestruj się →
              </Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  const cancelBooking = async (bookingId) => {
    if (!confirm('Czy na pewno chcesz anulować tę wizytę?')) return;
    await base44.entities.Booking.update(bookingId, { status: 'cancelled' });
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
  };

  const completedBookings = bookings.filter(b => b.status === 'completed');
  const completedCount = completedBookings.length;
  const totalSpend = completedBookings.reduce((sum, b) => sum + (b.service_price || 0), 0);
  const cyclePosition = completedCount % LOYALTY_GOAL;
  const cyclesCompleted = Math.floor(completedCount / LOYALTY_GOAL);
  const visitsToFree = cyclePosition === 0 && completedCount > 0 ? 0 : LOYALTY_GOAL - cyclePosition;

  return (
    <PageLayout>
      <div className="min-h-screen pt-28 pb-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between mb-10 flex-wrap gap-4"
          >
            <div>
              <span className="text-gold text-xs tracking-[0.4em] uppercase">Konto klienta</span>
              <h1 className="font-display text-4xl lg:text-5xl mt-2 text-foreground">
                Witaj, {user?.full_name?.split(' ')[0] || 'Kliencie'}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">{user?.email}</p>
            </div>
            <div className="flex items-center gap-4 mt-2">
              {user?.email === 'irena@wesolymasaz.pl' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-sm text-gold hover:text-gold/80 transition-colors"
                >
                  <LayoutDashboard size={14} />
                  Panel admina
                </Link>
              )}
              <button
                onClick={() => logout()}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={14} />
                Wyloguj
              </button>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex border-b border-border mb-10 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs tracking-[0.2em] uppercase whitespace-nowrap transition-colors border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? 'border-gold text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon size={13} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {loadingData ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-border border-t-gold rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Stats grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[
                      { label: 'Wizyty łącznie', value: completedCount, unit: '' },
                      { label: 'Do darmowej', value: visitsToFree === 0 ? '🎁' : visitsToFree, unit: '' },
                      { label: 'Darmowe wizyty', value: cyclesCompleted, unit: '' },
                      { label: 'Aktywne vouchery', value: vouchers.filter(v => v.status === 'active').length, unit: '' },
                    ].map((stat, i) => (
                      <div key={i} className="border border-border p-5 text-center">
                        <div className="font-mono text-3xl font-medium text-gold mb-1">{stat.value}</div>
                        <div className="text-xs text-muted-foreground tracking-widest uppercase">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Loyalty mini card */}
                  {visitsToFree === 0 ? (
                    <div className="border-2 border-gold bg-gold/5 p-6 mb-8 text-center">
                      <div className="text-4xl mb-2">🎁</div>
                      <div className="font-display text-xl text-gold mb-1">Masz darmową wizytę!</div>
                      <p className="text-muted-foreground text-sm mb-4">Skontaktuj się z nami, aby umówić bezpłatny masaż.</p>
                      <a
                        href="https://wa.me/48787907141?text=Cześć!%20Mam%20darmową%20wizytę%20z%20programu%20lojalnościowego."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm tracking-widest uppercase text-white"
                        style={{ backgroundColor: '#25D366' }}
                      >
                        Zarezerwuj przez WhatsApp
                      </a>
                    </div>
                  ) : (
                    <div className="border border-border p-6 mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground">Program lojalnościowy</span>
                        <span className="text-xs text-muted-foreground">{cyclePosition} / {LOYALTY_GOAL} wizyt</span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden mb-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(cyclePosition / LOYALTY_GOAL) * 100}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gold rounded-full"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Jeszcze <span className="text-gold font-medium">{visitsToFree}</span> {visitsToFree === 1 ? 'wizyta' : 'wizyty'} do darmowego masażu.
                      </p>
                    </div>
                  )}

                  {/* Client Card */}
                  <ClientCard user={user} completedCount={completedCount} cyclesCompleted={cyclesCompleted} />

                  {/* Quick links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link to="/rezerwacja" className="flex items-center justify-between border border-border p-4 hover:border-gold hover:text-gold transition-colors group">
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-gold" />
                        <span className="text-sm tracking-wider uppercase">Nowa rezerwacja</span>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground group-hover:text-gold transition-colors" />
                    </Link>
                    <Link to="/vouchery" className="flex items-center justify-between border border-border p-4 hover:border-gold hover:text-gold transition-colors group">
                      <div className="flex items-center gap-3">
                        <Gift size={16} className="text-gold" />
                        <span className="text-sm tracking-wider uppercase">Kup voucher</span>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground group-hover:text-gold transition-colors" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* VISITS */}
              {activeTab === 'visits' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {bookings.length === 0 ? (
                    <div className="text-center py-20 border border-border">
                      <Calendar size={32} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">Brak wizyt do wyświetlenia.</p>
                      <Link to="/rezerwacja" className="text-gold text-sm tracking-widest uppercase hover:underline">
                        Zarezerwuj pierwszą wizytę →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {bookings.map((b) => (
                        <div key={b.id} className="flex items-center justify-between border border-border px-5 py-4 gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground text-sm">{b.service_name}</div>
                            <div className="text-muted-foreground text-xs mt-0.5">
                              {b.booking_date} · {b.booking_time} · {b.booking_type === 'home' ? 'Dojazd' : 'Salon'}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="font-mono text-gold text-sm">{b.service_price} zł</span>
                            <span className={`text-xs tracking-widest uppercase px-2 py-1 border ${
                              b.status === 'completed' ? 'border-green-500/30 text-green-500' :
                              b.status === 'confirmed' ? 'border-gold/30 text-gold' :
                              b.status === 'cancelled' ? 'border-destructive/30 text-destructive' :
                              'border-border text-muted-foreground'
                            }`}>
                              {b.status === 'completed' ? 'Zakończona' :
                               b.status === 'confirmed' ? 'Potwierdzona' :
                               b.status === 'cancelled' ? 'Anulowana' : 'Oczekuje'}
                            </span>
                            {(b.status === 'confirmed' || b.status === 'pending') && (
                              <button
                                onClick={() => cancelBooking(b.id)}
                                className="w-7 h-7 flex items-center justify-center border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                                title="Anuluj wizytę"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* LOYALTY */}
              {activeTab === 'loyalty' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {visitsToFree === 0 && (
                    <div className="border-2 border-gold bg-gold/5 p-6 text-center mb-8">
                      <div className="text-4xl mb-2">🎁</div>
                      <div className="font-display text-2xl text-gold mb-2">Darmowy masaż czeka!</div>
                      <p className="text-muted-foreground text-sm mb-4">Masz prawo do bezpłatnej wizyty.</p>
                      <a
                        href="https://wa.me/48787907141?text=Cześć!%20Mam%20darmową%20wizytę%20z%20programu%20lojalnościowego."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 text-sm tracking-widest uppercase text-white"
                        style={{ backgroundColor: '#25D366' }}
                      >
                        Zarezerwuj przez WhatsApp
                      </a>
                    </div>
                  )}

                  {/* Stamp card */}
                  <div className="border border-border p-6 mb-8">
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground">Bieżący cykl</span>
                      <span className="text-xs text-muted-foreground">{cyclePosition} / {LOYALTY_GOAL}</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden mb-6">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(cyclePosition / LOYALTY_GOAL) * 100}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="h-full bg-gold rounded-full"
                      />
                    </div>
                    <div className="flex justify-between gap-2">
                      {Array.from({ length: LOYALTY_GOAL }, (_, i) => i + 1).map((n) => {
                        const filled = n <= cyclePosition;
                        return (
                          <motion.div
                            key={n}
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.08 * n, type: 'spring', stiffness: 300 }}
                            className="flex-1 flex items-center justify-center"
                          >
                            <div
                              className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-mono transition-all duration-300"
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
                      {/* Gift stamp */}
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.08 * (LOYALTY_GOAL + 1), type: 'spring', stiffness: 300 }}
                        className="flex-1 flex items-center justify-center"
                      >
                        <div
                          className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                          style={{
                            borderColor: visitsToFree === 0 ? '#C9A96E' : 'hsl(var(--border))',
                            backgroundColor: visitsToFree === 0 ? '#C9A96E' : 'transparent',
                          }}
                        >
                          <Gift size={18} style={{ color: visitsToFree === 0 ? '#0A0A0A' : 'hsl(var(--muted-foreground))' }} />
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="border border-border p-5 text-center">
                      <div className="font-mono text-3xl text-gold mb-1">{completedCount}</div>
                      <div className="text-xs text-muted-foreground tracking-widest uppercase">Wizyt łącznie</div>
                    </div>
                    <div className="border border-border p-5 text-center">
                      <div className="font-mono text-2xl text-gold mb-1">{totalSpend} zł</div>
                      <div className="text-xs text-muted-foreground tracking-widest uppercase">Łączna wartość</div>
                    </div>
                    <div className="border border-border p-5 text-center">
                      <div className="font-mono text-3xl text-gold mb-1">{cyclesCompleted}</div>
                      <div className="text-xs text-muted-foreground tracking-widest uppercase">Darmowe wizyty</div>
                    </div>
                  </div>

                  {/* Progi lojalnościowe */}
                  <LoyaltyTiers completedCount={completedCount} totalSpend={totalSpend} />
                </motion.div>
              )}

              {/* PACKAGES */}
              {activeTab === 'packages' && (
                <PackagesTab packages={packages} />
              )}

              {/* REFERRAL */}
              {activeTab === 'referral' && (
                <ReferralSection user={user} />
              )}

              {/* VOUCHERS */}
              {activeTab === 'vouchers' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {vouchers.length === 0 ? (
                    <div className="text-center py-20 border border-border">
                      <Tag size={32} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">Nie masz jeszcze żadnych voucherów.</p>
                      <Link to="/vouchery" className="text-gold text-sm tracking-widest uppercase hover:underline">
                        Kup voucher prezentowy →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {vouchers.map((v) => (
                        <div key={v.id} className={`border p-5 flex items-center justify-between gap-4 ${v.status === 'active' ? 'border-gold/40 bg-gold/5' : 'border-border'}`}>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-sm font-medium tracking-widest text-foreground">{v.voucher_code}</span>
                              <span className={`text-xs px-2 py-0.5 border ${
                                v.status === 'active' ? 'border-gold/40 text-gold' :
                                v.status === 'used' ? 'border-green-500/30 text-green-500' :
                                'border-border text-muted-foreground'
                              }`}>
                                {v.status === 'active' ? 'Aktywny' : v.status === 'used' ? 'Wykorzystany' : 'Wygasły'}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {v.type === 'service' ? v.service_name : `Wartość: ${v.value} zł`}
                              {v.recipient_name && ` · Dla: ${v.recipient_name}`}
                              {v.expires_at && ` · Ważny do: ${v.expires_at}`}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-mono text-xl text-gold font-medium">{v.value} zł</div>
                          </div>
                        </div>
                      ))}
                      <div className="mt-4">
                        <Link to="/vouchery" className="text-sm text-muted-foreground hover:text-gold transition-colors tracking-widest uppercase">
                          + Kup nowy voucher
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}