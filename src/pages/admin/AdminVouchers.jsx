import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

const STATUS_COLORS = {
  active: 'text-green-400',
  used: 'text-bone/30',
  expired: 'text-red-400',
};
const STATUS_LABELS = { active: 'Aktywny', used: 'Wykorzystany', expired: 'Wygasły' };

export default function AdminVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Voucher.list('-created_date', 100).then(data => {
      setVouchers(data);
      setLoading(false);
    });
  }, []);

  const markUsed = async (id) => {
    await base44.entities.Voucher.update(id, { status: 'used', used_at: format(new Date(), 'yyyy-MM-dd') });
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, status: 'used' } : v));
  };

  return (
    <AdminLayout>
      <div className="text-bone">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-bone">Vouchery</h1>
          <p className="text-bone/40 text-sm mt-1">Zarządzaj sprzedanymi voucherami</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-bone/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : vouchers.length === 0 ? (
          <div className="border border-white/5 p-12 text-center text-bone/20 text-sm">Brak voucherów</div>
        ) : (
          <div className="space-y-2">
            {vouchers.map(v => (
              <div key={v.id} className="border border-white/5 bg-white/[0.02] p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm text-gold">{v.voucher_code || '—'}</span>
                    <span className={`text-xs font-mono ${STATUS_COLORS[v.status]}`}>{STATUS_LABELS[v.status]}</span>
                  </div>
                  <div className="text-bone text-sm font-medium">Dla: {v.recipient_name || '—'}</div>
                  <div className="text-bone/40 text-xs font-mono mt-1">
                    {v.value} PLN · Kupił: {v.buyer_name} ({v.buyer_email})
                    {v.expires_at && ` · Ważny do: ${format(parseISO(v.expires_at), 'd MMM yyyy', { locale: pl })}`}
                  </div>
                  {v.dedication && <div className="text-bone/30 text-xs mt-1 italic">„{v.dedication}"</div>}
                </div>
                <div className="flex-shrink-0">
                  {v.status === 'active' && (
                    <button
                      onClick={() => markUsed(v.id)}
                      className="border border-gold/30 text-gold px-4 py-2 text-xs tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all"
                    >
                      Oznacz jako zużyty
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}