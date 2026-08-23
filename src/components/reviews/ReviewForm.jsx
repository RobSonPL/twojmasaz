import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Star, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReviewForm({ onSubmitted }) {
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authorName.trim() || !text.trim()) {
      setError('Imię i treść opinii są wymagane.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const created = await base44.entities.Review.create({
        author_name: authorName.trim(),
        rating,
        text: text.trim(),
        service_name: serviceName.trim() || undefined,
      });
      onSubmitted(created);
      setAuthorName('');
      setText('');
      setServiceName('');
      setRating(5);
    } catch (err) {
      setError('Nie udało się dodać opinii. Spróbuj ponownie później.');
    }
    setSubmitting(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      onSubmit={handleSubmit}
      className="mb-12 border border-primary-foreground/10 p-6 lg:p-8 overflow-hidden"
    >
      <h3 className="font-display text-2xl text-primary-foreground mb-6">Podziel się opinią</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-primary-foreground/40 mb-2">
            Imię / nick *
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={60}
            className="w-full bg-transparent border border-primary-foreground/15 px-4 py-3 text-primary-foreground focus:border-gold outline-none transition-colors"
            placeholder="np. Anna K."
          />
        </div>
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-primary-foreground/40 mb-2">
            Usługa (opcjonalnie)
          </label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            maxLength={80}
            className="w-full bg-transparent border border-primary-foreground/15 px-4 py-3 text-primary-foreground focus:border-gold outline-none transition-colors"
            placeholder="np. Masaż relaksacyjny"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs tracking-[0.2em] uppercase text-primary-foreground/40 mb-3">
          Ocena (1-6 gwiazdek)
        </label>
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => {
            const val = i + 1;
            return (
              <button
                key={val}
                type="button"
                onClick={() => setRating(val)}
                onMouseEnter={() => setHover(val)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  className={(hover || rating) >= val ? 'text-gold fill-gold' : 'text-primary-foreground/20'}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs tracking-[0.2em] uppercase text-primary-foreground/40 mb-2">
          Treść opinii *
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={600}
          rows={4}
          className="w-full bg-transparent border border-primary-foreground/15 px-4 py-3 text-primary-foreground focus:border-gold outline-none transition-colors resize-none"
          placeholder="Opisz swoje wrażenia z wizyty..."
        />
      </div>

      {error && <p className="text-destructive text-sm mb-4">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 bg-gold text-obsidian px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
      >
        {submitting ? (
          <span className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
        ) : (
          <Send size={14} />
        )}
        {submitting ? 'Wysyłanie...' : 'Opublikuj opinię'}
      </button>
    </motion.form>
  );
}