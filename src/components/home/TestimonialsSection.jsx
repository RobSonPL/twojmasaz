import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { base44 } from '@/api/base44Client';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewCard from '@/components/reviews/ReviewCard';

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const loadReviews = async () => {
    try {
      const data = await base44.entities.Review.list('-created_date', 20);
      setReviews(data);
    } catch (e) {
      setReviews([]);
    }
    setLoading(false);
  };

  useEffect(() => { loadReviews(); }, []);

  const handleSubmitted = (newReview) => {
    setReviews(prev => [newReview, ...prev].slice(0, 20));
    setShowForm(false);
    setTimeout(() => emblaApi?.scrollTo(0), 100);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <section id="opinie" className="section-padding bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gold text-xs tracking-[0.4em] uppercase"
            >
              Opinie
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl lg:text-6xl mt-4 text-foreground"
            >
              Co mówią<br />klienci
            </motion.h2>
          </div>
          <button
            onClick={() => setShowForm(s => !s)}
            className="flex items-center gap-2 border border-gold/40 text-gold px-6 py-3 text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-obsidian transition-all duration-300"
          >
            {showForm ? <X size={14} /> : <Plus size={14} />}
            {showForm ? 'Anuluj' : 'Dodaj opinię'}
          </button>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-12 p-8 border border-border/10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            <div className="font-mono text-5xl text-foreground">{avgRating}</div>
            <div className="text-foreground/30 text-xs tracking-widest uppercase mt-2">
              Średnia z {reviews.length} opinii
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <Star key={i} size={20} className="text-gold fill-gold" />
            ))}
          </div>
          <div className="text-foreground/30 text-sm text-center md:text-right max-w-xs">
            Twoja opinia pomoże innym podjąć decyzję i pozwoli nam stale ulepszać nasze usługi.
          </div>
        </motion.div>

        {/* Form */}
        {showForm && <ReviewForm onSubmitted={handleSubmitted} />}

        {/* Reviews slider */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-border/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 border border-border/10">
            <p className="text-foreground/40 mb-4">Bądź pierwszą osobą, która podzieli się opinią!</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-gold text-sm tracking-widest uppercase hover:underline"
            >
              Dodaj opinię →
            </button>
          </div>
        ) : (
          <div className="relative">
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-6">
                {reviews.map((r, i) => (
                  <div
                    key={r.id}
                    className="min-w-0 shrink-0 grow-0 basis-full lg:basis-[calc(50%-12px)]"
                  >
                    <ReviewCard review={r} index={i} />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-3 mt-10">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="w-12 h-12 flex items-center justify-center border border-gold/30 text-gold hover:bg-gold hover:text-obsidian transition-all duration-300"
                aria-label="Poprzednia opinia"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="w-12 h-12 flex items-center justify-center border border-gold/30 text-gold hover:bg-gold hover:text-obsidian transition-all duration-300"
                aria-label="Następna opinia"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}