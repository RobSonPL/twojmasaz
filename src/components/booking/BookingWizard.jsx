import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Home, Building2, ChevronLeft, Check, Loader2 } from 'lucide-react';
import { format, addDays, startOfToday, isBefore, isToday } from 'date-fns';
import { pl } from 'date-fns/locale';

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

const defaultServices = [
  { id: '1', name: 'Masaż Klasyczny', price: 150, duration_minutes: 60, is_available_home: true, is_available_studio: true },
  { id: '2', name: 'Masaż Głęboki', price: 180, duration_minutes: 60, is_available_home: true, is_available_studio: true },
  { id: '3', name: 'Masaż Relaksacyjny', price: 200, duration_minutes: 90, is_available_home: true, is_available_studio: true },
  { id: '4', name: 'Gorące Kamienie', price: 250, duration_minutes: 90, is_available_home: false, is_available_studio: true },
  { id: '5', name: 'Masaż Sportowy', price: 170, duration_minutes: 60, is_available_home: true, is_available_studio: true },
  { id: '6', name: 'Masaż Twarzy', price: 100, duration_minutes: 30, is_available_home: false, is_available_studio: true },
];

function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center gap-2 mb-12">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-6 h-6 flex items-center justify-center text-xs font-mono border transition-all duration-300 ${
            i < currentStep
              ? 'bg-gold border-gold text-obsidian'
              : i === currentStep
              ? 'border-gold text-gold'
              : 'border-border text-muted-foreground'
          }`}>
            {i < currentStep ? <Check size={12} /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-8 h-px transition-all duration-500 ${i < currentStep ? 'bg-gold' : 'bg-border'}`} />
          )}
        </div>
      ))}
      <span className="ml-4 text-xs text-muted-foreground tracking-widest uppercase">
        Krok {currentStep + 1} z {totalSteps}
      </span>
    </div>
  );
}

