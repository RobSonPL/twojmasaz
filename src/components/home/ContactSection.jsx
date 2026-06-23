import { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Send, Phone, Mail, MapPin, Check } from 'lucide-react';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.ContactMessage.create(form);
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <section id="kontakt" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold text-xs tracking-[0.4em] uppercase">Kontakt</span>
            <h2 className="font-display text-4xl lg:text-5xl mt-4 text-foreground mb-8">
              Masz pytania?<br />Napisz do nas
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-md">
              Chętnie odpowiemy na wszystkie Twoje pytania dotyczące usług, dojazdów czy terminów. Możesz też pisać bezpośrednio przez WhatsApp.
            </p>

            <ul className="space-y-6">
              <li className="flex items-center gap-4">
                <div className="w-12 h-12 border border-border flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-gold" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground tracking-widest uppercase mb-1">Telefon / WhatsApp</div>
                  <a href="tel:+48000000000" className="text-foreground hover:text-gold transition-colors font-medium">
                    +48 000 000 000
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-12 h-12 border border-border flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-gold" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground tracking-widest uppercase mb-1">E-mail</div>
                  <a href="mailto:irena@wesolymasaz.pl" className="text-foreground hover:text-gold transition-colors font-medium">
                    irena@wesolymasaz.pl
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-12 h-12 border border-border flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-gold" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground tracking-widest uppercase mb-1">Lokalizacja</div>
                  <span className="text-foreground font-medium">Dojazd do klienta + Salon stacjonarny</span>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-16 h-16 border border-gold flex items-center justify-center mb-6">
                  <Check size={24} className="text-gold" />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-3">Wiadomość wysłana</h3>
                <p className="text-muted-foreground">Odpiszemy najszybciej jak to możliwe, zwykle w ciągu kilku godzin.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
                      Imię i nazwisko *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full border-b border-border bg-transparent py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold transition-colors text-base"
                      placeholder="Jan Kowalski"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full border-b border-border bg-transparent py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold transition-colors text-base"
                      placeholder="+48 000 000 000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border-b border-border bg-transparent py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold transition-colors text-base"
                    placeholder="jan@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
                    Wiadomość *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full border-b border-border bg-transparent py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold transition-colors text-base resize-none"
                    placeholder="W czym możemy Ci pomóc?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-3 bg-foreground text-background px-8 py-4 text-sm tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all duration-300 focus-gold disabled:opacity-50 min-h-[48px]"
                >
                  {submitting ? 'Wysyłanie...' : 'Wyślij wiadomość'}
                  <Send size={14} />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}