import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { pl } from 'date-fns/locale';

const GOLD = '#C9A96E';

export default function AdminStats() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Booking.list('-booking_date', 500).then(data => {
      setBookings(data.filter(b => b.status !== 'cancelled'));
      setLoading(false);
    });
  }, []);

  // Revenue by month (last 6 months)
  const revenueByMonth = Array.from({ length: 6 }).map((_, i) => {
    const month = subMonths(new Date(), 5 - i);
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const monthBookings = bookings.filter(b => {
      if (!b.booking_date) return false;
      const d = parseISO(b.booking_date);
      return d >= start && d <= end;
    });
    return {
      name: format(month, 'MMM', { locale: pl }),
      przychód: monthBookings.reduce((sum, b) => sum + (b.service_price || 0), 0),
      rezerwacje: monthBookings.length,
    };
  });

  // Services distribution
  const serviceMap = {};
  bookings.forEach(b => {
    if (b.service_name) {
      serviceMap[b.service_name] = (serviceMap[b.service_name] || 0) + 1;
    }
  });
  const servicesData = Object.entries(serviceMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, count]) => ({ name: name.replace('Masaż ', ''), count }));

  const totalRevenue = bookings.reduce((s, b) => s + (b.service_price || 0), 0);
  const homeBookings = bookings.filter(b => b.booking_type === 'home').length;
  const studioBookings = bookings.filter(b => b.booking_type === 'studio').length;

  return (
    <AdminLayout>
      <div className="text-bone">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-bone">Statystyki</h1>
          <p className="text-bone/40 text-sm mt-1">Przegląd działalności</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-bone/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Łączne rezerwacje', value: bookings.length },
                { label: 'Przychód łączny', value: `${totalRevenue.toLocaleString()} PLN` },
                { label: 'Dojazdy', value: homeBookings },
                { label: 'Salon', value: studioBookings },
              ].map(stat => (
                <div key={stat.label} className="border border-white/5 bg-white/[0.02] p-5">
                  <div className="text-bone/40 text-xs tracking-widest uppercase">{stat.label}</div>
                  <div className="font-mono text-2xl text-gold mt-2">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue chart */}
              <div className="border border-white/5 bg-white/[0.02] p-6">
                <h3 className="text-bone/40 text-xs tracking-widest uppercase mb-6">Przychód — ostatnie 6 miesięcy</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={revenueByMonth}>
                    <XAxis dataKey="name" tick={{ fill: 'rgba(250,250,250,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(250,250,250,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#111', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 0 }}
                      labelStyle={{ color: GOLD }}
                      itemStyle={{ color: 'rgba(250,250,250,0.7)' }}
                    />
                    <Bar dataKey="przychód" fill={GOLD} radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Popular services */}
              <div className="border border-white/5 bg-white/[0.02] p-6">
                <h3 className="text-bone/40 text-xs tracking-widest uppercase mb-6">Popularne usługi</h3>
                {servicesData.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-bone/20 text-sm">Brak danych</div>
                ) : (
                  <div className="space-y-3">
                    {servicesData.map((s, i) => (
                      <div key={s.name} className="flex items-center gap-4">
                        <span className="font-mono text-xs text-gold/40 w-4">{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-bone/70 text-sm">{s.name}</span>
                            <span className="font-mono text-xs text-gold">{s.count}</span>
                          </div>
                          <div className="h-px bg-white/5 relative">
                            <div
                              className="absolute top-0 left-0 h-full bg-gold/50"
                              style={{ width: `${(s.count / servicesData[0].count) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}