import { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { X, Loader2 } from 'lucide-react';

export default function PackageBuyModal({ template, onClose }) {
  const [form, setForm] = useState({ ownerName: '', ownerEmail: '', ownerPhone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totalVisits = template.visits_count + (template.bonus_visits || 0);

  const handleBuy = async () => {
    if (!form.ownerName || !form.ownerEmail) {
      setError('Podaj imię i adres e-mail.');
      return;
    }

    if (window.self !== window.top) {
      setError('Płatność online działa tylko z opublikowanej wersji aplikacji — otwórz stronę w nowej karcie.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await base44.functions.invoke('createPackageCheckout', {
        templateName: template.name,
        visitsCount: template.visits_count,
        bonusVisits: template.bonus_visits || 0,
        price: template.price,
        serviceName: template.service_name || '',
        ownerName: form.ownerName,
        ownerEmail: form.ownerEmail,
        ownerPhone: form.ownerPhone,
      });

      if (response.data.error) {
        setError(response.data.error);
        setSubmitting(false);
        return;
      }

      const stripe = window.Stripe(response.data.publishableKey);
      const result = await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
      if (result.error) setError(result.error.message);
    } catch (err) {
      setError('Błąd przy przygotowaniu płatności.');
    }

    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background border border-border w-full max-w-md relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>

        <div className="p-8">
          <span className="text-gold text-xs tracking-[0.3em] uppercase">Zakup karnetu</span>
          <h2 className="font-display text-2xl mt-2 mb-1 text-foreground">{template.name}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {totalVisits} wizyt · {template.price} zł
            {template.bonus_visits > 0 && ` (w tym ${template.bonus_visits} gratis)`}
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">Imię i nazwisko *</label>
              <input
                type="text"
                value={form.ownerName}
                onChange={e => setForm(p => ({ ...p, ownerName: e.target.value }))}
                className="w-full border-b border-border bg-transparent py-3 text-foreground focus:outline-none focus:border-gold transition-colors"
                placeholder="Jan Kowalski"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">Adres e-mail *</label>
              <input
                type="email"
                value={form.ownerEmail}
                onChange={e => setForm(p => ({ ...p, ownerEmail: e.target.value }))}
                className="w-full border-b border-border bg-transparent py-3 text-foreground focus:outline-none focus:border-gold transition-colors"
                placeholder="jan@example.com"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">Telefon (opcjonalnie)</label>
              <input
                type="tel"
                value={form.ownerPhone}
                onChange={e => setForm(p => ({ ...p, ownerPhone: e.target.value }))}
                className="w-full border-b border-border bg-transparent py-3 text-foreground focus:outline-none focus:border-gold transition-colors"
                placeholder="+48 000 000 000"
              />
            </div>
          </div>

          {error && (
            <div className="border border-destructive bg-destructive/10 text-destructive p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleBuy}
            disabled={submitting}
            className="w-full py-4 text-sm tracking-widest uppercase bg-gold text-obsidian hover:bg-gold-light transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? 'Przygotowuję płatność...' : `Zapłać ${template.price} zł`}
          </button>
        </div>
      </motion.div>
    </div>
  );
}