import { motion } from 'framer-motion';
import { Star, Zap, Gift } from 'lucide-react';

const TIERS = [
  {
    icon: Star,
    label: 'Srebrny',
    visits: 5,
    spend: 500,
    reward: '-25% rabatu',
    rewardDetail: 'na każdy kolejny masaż',
    color: 'text-slate-400',
    borderColor: 'border-slate-300',
    bgColor: 'bg-slate-50 dark:bg-slate-900/30',
  },
  {
    icon: Zap,
    label: 'Złoty',
    visits: 10,
    spend: 1000,
    reward: '-50% rabatu',
    rewardDetail: 'na każdy kolejny masaż',
    color: 'text-gold',
    borderColor: 'border-gold/50',
    bgColor: 'bg-gold/5',
  },
  {
    icon: Gift,
    label: 'Diamentowy',
    visits: 15,
    spend: 1500,
    reward: 'Kolejny masaż gratis',
    rewardDetail: 'każdy 16. masaż bezpłatnie',
    color: 'text-blue-400',
    borderColor: 'border-blue-400/50',
    bgColor: 'bg-blue-50/50 dark:bg-blue-900/10',
  },
];

export default function LoyaltyTiers({ completedCount = 0, totalSpend = 0 }) {
  const getCurrentTier = () => {
    if (completedCount >= 15 || totalSpend >= 1500) return 2;
    if (completedCount >= 10 || totalSpend >= 1000) return 1;
    if (completedCount >= 5 || totalSpend >= 500) return 0;
    return -1;
  };

  const currentTier = getCurrentTier();

  const getProgress = (tier) => {
    const visitProgress = Math.min(completedCount / tier.visits, 1);
    const spendProgress = Math.min(totalSpend / tier.spend, 1);
    return Math.max(visitProgress, spendProgress);
  };

  return (
    <div>
      <div className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-5">Progi lojalnościowe</div>
      <div className="space-y-3">
        {TIERS.map((tier, i) => {
          const Icon = tier.icon;
          const unlocked = i <= currentTier;
          const progress = getProgress(tier);
          const isActive = i === currentTier;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`border p-5 transition-all ${unlocked ? tier.borderColor + ' ' + tier.bgColor : 'border-border opacity-60'} ${isActive ? 'ring-1 ring-gold/30' : ''}`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 ${unlocked ? tier.borderColor : 'border-border'}`}>
                    <Icon size={16} className={unlocked ? tier.color : 'text-muted-foreground'} />
                  </div>
                  <div>
                    <div className={`font-medium text-sm ${unlocked ? '' : 'text-muted-foreground'}`}>{tier.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {tier.visits} wizyt lub {tier.spend} zł
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-sm font-medium ${unlocked ? tier.color : 'text-muted-foreground'}`}>{tier.reward}</div>
                  <div className="text-xs text-muted-foreground">{tier.rewardDetail}</div>
                </div>
              </div>

              {/* Progress bar */}
              {!unlocked && (
                <div>
                  <div className="h-1 bg-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                      className="h-full bg-gold/60 rounded-full"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.round(progress * 100)}% do odblokowania
                  </div>
                </div>
              )}

              {unlocked && (
                <div className={`text-xs font-medium flex items-center gap-1 ${tier.color}`}>
                  <span>✓</span> Odblokowany
                  {isActive && <span className="text-muted-foreground ml-1">— aktualny poziom</span>}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Zniżki są naliczane automatycznie przez obsługę przy następnej wizycie lub możesz o nich przypomnieć przez WhatsApp.
      </p>
    </div>
  );
}