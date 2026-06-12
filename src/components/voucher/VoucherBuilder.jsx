import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Gift, Check, Loader2, ChevronLeft } from 'lucide-react';
import { addMonths, format } from 'date-fns';

const VOUCHER_PACKAGES = [
  { id: 'v1', type: 'value', value: 150, label: '150 PLN', description: 'Na dowolną usługę' },
  { id: 'v2', type: 'value', value: 250, label: '250 PLN', description: 'Idealny na urodziny' },
  { id: 'v3', type: 'value', value: 400, label: '400 PLN', description: 'Pakiet premium' },
  { id: 'v4', type: 'service', value: 200, label: 'Masaż Relaksacyjny 90min', description: '200 PLN · Najpopularniejszy' },
  { id: 'v5', type: 'service', value: 250, label: 'Gorące Kamienie 90min', description: '250 PLN · Wyjątkowe doznanie' },
];

function generateVoucherCode() {
  return 'WM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function VoucherPreview({ data }) {
  return (
    <div className="relative bg-obsidian border border-gold/20 p-10 aspect-[3/2] flex flex-col justify-between overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)`,
          backgroundSize: '8px 8px'
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 border border-gold flex items-center justify-center">
            <span className="font-display text-xs text-gold">WM</span>
          </div>
          <span className="font-display text-xs tracking-[0.3em] uppercase text-bone/40">Wesoły Masaż</span>
        </div>
        <div className="font-display text-2xl text-bone italic leading-tight">
          {data.dedication ? `„${data.dedication}"` : 'Twoja chwila wytchnienia'}
        </div>
      </div>
      <div className="relative flex items-end justify-between">
        <div>
          <div className="text-gold text-xs tracking-widest uppercase mb-1">Voucher prezentowy dla</div>
          <div className="font-display text-xl text-bone">{data.recipient_name || 'Odbiorca'}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-3xl text-gold">{data.value} PLN</div>
          <div className="text-bone/30 text-xs mt-1 tracking-wider">WARTOŚĆ</div>
        </div>
      </div>
    </div>
  );
}

