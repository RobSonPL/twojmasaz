import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Gift, Check, Loader2, ChevronLeft, MessageCircle } from 'lucide-react';
import { addMonths, format } from 'date-fns';

function generateVoucherCode() {
  return 'WM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function VoucherPreview({ data, code }) {
  return (
    <div className="relative bg-obsidian border border-gold/20 p-8 lg:p-10 aspect-[3/2] flex flex-col justify-between overflow-hidden">
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)`,
          backgroundSize: '8px 8px'
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 border border-gold flex items-center justify-center">
            <span className="font-display text-xs text-gold">WM</span>
          </div>
          <span className="font-display text-xs tracking-[0.3em] uppercase text-bone/40">Wesoły Masaż</span>
        </div>
        <div className="font-display text-xl lg:text-2xl text-bone italic leading-tight">
          {data.dedication ? `„${data.dedication}"` : 'Twoja chwila wytchnienia'}
        </div>
      </div>
      <div className="relative">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-gold text-xs tracking-widest uppercase mb-1">Voucher dla</div>
            <div className="font-display text-lg lg:text-xl text-bone">{data.recipient_name || 'Odbiorca'}</div>
          </div>
          <div className="text-right">
            {data.type === 'service' && data.service_label ? (
              <div className="font-display text-sm text-gold leading-tight max-w-[120px] text-right">{data.service_label}</div>
            ) : (
              <div className="font-mono text-3xl text-gold">{data.value || '—'} PLN</div>
            )}
          </div>
        </div>
        {code && (
          <div className="border-t border-white/10 pt-2 flex justify-between items-center">
            <span className="font-mono text-xs text-white/30 tracking-widest">{code}</span>
            {data.expires_at && <span className="text-white/20 text-xs">Ważny do: {data.expires_at}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

const STEPS = ['Rodzaj', 'Szczegóły', 'Odbiorca', 'Podsumowanie'];

export default function VoucherBuilder({ services = [] }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    type: 'value',         // 'value' | 'service'
    value: '',
    service_id: '',
    service_label: '',
    service_name: '',
    expires_months: 12,
    recipient_name: '',
    recipient_email: '',   // nowe — e-mail obdarowanego
    recipient_phone: '',   // nowe — WhatsApp obdarowanego
    buyer_name: '',
    buyer_email: '',
    dedication: '',
    send_whatsapp: true,
    send_email: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  const update = (d) => setData(prev => ({ ...prev, ...d }));

  const expiresDate = format(addMonths(new Date(), data.expires_months), 'yyyy-MM-dd');

  const handleCheckout = async () => {
    setSubmitting(true);
    setCheckoutError('');

    // Stripe Checkout nie działa w iframe (podgląd edytora)
    if (window.self !== window.top) {
      setCheckoutError('Płatność online działa tylko z opublikowanej wersji aplikacji. Otwórz aplikację w nowej karcie, aby dokończyć zakup.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await base44.functions.invoke('createVoucherCheckout', {
        voucherType: data.type,
        voucherValue: Number(data.value),
        serviceName: data.service_name || '',
        recipientName: data.recipient_name,
        recipientEmail: data.recipient_email || '',
        buyerName: data.buyer_name,
        buyerEmail: data.buyer_email,
        dedication: data.dedication || '',
      });

      if (response.data.error) {
        setCheckoutError(response.data.error);
        setSubmitting(false);
        return;
      }

      const stripe = window.Stripe(response.data.publishableKey);
      const result = await stripe.redirectToCheckout({ sessionId: response.data.sessionId });

      if (result.error) {
        setCheckoutError(result.error.message);
      }
    } catch (err) {
      setCheckoutError('Błąd przy przygotowaniu płatności');
      console.error(err);
    }

    setSubmitting(false);
  };

  const whatsappText = encodeURIComponent(
    `🎁 Masz voucher prezentowy Wesoły Masaż!\n\nKod: ${voucherCode}\n${data.type === 'service' ? `Usługa: ${data.service_name}` : `Wartość: ${data.value} PLN`}\nDla: ${data.recipient_name}\nWażny do: ${expiresDate}\n${data.dedication ? `„${data.dedication}"` : ''}\n\nWesoły Masaż`
  );
  const recipientWhatsapp = data.recipient_phone?.replace(/\D/g, '').replace(/^0/, '48').replace(/^(?!48)/, '48');

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <div className="w-20 h-20 border border-gold mx-auto flex items-center justify-center mb-8">
          <Gift size={32} className="text-gold" />
        </div>
        <h2 className="font-display text-3xl text-foreground mb-4">Voucher gotowy!</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Voucher został zapisany. Wyślij go odbiorcy przez WhatsApp lub zapisz kod poniżej.
        </p>
        <div className="border border-gold/20 bg-gold/5 p-6 max-w-xs mx-auto mb-8">
          <div className="text-xs text-muted-foreground tracking-widest uppercase mb-3">Kod vouchera</div>
          <div className="font-mono text-2xl font-medium text-gold">{voucherCode}</div>
          <div className="text-xs text-muted-foreground mt-2">
            {data.type === 'service' ? data.service_name : `${data.value} PLN`} · Ważny do: {expiresDate}
          </div>
        </div>
        {/* Wyślij przez WhatsApp */}
        {data.recipient_phone && (
          <a
            href={`https://wa.me/${recipientWhatsapp}?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 text-sm tracking-widest uppercase text-white mb-4 mr-3"
            style={{ backgroundColor: '#25D366' }}
          >
            <MessageCircle size={16} />
            Wyślij przez WhatsApp
          </a>
        )}
        <VoucherPreview data={data} code={voucherCode} />
        <a href="/" className="block mt-8 text-sm text-muted-foreground hover:text-gold transition-colors tracking-widest uppercase">
          Wróć na stronę główną
        </a>
      </motion.div>
    );
  }

  const canProceed = [
    // step 0
    data.type,
    // step 1
    data.type === 'value' ? Number(data.value) > 0 : !!data.service_id,
    // step 2
    data.recipient_name && data.buyer_name && data.buyer_email,
    // step 3
    true,
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      {/* Form */}
      <div>
        {/* Stepper */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 text-xs tracking-widest uppercase transition-colors ${i === step ? 'text-gold' : i < step ? 'text-muted-foreground' : 'text-muted-foreground/30'}`}>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs flex-shrink-0 ${i === step ? 'border-gold text-gold' : i < step ? 'border-green-500 bg-green-500 text-white' : 'border-border'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="hidden sm:inline">{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border mx-2" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

            {/* STEP 0: Rodzaj */}
            {step === 0 && (
              <div>
                <h2 className="font-display text-3xl text-foreground mb-2">Rodzaj vouchera</h2>
                <p className="text-muted-foreground mb-8">Voucher na dowolną kwotę lub konkretną usługę.</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {['value', 'service'].map((t) => (
                    <button
                      key={t}
                      onClick={() => update({ type: t, value: '', service_id: '', service_label: '' })}
                      className={`border p-5 text-left transition-all ${data.type === t ? 'border-gold bg-gold/5' : 'border-border hover:border-foreground'}`}
                    >
                      <div className="font-medium mb-1">{t === 'value' ? 'Na kwotę' : 'Na usługę'}</div>
                      <div className="text-xs text-muted-foreground">{t === 'value' ? 'Dowolna kwota PLN' : 'Konkretny masaż'}</div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(1)} className="bg-foreground text-background px-10 py-4 text-sm tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all duration-300">
                  Dalej →
                </button>
              </div>
            )}

            {/* STEP 1: Szczegóły */}
            {step === 1 && (
              <div>
                <h2 className="font-display text-3xl text-foreground mb-2">Szczegóły vouchera</h2>
                <p className="text-muted-foreground mb-8">
                  {data.type === 'value' ? 'Podaj wartość vouchera.' : 'Wybierz usługę.'}
                </p>

                {data.type === 'value' && (
                  <div className="mb-6">
                    <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">Kwota (PLN) *</label>
                    <div className="flex gap-3 flex-wrap mb-3">
                      {[100, 150, 200, 250, 300, 400, 500].map(v => (
                        <button
                          key={v}
                          onClick={() => update({ value: v })}
                          className={`px-4 py-2 border text-sm font-mono transition-all ${Number(data.value) === v ? 'border-gold bg-gold text-obsidian' : 'border-border hover:border-gold'}`}
                        >
                          {v} zł
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min="1"
                      value={data.value}
                      onChange={e => update({ value: e.target.value })}
                      className="w-full border-b border-border bg-transparent py-3 text-foreground focus:outline-none focus:border-gold transition-colors text-lg font-mono"
                      placeholder="lub wpisz własną kwotę..."
                    />
                  </div>
                )}

                {data.type === 'service' && (
                  <div className="mb-6">
                    <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">Wybierz usługę *</label>
                    {services.length > 0 ? (
                      <div className="space-y-2">
                        {services.map(s => (
                          <button
                            key={s.id}
                            onClick={() => update({ service_id: s.id, service_label: s.name, service_name: s.name, value: s.price })}
                            className={`w-full text-left border p-4 transition-all ${data.service_id === s.id ? 'border-gold bg-gold/5' : 'border-border hover:border-foreground'}`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium text-sm">{s.name}</div>
                                <div className="text-xs text-muted-foreground">{s.duration_minutes} min</div>
                              </div>
                              <div className="font-mono text-gold">{s.price} zł</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      // Fallback jeśli usługi nie są przekazane
                      <div className="space-y-2">
                        {[
                          { id: 's1', name: 'Masaż relaksacyjny 60 min', price: 150 },
                          { id: 's2', name: 'Masaż relaksacyjny 90 min', price: 200 },
                          { id: 's3', name: 'Masaż terapeutyczny 60 min', price: 180 },
                          { id: 's4', name: 'Gorące kamienie 90 min', price: 250 },
                          { id: 's5', name: 'Masaż sportowy 60 min', price: 170 },
                        ].map(s => (
                          <button
                            key={s.id}
                            onClick={() => update({ service_id: s.id, service_label: s.name, service_name: s.name, value: s.price })}
                            className={`w-full text-left border p-4 transition-all ${data.service_id === s.id ? 'border-gold bg-gold/5' : 'border-border hover:border-foreground'}`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-sm">{s.name}</span>
                              <span className="font-mono text-gold">{s.price} zł</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="text-xs text-muted-foreground mb-8">Voucher ważny do: <span className="text-foreground font-medium">{expiresDate}</span></div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(0)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm tracking-widest uppercase">
                    <ChevronLeft size={16} /> Wróć
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={data.type === 'value' ? !Number(data.value) : !data.service_id}
                    className="bg-foreground text-background px-10 py-4 text-sm tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all duration-300 disabled:opacity-40"
                  >
                    Dalej →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Odbiorca & kupujący */}
            {step === 2 && (
              <div>
                <h2 className="font-display text-3xl text-foreground mb-2">Dane osobowe</h2>
                <p className="text-muted-foreground mb-8">Dane obdarowanego i Twoje dane kontaktowe.</p>
                <div className="space-y-5 mb-8">
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">Imię obdarowanego *</label>
                    <input type="text" value={data.recipient_name} onChange={e => update({ recipient_name: e.target.value })}
                      className="w-full border-b border-border bg-transparent py-3 text-foreground focus:outline-none focus:border-gold transition-colors" placeholder="np. Marta" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">E-mail obdarowanego (opcjonalnie)</label>
                    <input type="email" value={data.recipient_email} onChange={e => update({ recipient_email: e.target.value })}
                      className="w-full border-b border-border bg-transparent py-3 text-foreground focus:outline-none focus:border-gold transition-colors" placeholder="marta@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">WhatsApp obdarowanego (opcjonalnie)</label>
                    <input type="tel" value={data.recipient_phone} onChange={e => update({ recipient_phone: e.target.value })}
                      className="w-full border-b border-border bg-transparent py-3 text-foreground focus:outline-none focus:border-gold transition-colors" placeholder="+48 000 000 000" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">Dedykacja (opcjonalnie)</label>
                    <textarea rows={2} value={data.dedication} onChange={e => update({ dedication: e.target.value })}
                      className="w-full border-b border-border bg-transparent py-3 text-foreground focus:outline-none focus:border-gold transition-colors resize-none" placeholder="np. Zasługujesz na chwilę tylko dla siebie..." />
                  </div>
                  <div className="border-t border-border pt-5">
                    <div className="text-xs tracking-widest uppercase text-muted-foreground mb-4">Twoje dane</div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Imię i nazwisko *</label>
                        <input type="text" value={data.buyer_name} onChange={e => update({ buyer_name: e.target.value })}
                          className="w-full border-b border-border bg-transparent py-3 text-foreground focus:outline-none focus:border-gold transition-colors" placeholder="Jan Kowalski" />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Twój e-mail *</label>
                        <input type="email" value={data.buyer_email} onChange={e => update({ buyer_email: e.target.value })}
                          className="w-full border-b border-border bg-transparent py-3 text-foreground focus:outline-none focus:border-gold transition-colors" placeholder="jan@example.com" />
                      </div>
                    </div>
                  </div>

                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm tracking-widest uppercase">
                    <ChevronLeft size={16} /> Wróć
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!data.recipient_name || !data.buyer_name || !data.buyer_email}
                    className="bg-foreground text-background px-10 py-4 text-sm tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all duration-300 disabled:opacity-40"
                  >
                    Podgląd →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Podsumowanie */}
            {step === 3 && (
              <div>
                <h2 className="font-display text-3xl text-foreground mb-2">Podsumowanie</h2>
                <p className="text-muted-foreground mb-6">Sprawdź dane i przejdź do płatności.</p>
                <div className="border border-border p-5 space-y-3 mb-8 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Rodzaj</span><span>{data.type === 'value' ? `Kwota: ${data.value} PLN` : data.service_name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Dla</span><span>{data.recipient_name}</span></div>
                  {data.recipient_email && <div className="flex justify-between"><span className="text-muted-foreground">E-mail odbiorcy</span><span>{data.recipient_email}</span></div>}
                  {data.recipient_phone && <div className="flex justify-between"><span className="text-muted-foreground">WhatsApp odbiorcy</span><span>{data.recipient_phone}</span></div>}
                  <div className="flex justify-between"><span className="text-muted-foreground">Ważny do</span><span>{expiresDate}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Kupujący</span><span>{data.buyer_name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">E-mail potwierdzenia</span><span>{data.buyer_email}</span></div>
                </div>
                {checkoutError && (
                  <div className="border border-destructive bg-destructive/10 text-destructive p-4 mb-6 text-sm">
                    {checkoutError}
                  </div>
                )}
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm tracking-widest uppercase">
                    <ChevronLeft size={16} /> Wróć
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={submitting}
                    className="flex items-center gap-3 bg-gold text-obsidian px-10 py-4 text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    {submitting ? 'Przygotowuję...' : 'Kup teraz'}
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
        <VoucherPreview data={data} code={null} />
        <div className="mt-4 text-xs text-muted-foreground">
          Kod vouchera zostanie wygenerowany po zamówieniu i wysłany na wskazany e-mail.
        </div>
      </div>
    </div>
  );
}