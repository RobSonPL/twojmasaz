import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

// Cache module-level so all instances share the same result
let cachedSlot = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const DAY_NAMES = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
const MONTH_NAMES = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const dayName = DAY_NAMES[d.getDay()];
  const day = d.getDate();
  const month = MONTH_NAMES[d.getMonth()];
  return { dayName, day, month };
}

async function findNearestSlot() {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  // Fetch blocked slots and bookings for next 14 days
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 14);

  const startDateStr = today.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  let blockedSlots = [];
  let bookings = [];

  try {
    blockedSlots = await base44.entities.BlockedSlot.filter({ date_gte: startDateStr, date_lte: endDateStr });
  } catch {}

  try {
    const allBookings = await base44.entities.Booking.filter({
      booking_date_gte: startDateStr,
      booking_date_lte: endDateStr
    });
    bookings = allBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  } catch {}

  // Build taken map: { "2026-08-25": Set(["09:00", "14:00"]) }
  const takenMap = {};

  blockedSlots.forEach(bs => {
    if (!bs.date) return;
    if (!takenMap[bs.date]) takenMap[bs.date] = new Set();
    if (bs.is_full_day) {
      TIME_SLOTS.forEach(s => takenMap[bs.date].add(s));
    } else if (bs.time_from && bs.time_to) {
      const fromH = parseInt(bs.time_from.split(':')[0]);
      const toH = parseInt(bs.time_to.split(':')[0]);
      TIME_SLOTS.forEach(s => {
        const h = parseInt(s.split(':')[0]);
        if (h >= fromH && h < toH) takenMap[bs.date].add(s);
      });
    }
  });

  bookings.forEach(b => {
    if (!b.booking_date) return;
    if (!takenMap[b.booking_date]) takenMap[b.booking_date] = new Set();
    if (b.booking_time) takenMap[b.booking_date].add(b.booking_time);
  });

  // Scan days from tomorrow to +14
  for (let i = 1; i <= 14; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() + i);
    const dateStr = checkDate.toISOString().split('T')[0];
    const dayOfWeek = checkDate.getDay();

    // Skip Sundays (0) — salon closed
    if (dayOfWeek === 0) continue;

    const taken = takenMap[dateStr] || new Set();

    for (const slot of TIME_SLOTS) {
      if (!taken.has(slot)) {
        const { dayName, day, month } = formatDate(dateStr);
        return { dateStr, time: slot, dayName, day, month };
      }
    }
  }

  return null;
}

export function useLiveAvailability() {
  const [slot, setSlot] = useState(cachedSlot);
  const [loading, setLoading] = useState(!cachedSlot);

  const refresh = useCallback(async () => {
    const now = Date.now();
    if (cachedSlot && now - cacheTimestamp < CACHE_TTL) {
      setSlot(cachedSlot);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await findNearestSlot();
      cachedSlot = result;
      cacheTimestamp = Date.now();
      setSlot(result);
    } catch {
      setSlot(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { slot, loading, refresh };
}

// Compact widget for Navbar
export function NavbarAvailability() {
  const { slot, loading } = useLiveAvailability();

  if (loading) {
    return (
      <span className="hidden lg:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
        <span className="tracking-wider">Sprawdzam terminy…</span>
      </span>
    );
  }

  if (!slot) {
    return (
      <span className="hidden lg:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <span className="tracking-wider">Terminy na zapytanie</span>
      </span>
    );
  }

  return (
    <Link
      to="/rezerwacja"
      className="hidden lg:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors group"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      <span className="tracking-wider">
        Najbliższy termin:{' '}
        <span className="font-mono text-foreground group-hover:text-gold transition-colors">
          {slot.dayName} {slot.day} {slot.month}, {slot.time}
        </span>
      </span>
    </Link>
  );
}

// Extended widget for Hero
export default function LiveAvailability() {
  const { slot, loading } = useLiveAvailability();

  if (loading) {
    return (
      <div className="mt-4 p-6 border border-border bg-secondary/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
          <span className="text-muted-foreground text-xs tracking-widest uppercase">Sprawdzam dostępność…</span>
        </div>
        <div className="h-4 w-48 bg-secondary animate-pulse rounded" />
      </div>
    );
  }

  if (!slot) {
    return (
      <div className="mt-4 p-6 border border-border bg-secondary/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-muted-foreground text-xs tracking-widest uppercase">Dostępność</span>
        </div>
        <p className="text-foreground/70 text-sm">Terminy na zapytanie — zadzwoń lub napisz, aby umówić wizytę.</p>
      </div>
    );
  }

  return (
    <Link
      to="/rezerwacja"
      className="mt-4 p-6 border border-border bg-secondary/30 hover:border-gold/40 transition-all duration-300 group block"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-muted-foreground text-xs tracking-widest uppercase">Najbliższy wolny termin</span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-2xl text-foreground font-medium group-hover:text-gold transition-colors">
          {slot.dayName}
        </span>
        <span className="font-mono text-2xl text-foreground font-medium group-hover:text-gold transition-colors">
          {slot.day} {slot.month}
        </span>
        <span className="font-mono text-xl text-gold">· {slot.time}</span>
      </div>
      <p className="text-foreground/50 text-xs mt-2 tracking-wide">Kliknij, aby zarezerwować ten termin →</p>
    </Link>
  );
}