export default function VoucherBuilder() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    type: 'value',
    value: 0,
    label: '',
    buyer_name: '',
    buyer_email: '',
    recipient_name: '',
    dedication: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  const update = (d) => setData(prev => ({ ...prev, ...d }));

  const handleSubmit = async () => {
    setSubmitting(true);
    const code = generateVoucherCode();
    setVoucherCode(code);
    const expiresAt = format(addMonths(new Date(), 12), 'yyyy-MM-dd');
    await base44.entities.Voucher.create({
      ...data,
      voucher_code: code,
      expires_at: expiresAt,
      payment_status: 'pending',
      status: 'active',
    });
    // Send voucher email
    await base44.integrations.Core.SendEmail({
      to: data.buyer_email,
      subject: `Voucher prezentowy Wesoły Masaż — ${code}`,
      body: `Cześć ${data.buyer_name}!\n\nTwój voucher prezentowy jest gotowy.\n\nKod: ${code}\nWartość: ${data.value} PLN\nDla: ${data.recipient_name}\nWażny do: ${expiresAt}\n\nVoucher można wykorzystać przy rezerwacji online lub telefonicznie.\n\nWesoły Masaż`
    });
    setSubmitting(false);
    setDone(true);
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 border border-gold mx-auto flex items-center justify-center mb-8">
          <Gift size={32} className="text-gold" />
        </div>
        <h2 className="font-display text-3xl text-obsidian mb-4">Voucher gotowy!</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Szczegóły i kod vouchera zostały wysłane na <strong>{data.buyer_email}</strong>.
        </p>
        <div className="border border-gold/20 bg-gold/5 p-6 max-w-xs mx-auto mb-8">
          <div className="text-xs text-muted-foreground tracking-widest uppercase mb-3">Kod vouchera</div>
          <div className="font-mono text-2xl font-medium text-gold">{voucherCode}</div>
          <div className="text-xs text-muted-foreground mt-2">{data.value} PLN · Ważny 12 miesięcy</div>
        </div>
        <a href="/" className="text-sm text-muted-foreground hover:text-gold transition-colors tracking-widest uppercase">
          Wróć na stronę główną
        </a>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      {/* Form */}
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <div>
                <h2 className="font-display text-3xl text-obsidian mb-2">Wybierz pakiet</h2>
                <p className="text-muted-foreground mb-8">Voucher na kwotę lub konkretną usługę.</p>
                <div className="space-y-3 mb-8">
                  {VOUCHER_PACKAGES.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => update({ type: pkg.type, value: pkg.value, label: pkg.label })}
                      className={`w-full text-left border p-5 transition-all duration-200 focus-gold min-h-[48px] ${
                        data.value === pkg.value && data.label === pkg.label
                          ? 'border-gold bg-gold/5'
                          : 'border-border hover:border-obsidian'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{pkg.label}</div>
                          <div className="text-sm text-muted-foreground">{pkg.description}</div>
                        </div>
                        <div className="font-mono font-medium text-gold">{pkg.value} PLN</div>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(1)}
                  disabled={!data.value}
                  className="bg-obsidian text-bone px-10 py-4 text-sm tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all duration-300 disabled:opacity-40 min-h-[48px] focus-gold"
                >
                  Dalej — personalizacja
                </button>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="font-display text-3xl text-obsidian mb-2">Personalizacja</h2>
                <p className="text-muted-foreground mb-8">Spersonalizuj voucher dla obdarowanej osoby.</p>
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">Imię obdarowanego *</label>
                    <input
                      type="text"
                      value={data.recipient_name}
                      onChange={e => update({ recipient_name: e.target.value })}
                      className="w-full border-b border-border bg-transparent py-3 text-obsidian focus:outline-none focus:border-gold transition-colors text-base"
                      placeholder="np. Marta"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">Dedykacja (opcjonalnie)</label>
                    <textarea
                      rows={3}
                      value={data.dedication}
                      onChange={e => update({ dedication: e.target.value })}
                      className="w-full border-b border-border bg-transparent py-3 text-obsidian focus:outline-none focus:border-gold transition-colors text-base resize-none"
                      placeholder="np. Zasługujesz na chwilę tylko dla siebie..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">Twoje imię i nazwisko *</label>
                    <input
                      type="text"
                      value={data.buyer_name}
                      onChange={e => update({ buyer_name: e.target.value })}
                      className="w-full border-b border-border bg-transparent py-3 text-obsidian focus:outline-none focus:border-gold transition-colors text-base"
                      placeholder="Jan Kowalski"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">Twój e-mail *</label>
                    <input
                      type="email"
                      value={data.buyer_email}
                      onChange={e => update({ buyer_email: e.target.value })}
                      className="w-full border-b border-border bg-transparent py-3 text-obsidian focus:outline-none focus:border-gold transition-colors text-base"
                      placeholder="jan@example.com"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(0)} className="flex items-center gap-2 text-muted-foreground hover:text-obsidian transition-colors text-sm tracking-widest uppercase min-h-[48px]">
                    <ChevronLeft size={16} /> Wróć
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !data.recipient_name || !data.buyer_name || !data.buyer_email}
                    className="flex items-center gap-3 bg-gold text-obsidian px-10 py-4 text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300 disabled:opacity-40 min-h-[48px] focus-gold"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    Zamów voucher
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Live Preview */}
      <div className="lg:sticky lg:top-28">
        <div className="text-xs text-muted-foreground tracking-widest uppercase mb-4">Podgląd na żywo</div>
        <motion.div
          animate={{ scale: data.dedication ? 1.01 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <VoucherPreview data={data} />
        </motion.div>
        <div className="mt-4 text-xs text-muted-foreground">
          Kod vouchera zostanie wygenerowany po zamówieniu i wysłany na podany e-mail.
        </div>
      </div>
    </div>
  );
}