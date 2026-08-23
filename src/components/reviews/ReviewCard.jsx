import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReviewCard({ review, index = 0 }) {
  const rating = review.rating || 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.5 }}
      className="border border-border/10 p-6 hover:border-gold/20 transition-all duration-500 group flex flex-col h-full"
    >
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={i < rating ? 'text-gold fill-gold' : 'text-foreground/15'}
          />
        ))}
      </div>

      <p className="text-foreground/60 text-sm leading-relaxed mb-6 italic font-display flex-1">
        „{review.text}"
      </p>

      <div className="border-t border-border/10 pt-4 flex justify-between items-end">
        <div>
          <div className="text-foreground text-sm font-medium">{review.author_name}</div>
          {review.service_name && (
            <div className="text-foreground/30 text-xs tracking-wider mt-1">{review.service_name}</div>
          )}
        </div>
        <div className="font-mono text-xs text-gold/40 group-hover:text-gold/70 transition-colors">
          ★ {rating}.0
        </div>
      </div>
    </motion.div>
  );
}