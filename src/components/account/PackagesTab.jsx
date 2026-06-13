import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

export default function PackagesTab({ packages }) {
  const active = packages.filter(p => p.status === 'active' && p.payment_status === 'paid');
  const past = packages.filter(p => p.status !== 'active' || p.payment_status !== 'paid');

  if (packages.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center py-20 border border-border">
          <Package size={32} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Nie masz jeszcze żadnych karnetów.</p>
          <Link to="/pakiety" className="text-gold text-sm tracking-widest uppercase hover:underline">
            Zobacz dostępne pakiety →
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {active.length > 0 && (
        <div>
          <div className="text-xs tracking-widest uppercase text-muted-foreground mb-4">Aktywne karnety</div>
          <div className="space-y-3">
            {active.map(p => {
              const used = p.total_visits - p.remaining_visits;
              const pct = (used / p.total_visits) * 100;
              return (
                <div key={p.id} className="border border-gold/40 bg-gold/5 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium text-foreground">{p.name}</div>
                      {p.service_name && <div className="text-xs text-muted-foreground mt-0.5">{p.service_name}</div>}
                    </div>
                    <div className="font-mono text-gold text-lg">{p.remaining_visits} / {p.total_visits}</div>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{used} wykorzystanych</span>
                    <span>{p.remaining_visits} pozostało</span>
                  </div>
                  {p.expires_at && (
                    <div className="text-xs text-muted-foreground mt-2">Ważny do: {p.expires_at}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <div className="text-xs tracking-widest uppercase text-muted-foreground mb-4">Poprzednie karnety</div>
          <div className="space-y-2">
            {past.map(p => (
              <div key={p.id} className="border border-border p-4 flex justify-between items-center opacity-60">
                <div>
                  <div className="text-sm text-foreground">{p.name}</div>
                  {p.expires_at && <div className="text-xs text-muted-foreground">Ważny do: {p.expires_at}</div>}
                </div>
                <span className="text-xs border border-border px-2 py-1 text-muted-foreground">
                  {p.status === 'used' ? 'Wykorzystany' : p.status === 'expired' ? 'Wygasły' : 'Oczekuje'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Link to="/pakiety" className="inline-block text-sm text-muted-foreground hover:text-gold transition-colors tracking-widest uppercase">
        + Kup nowy karnet
      </Link>
    </motion.div>
  );
}