// Step 1: Service + Type selection
function StepService({ services, booking, onChange, onNext }) {
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedId = urlParams.get('service');

  useEffect(() => {
    if (preselectedId && !booking.service_id) {
      const svc = services.find(s => s.id === preselectedId);
      if (svc) onChange({ service_id: svc.id, service_name: svc.name, service_price: svc.price, service_duration: svc.duration_minutes });
    }
  }, [preselectedId, services]);

  const selectedService = services.find(s => s.id === booking.service_id);

  return (
    <div>
      <h2 className="font-display text-3xl lg:text-4xl text-obsidian mb-2">Wybierz masaż</h2>
      <p className="text-muted-foreground mb-10">Najedź na usługę, aby zobaczyć szczegóły.</p>

      <div className="space-y-3 mb-10">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onChange({ service_id: service.id, service_name: service.name, service_price: service.price, service_duration: service.duration_minutes })}
            className={`w-full text-left border p-5 transition-all duration-200 group min-h-[48px] focus-gold ${
              booking.service_id === service.id
                ? 'border-gold bg-gold/5'
                : 'border-border hover:border-obsidian'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-base">{service.name}</span>
                <div className="flex gap-3 mt-1">
                  {service.is_available_home && <span className="text-xs text-muted-foreground flex items-center gap-1"><Home size={10} /> Dojazd</span>}
                  {service.is_available_studio && <span className="text-xs text-muted-foreground flex items-center gap-1"><Building2 size={10} /> Salon</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-mono font-medium">{service.price} PLN</div>
                <div className="text-xs text-muted-foreground">{service.duration_minutes} min</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!booking.service_id}
        className="bg-obsidian text-bone px-10 py-4 text-sm tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed min-h-[48px] focus-gold"
      >
        Dalej — wybierz miejsce
      </button>
    </div>
  );
}

// Step 2: Location (Home/Studio)
function StepLocation({ booking, onChange, onNext, onBack, services }) {
  const selectedService = services.find(s => s.id === booking.service_id);

  return (
    <div>
      <h2 className="font-display text-3xl lg:text-4xl text-obsidian mb-2">Gdzie chcesz?</h2>
      <p className="text-muted-foreground mb-10">Dojazd do Twojego domu lub wizyta w naszym salonie.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Home option */}
        {selectedService?.is_available_home !== false && (
          <button
            onClick={() => onChange({ booking_type: 'home' })}
            className={`border p-8 text-left transition-all duration-200 focus-gold min-h-[48px] ${
              booking.booking_type === 'home' ? 'border-gold bg-gold/5' : 'border-border hover:border-obsidian'
            }`}
          >
            <Home size={24} className={`mb-4 ${booking.booking_type === 'home' ? 'text-gold' : 'text-muted-foreground'}`} />
            <div className="font-medium text-lg mb-2">Dojazd do klienta</div>
            <div className="text-sm text-muted-foreground">Masażysta przyjedzie do Twojego domu lub biura. Podaj adres w następnym kroku.</div>
          </button>
        )}

        {/* Studio option */}
        {selectedService?.is_available_studio !== false && (
          <button
            onClick={() => onChange({ booking_type: 'studio' })}
            className={`border p-8 text-left transition-all duration-200 focus-gold min-h-[48px] ${
              booking.booking_type === 'studio' ? 'border-gold bg-gold/5' : 'border-border hover:border-obsidian'
            }`}
          >
            <Building2 size={24} className={`mb-4 ${booking.booking_type === 'studio' ? 'text-gold' : 'text-muted-foreground'}`} />
            <div className="font-medium text-lg mb-2">Salon stacjonarny</div>
            <div className="text-sm text-muted-foreground">Odwiedź nasz salon. Dokładny adres otrzymasz w potwierdzeniu rezerwacji.</div>
          </button>
        )}
      </div>

      {/* Address field for home */}
      <AnimatePresence>
        {booking.booking_type === 'home' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Adres dojazdu *
            </label>
            <input
              type="text"
              value={booking.address || ''}
              onChange={e => onChange({ address: e.target.value })}
              placeholder="ul. Przykładowa 1, 00-000 Warszawa"
              className="w-full border-b border-border bg-transparent py-3 text-obsidian placeholder-muted-foreground focus:outline-none focus:border-gold transition-colors text-base"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-obsidian transition-colors text-sm tracking-widest uppercase min-h-[48px] focus-gold">
          <ChevronLeft size={16} /> Wróć
        </button>
        <button
          onClick={onNext}
          disabled={!booking.booking_type || (booking.booking_type === 'home' && !booking.address?.trim())}
          className="bg-obsidian text-bone px-10 py-4 text-sm tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed min-h-[48px] focus-gold"
        >
          Dalej — wybierz termin
        </button>
      </div>
    </div>
  );
}

// Step 3: Date & Time
function StepDateTime({ booking, onChange, onNext, onBack }) {
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState(booking.booking_date ? new Date(booking.booking_date) : null);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Generate next 30 days
  const days = Array.from({ length: 30 }, (_, i) => addDays(today, i + 1));

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    onChange({ booking_date: format(date, 'yyyy-MM-dd'), booking_time: '' });
    // Load booked slots for this day
    const bookings = await base44.entities.Booking.filter({
      booking_date: format(date, 'yyyy-MM-dd'),
      status: 'confirmed'
    });
    setBookedSlots(bookings.map(b => b.booking_time));
  };

  const isSlotBooked = (time) => bookedSlots.includes(time);

  const weekDayNames = ['N', 'P', 'W', 'Ś', 'C', 'P', 'S'];

  return (
    <div>
      <h2 className="font-display text-3xl lg:text-4xl text-obsidian mb-2">Wybierz termin</h2>
      <p className="text-muted-foreground mb-10">Dostępne terminy zaznaczone są na złoto.</p>

      {/* Calendar */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 pb-2" style={{ minWidth: 'max-content' }}>
          {days.slice(0, 14).map((day) => {
            const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            const isSunday = day.getDay() === 0;
            return (
              <button
                key={day.toISOString()}
                onClick={() => !isSunday && handleDateSelect(day)}
                disabled={isSunday}
                className={`flex flex-col items-center p-3 w-16 border transition-all duration-200 focus-gold min-h-[48px] ${
                  isSelected ? 'border-gold bg-gold text-obsidian' :
                  isSunday ? 'border-border opacity-30 cursor-not-allowed' :
                  'border-border hover:border-obsidian'
                }`}
              >
                <span className="text-xs tracking-wider opacity-60">{weekDayNames[day.getDay()]}</span>
                <span className="font-mono text-lg font-medium mt-1">{format(day, 'd')}</span>
                <span className="text-xs opacity-60">{format(day, 'MMM', { locale: pl })}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="text-xs text-muted-foreground tracking-widest uppercase mb-4">
              Dostępne godziny — {format(selectedDate, 'd MMMM yyyy', { locale: pl })}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {TIME_SLOTS.map((time) => {
                const booked = isSlotBooked(time);
                const selected = booking.booking_time === time;
                return (
                  <button
                    key={time}
                    onClick={() => !booked && onChange({ booking_time: time })}
                    disabled={booked}
                    className={`border py-3 text-sm font-mono transition-all duration-200 focus-gold min-h-[48px] ${
                      selected ? 'border-gold bg-gold text-obsidian' :
                      booked ? 'border-border text-muted-foreground line-through opacity-40 cursor-not-allowed' :
                      'border-border hover:border-obsidian'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-obsidian transition-colors text-sm tracking-widest uppercase min-h-[48px] focus-gold">
          <ChevronLeft size={16} /> Wróć
        </button>
        <button
          onClick={onNext}
          disabled={!booking.booking_date || !booking.booking_time}
          className="bg-obsidian text-bone px-10 py-4 text-sm tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed min-h-[48px] focus-gold"
        >
          Dalej — Twoje dane
        </button>
      </div>
    </div>
  );
}

// Step 4: Personal data + confirmation
function StepDetails({ booking, onChange, onSubmit, onBack, submitting }) {
  return (
    <div>
      <h2 className="font-display text-3xl lg:text-4xl text-obsidian mb-2">Twoje dane</h2>
      <p className="text-muted-foreground mb-10">Bez rejestracji. Potwierdzenie przyjdzie na e-mail.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">Imię i nazwisko *</label>
          <input
            type="text"
            required
            value={booking.client_name || ''}
            onChange={e => onChange({ client_name: e.target.value })}
            className="w-full border-b border-border bg-transparent py-3 text-obsidian focus:outline-none focus:border-gold transition-colors text-base"
            placeholder="Jan Kowalski"
          />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">Telefon *</label>
          <input
            type="tel"
            required
            value={booking.client_phone || ''}
            onChange={e => onChange({ client_phone: e.target.value })}
            className="w-full border-b border-border bg-transparent py-3 text-obsidian focus:outline-none focus:border-gold transition-colors text-base"
            placeholder="+48 787 907 141"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">E-mail *</label>
          <input
            type="email"
            required
            value={booking.client_email || ''}
            onChange={e => onChange({ client_email: e.target.value })}
            className="w-full border-b border-border bg-transparent py-3 text-obsidian focus:outline-none focus:border-gold transition-colors text-base"
            placeholder="jan@example.com"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">Uwagi (opcjonalnie)</label>
          <textarea
            rows={3}
            value={booking.notes || ''}
            onChange={e => onChange({ notes: e.target.value })}
            className="w-full border-b border-border bg-transparent py-3 text-obsidian focus:outline-none focus:border-gold transition-colors text-base resize-none"
            placeholder="Np. mam problem z odcinkiem lędźwiowym..."
          />
        </div>
      </div>

      {/* Summary */}
      <aside className="border border-gold/20 bg-gold/5 p-6 mb-10">
        <div className="text-xs text-muted-foreground tracking-widest uppercase mb-4">Podsumowanie rezerwacji</div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Usługa</span>
            <span className="font-medium">{booking.service_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tryb</span>
            <span className="font-medium">{booking.booking_type === 'home' ? '🏠 Dojazd do klienta' : '🏢 Salon stacjonarny'}</span>
          </div>
          {booking.address && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Adres</span>
              <span className="font-medium text-right max-w-48">{booking.address}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data</span>
            <span className="font-medium">{booking.booking_date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Godzina</span>
            <span className="font-medium">{booking.booking_time}</span>
          </div>
          <div className="border-t border-gold/20 pt-3 flex justify-between">
            <span className="font-medium">Do zapłaty</span>
            <span className="font-mono font-medium text-gold">{booking.service_price} PLN</span>
          </div>
        </div>
      </aside>

      <div className="flex gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-obsidian transition-colors text-sm tracking-widest uppercase min-h-[48px] focus-gold">
          <ChevronLeft size={16} /> Wróć
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting || !booking.client_name || !booking.client_email || !booking.client_phone}
          className="flex items-center gap-3 bg-gold text-obsidian px-10 py-4 text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed min-h-[48px] focus-gold"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          Potwierdź rezerwację
        </button>
      </div>
    </div>
  );
}

// Step 5: Confirmation
function StepConfirmation({ booking }) {
  const OWNER_PHONE = '48884060680';
  const waMessage = encodeURIComponent(
    `Cześć! Właśnie dokonałem/am rezerwacji:\n\n` +
    `📋 Usługa: ${booking.service_name}\n` +
    `📅 Data: ${booking.booking_date}, godz. ${booking.booking_time}\n` +
    `📍 Tryb: ${booking.booking_type === 'home' ? `Dojazd — ${booking.address}` : 'Salon stacjonarny'}\n` +
    `👤 Imię: ${booking.client_name}\n` +
    `📞 Telefon: ${booking.client_phone}\n\n` +
    `Proszę o potwierdzenie. Dziękuję!`
  );
  const waUrl = `https://wa.me/${OWNER_PHONE}?text=${waMessage}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="w-20 h-20 border border-gold mx-auto flex items-center justify-center mb-8">
        <Check size={32} className="text-gold" />
      </div>
      <h2 className="font-display text-3xl lg:text-4xl text-obsidian mb-4">Rezerwacja zapisana!</h2>
      <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
        Potwierdzenie trafiło na <strong>{booking.client_email}</strong>. Teraz kliknij poniżej, aby wysłać mi wiadomość przez WhatsApp — to ostatni krok do pełnego potwierdzenia.
      </p>
      <div className="border border-gold/20 bg-gold/5 p-6 max-w-sm mx-auto text-left mb-8">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Usługa</span>
            <span className="font-medium">{booking.service_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data</span>
            <span className="font-medium">{booking.booking_date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Godzina</span>
            <span className="font-medium">{booking.booking_time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Kwota</span>
            <span className="font-mono font-medium text-gold">{booking.service_price} PLN</span>
          </div>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-[#25D366] text-white px-10 py-4 text-sm tracking-widest uppercase font-medium hover:bg-[#1ebe5a] transition-all duration-300 mb-6"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Wyślij potwierdzenie przez WhatsApp
      </a>

      <div className="block">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors tracking-widest uppercase"
        >
          Wróć na stronę główną
        </a>
      </div>
    </motion.div>
  );
}

export default function BookingWizard() {
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [services, setServices] = useState(defaultServices);

  useEffect(() => {
    base44.entities.Service.filter({ is_active: true }).then(svcs => {
      if (svcs.length > 0) setServices(svcs);
    });
  }, []);

  const update = (data) => setBooking(prev => ({ ...prev, ...data }));

  const submit = async () => {
    setSubmitting(true);
    try {
      await base44.entities.Booking.create({ ...booking, status: 'confirmed' });
      // Send confirmation email
      try {
        await base44.integrations.Core.SendEmail({
          to: booking.client_email,
          subject: `Potwierdzenie rezerwacji — ${booking.service_name}`,
          body: `Cześć ${booking.client_name}!\n\nTwoja rezerwacja jest potwierdzona:\n\nUsługa: ${booking.service_name}\nData: ${booking.booking_date}\nGodzina: ${booking.booking_time}\nTryb: ${booking.booking_type === 'home' ? 'Dojazd do klienta' : 'Salon stacjonarny'}${booking.address ? '\nAdres: ' + booking.address : ''}\nCena: ${booking.service_price} PLN\n\nDo zobaczenia!\nWesoły Masaż`
        });
      } catch (e) {
        // email failure doesn't block confirmation
      }
      setConfirmed(true);
    } finally {
      setSubmitting(false);
    }
  };

  const STEPS = [StepService, StepLocation, StepDateTime, StepDetails];

  if (confirmed) {
    return <StepConfirmation booking={booking} />;
  }

  return (
    <div>
      <StepIndicator currentStep={step} totalSteps={4} />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && <StepService services={services} booking={booking} onChange={update} onNext={() => setStep(1)} />}
          {step === 1 && <StepLocation booking={booking} onChange={update} onNext={() => setStep(2)} onBack={() => setStep(0)} services={services} />}
          {step === 2 && <StepDateTime booking={booking} onChange={update} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <StepDetails booking={booking} onChange={update} onSubmit={submit} onBack={() => setStep(2)} submitting={submitting} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}