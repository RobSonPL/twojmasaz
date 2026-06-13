import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

export default function PackageCard({ template, index, onBuy }) {
  const totalVisits = template.visits_count + (template.bonus_visits || 0);
  const pricePerVisit = Math.round(template.price / totalVisits);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`border flex flex-col ${template.bonus_visits > 0 ? 'border-gold' : 'border-border'} relative`}
    >
      {template.bonus_visits > 0 && (
        <div className="absolute -top-3 left-5">
          <span className="bg-gold text-obsidian text-xs font-medium px-3 py-1 tracking-widest uppercase flex items-center gap-1">
            <Gift size={10} /> Bestseller
          </span>
        </div>
      )}

      <div className="p-7 flex-1">
        <h3 className="font-display text-xl text-foreground mb-1">{template.name}</h3>
        {template.service_name && (
          <p className="text-xs text-muted-foreground tracking-widest uppercase mb-4">{template.service_name}</p>
        )}
        {template.description && (
          <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
        )}

        {/* Visits display */}
        <div className="flex gap-1.5 flex-wrap mb-6">
          {Array.from({ length: template.visits_count }, (_, i) => (
            <div key={i} className="w-8 h-8 border-2 border-gold bg-gold/10 flex items-center justify-center text-xs text-gold font-mono">
              {i + 1}
            </div>
          ))}
          {Array.from({ length: template.bonus_visits || 0 }, (_, i) => (
            <div key={`b${i}`} className="w-8 h-8 border-2 border-green-500 bg-green-500/10 flex items-center justify-center text-xs text-green-500">
              🎁
            </div>
          ))}
        </div>

        {template.bonus_visits > 0 && (
          <div className="text-xs text-green-600 font-medium mb-4">
            + {template.bonus_visits} wizyta gratis!
          </div>
        )}

        <div className="font-mono text-3xl text-gold mb-1">{template.price} zł</div>
        <div className="text-xs text-muted-foreground">≈ {pricePerVisit} zł / wizyta</div>
      </div>

      <div className="p-7 pt-0">
        <button
          onClick={onBuy}
          className="w-full py-3 text-sm tracking-widest uppercase transition-all duration-300 bg-foreground text-background hover:bg-gold hover:text-obsidian"
        >
          Kup karnet
        </button>
      </div>
    </motion.div>
  );
}