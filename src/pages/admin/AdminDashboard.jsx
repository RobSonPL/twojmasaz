import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import { format, startOfToday, addDays, parseISO, isSameDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Plus, X, Check, Clock, User, MapPin, Phone, Mail } from 'lucide-react';

const STATUS_COLORS = {
  confirmed: 'text-green-400',
  pending: 'text-yellow-400',
  cancelled: 'text-red-400',
  completed: 'text-blue-400',
};

const STATUS_LABELS = {
  confirmed: 'Potwierdzona',
  pending: 'Oczekująca',
  cancelled: 'Anulowana',
  completed: 'Zakończona',
};

function BookingCard({ booking, onStatusChange }) {
  return (
    <div className="border border-white/5 bg-white/[0.02] p-5 hover:border-gold/20 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-medium text-bone">{booking.client_name}</div>
          <div className="text-gold text-sm font-mono mt-0.5">{booking.booking_time}</div>
        </div>
        <span className={`text-xs font-mono ${STATUS_COLORS[booking.status]}`}>
          {STATUS_LABELS[booking.status]}
        </span>
      </div>
      <div className="text-sm text-bone/50 space-y-1 mb-4">
        <div className="flex items-center gap-2">
          <Clock size={12} /> {booking.service_name} · {booking.service_duration} min
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={12} /> {booking.booking_type === 'home' ? `🏠 ${booking.address || 'Dojazd'}` : '🏢 Salon'}
        </div>
        <div className="flex items-center gap-2">
          <Phone size={12} /> {booking.client_phone}
        </div>
      </div>
      <div className="flex gap-2">
        {booking.status === 'confirmed' && (
          <button
            onClick={() => onStatusChange(booking.id, 'completed')}
            className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 border border-green-400/20 hover:border-green-400/50 px-3 py-1.5 transition-all"
          >
            <Check size={12} /> Zakończona
          </button>
        )}
        {booking.status !== 'cancelled' && (
          <button
            onClick={() => onStatusChange(booking.id, 'cancelled')}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-400/50 px-3 py-1.5 transition-all"
          >
            <X size={12} /> Anuluj
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [loading, setLoading] = useState(true);
  const [blockForm, setBlockForm] = useState({ show: false, date: '', time_from: '', time_to: '', reason: '', is_full_day: false });

  const today = startOfToday();
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [bk, bs] = await Promise.all([
      base44.entities.Booking.list('-booking_date', 200),
      base44.entities.BlockedSlot.list('-date', 100),
    ]);
    setBookings(bk);
    setBlockedSlots(bs);
    setLoading(false);
  };

  const dayBookings = bookings.filter(b =>
    b.booking_date === format(selectedDate, 'yyyy-MM-dd') && b.status !== 'cancelled'
  );

  const todayBookings = bookings.filter(b =>
    b.booking_date === format(today, 'yyyy-MM-dd') && b.status === 'confirmed'
  );

  const handleStatusChange = async (id, status) => {
    await base44.entities.Booking.update(id, { status });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleBlockSlot = async () => {
    await base44.entities.BlockedSlot.create({
      date: blockForm.date,
      time_from: blockForm.is_full_day ? null : blockForm.time_from,
      time_to: blockForm.is_full_day ? null : blockForm.time_to,
      reason: blockForm.reason,
      is_full_day: blockForm.is_full_day,
    });
    setBlockForm({ show: false, date: '', time_from: '', time_to: '', reason: '', is_full_day: false });
    loadData();
  };

  const getBookingCount = (date) =>
    bookings.filter(b => b.booking_date === format(date, 'yyyy-MM-dd') && b.status === 'confirmed').length;

  return (
    <AdminLayout>
      <div className="text-bone">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Dziś', value: todayBookings.length, sub: 'rezerwacji' },
            { label: 'Ten tydzień', value: bookings.filter(b => {
              const d = parseISO(b.booking_date || '2000-01-01');
              const w = addDays(today, 7);
              return d >= today && d <= w && b.status === 'confirmed';
            }).length, sub: 'potwierdzone' },
            { label: 'Łącznie', value: bookings.filter(b => b.status !== 'cancelled').length, sub: 'rezerwacji' },
            { label: 'Nowe wiadomości', value: '—', sub: 'sprawdź' },
          ].map((stat) => (
            <div key={stat.label} className="border border-white/5 bg-white/[0.02] p-5">
              <div className="text-bone/40 text-xs tracking-widest uppercase">{stat.label}</div>
              <div className="font-mono text-3xl text-bone mt-2">{stat.value}</div>
              <div className="text-bone/30 text-xs mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar strip */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-bone text-xs tracking-widest uppercase">Kalendarz</h2>
              <button
                onClick={() => setBlockForm(f => ({ ...f, show: true }))}
                className="flex items-center gap-1 text-xs text-gold border border-gold/30 hover:border-gold px-3 py-1.5 transition-all"
              >
                <Plus size={12} /> Zablokuj termin
              </button>
            </div>
            <div className="space-y-1">
              {days.map((day) => {
                const count = getBookingCount(day);
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, today);
                const isBlocked = blockedSlots.some(s => s.date === format(day, 'yyyy-MM-dd') && s.is_full_day);
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between transition-all duration-200 ${
                      isSelected ? 'bg-gold/10 border-l-2 border-gold' : 'border-l-2 border-transparent hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <span className={`text-sm font-medium ${isSelected ? 'text-gold' : isToday ? 'text-bone' : 'text-bone/50'}`}>
                        {format(day, 'EEEE', { locale: pl })}
                      </span>
                      <span className="text-bone/30 text-xs ml-2 font-mono">{format(day, 'd MMM', { locale: pl })}</span>
                      {isToday && <span className="ml-2 text-xs text-gold">dziś</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {isBlocked && <span className="text-xs text-red-400">zablok.</span>}
                      {count > 0 && (
                        <span className="w-5 h-5 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center font-mono">
                          {count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day bookings */}
          <div className="lg:col-span-2">
            <h2 className="text-bone text-xs tracking-widest uppercase mb-4">
              Rezerwacje — {format(selectedDate, 'd MMMM yyyy', { locale: pl })}
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-bone/20 border-t-gold rounded-full animate-spin" />
              </div>
            ) : dayBookings.length === 0 ? (
              <div className="border border-white/5 p-12 text-center">
                <div className="text-bone/20 text-sm">Brak rezerwacji na ten dzień</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dayBookings
                  .sort((a, b) => a.booking_time?.localeCompare(b.booking_time))
                  .map(booking => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Block slot modal */}
        {blockForm.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#111] border border-white/10 p-8 w-full max-w-md"
            >
              <h3 className="text-bone font-display text-xl mb-6">Zablokuj termin</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-bone/40 text-xs tracking-widest uppercase block mb-2">Data</label>
                  <input
                    type="date"
                    value={blockForm.date}
                    onChange={e => setBlockForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full bg-transparent border-b border-white/10 py-2 text-bone focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blockForm.is_full_day}
                    onChange={e => setBlockForm(f => ({ ...f, is_full_day: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-bone/60 text-sm">Cały dzień</span>
                </label>
                {!blockForm.is_full_day && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-bone/40 text-xs tracking-widest uppercase block mb-2">Od</label>
                      <input type="time" value={blockForm.time_from} onChange={e => setBlockForm(f => ({ ...f, time_from: e.target.value }))}
                        className="w-full bg-transparent border-b border-white/10 py-2 text-bone focus:outline-none focus:border-gold" />
                    </div>
                    <div>
                      <label className="text-bone/40 text-xs tracking-widest uppercase block mb-2">Do</label>
                      <input type="time" value={blockForm.time_to} onChange={e => setBlockForm(f => ({ ...f, time_to: e.target.value }))}
                        className="w-full bg-transparent border-b border-white/10 py-2 text-bone focus:outline-none focus:border-gold" />
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-bone/40 text-xs tracking-widest uppercase block mb-2">Powód (opcjonalnie)</label>
                  <input type="text" value={blockForm.reason} onChange={e => setBlockForm(f => ({ ...f, reason: e.target.value }))}
                    placeholder="np. urlop, przerwa..."
                    className="w-full bg-transparent border-b border-white/10 py-2 text-bone focus:outline-none focus:border-gold placeholder-bone/20" />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setBlockForm(f => ({ ...f, show: false }))}
                  className="flex-1 border border-white/10 text-bone/40 py-3 text-sm tracking-widest uppercase hover:border-white/20 transition-all">
                  Anuluj
                </button>
                <button onClick={handleBlockSlot} disabled={!blockForm.date}
                  className="flex-1 bg-gold text-obsidian py-3 text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-all disabled:opacity-40">
                  Zablokuj
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}