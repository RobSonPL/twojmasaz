import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Copy, Check, Users, Gift } from 'lucide-react';

function generateReferralCode(email) {
  // Deterministyczny kod na bazie emaila
  const hash = email.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return 'WM-' + hash.toString(36).toUpperCase().padStart(6, '0');
}

export default function ReferralSection({ user }) {
  const [referrals, setReferrals] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const code = generateReferralCode(user.email);
  const referralLink = `${window.location.origin}/rezerwacja?ref=${code}`;

  useEffect(() => {
    base44.entities.Referral.filter({ referrer_email: user.email }, '-created_date', 20)
      .then(setReferrals)
      .finally(() => setLoading(false));
  }, [user.email]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completed = referrals.filter(r => r.status === 'completed' || r.status === 'rewarded').length;
  const rewarded = referrals.filter(r => r.status === 'rewarded').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header info */}
      <div className="border border-gold/30 bg-gold/5 p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 border border-gold flex items-center justify-center flex-shrink-0">
            <Gift size={20} className="text-gold" />
          </div>
          <div>
            <h3 className="font-display text-xl text-foreground mb-1">Poleć znajomych, zyskaj razem</h3>
            <p className="text-sm text-muted-foreground">
              Za każdego znajomego, który odwiedzi salon dzięki Twojemu poleceniu — oboje otrzymujecie <span className="text-gold font-medium">30 zł zniżki</span> na kolejną wizytę.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-border p-4 text-center">
          <div className="font-mono text-2xl text-gold mb-1">{referrals.length}</div>
          <div className="text-xs text-muted-foreground tracking-widest uppercase">Poleconych</div>
        </div>
        <div className="border border-border p-4 text-center">
          <div className="font-mono text-2xl text-gold mb-1">{completed}</div>
          <div className="text-xs text-muted-foreground tracking-widest uppercase">Zrealizowanych</div>
        </div>
        <div className="border border-border p-4 text-center">
          <div className="font-mono text-2xl text-gold mb-1">{rewarded * 30} zł</div>
          <div className="text-xs text-muted-foreground tracking-widest uppercase">Zarobionych</div>
        </div>
      </div>

      {/* Referral link */}
      <div className="mb-8">
        <div className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Twój unikalny link</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 border border-border px-4 py-3 font-mono text-sm text-muted-foreground overflow-hidden overflow-ellipsis whitespace-nowrap bg-muted/30">
            {referralLink}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 border border-border px-4 py-3 text-xs tracking-widest uppercase hover:border-gold hover:text-gold transition-colors flex-shrink-0"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? 'Skopiowano!' : 'Kopiuj'}
          </button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Kod polecający: <span className="font-mono text-gold">{code}</span>
        </div>
      </div>

      {/* WhatsApp share */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`Hej! Polecam Ci salon masażu Wesoły Masaż — profesjonalne masaże w dojeździe i w salonie. Skorzystaj z mojego kodu polecającego i zyskaj 30 zł zniżki na pierwszą wizytę: ${referralLink}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 text-sm tracking-widest uppercase text-white mb-8"
        style={{ backgroundColor: '#25D366' }}
      >
        <Users size={14} />
        Udostępnij przez WhatsApp
      </a>

      {/* Referrals list */}
      {referrals.length > 0 && (
        <div>
          <div className="text-xs tracking-widest uppercase text-muted-foreground mb-4">Historia poleceń</div>
          <div className="space-y-2">
            {referrals.map(r => (
              <div key={r.id} className="flex items-center justify-between border border-border px-4 py-3">
                <div>
                  <div className="text-sm text-foreground">{r.referred_name || r.referred_email || 'Oczekuje...'}</div>
                  <div className="text-xs text-muted-foreground">{new Date(r.created_date).toLocaleDateString('pl-PL')}</div>
                </div>
                <span className={`text-xs px-2 py-1 border ${
                  r.status === 'rewarded' ? 'border-gold/40 text-gold' :
                  r.status === 'completed' ? 'border-green-500/30 text-green-500' :
                  'border-border text-muted-foreground'
                }`}>
                  {r.status === 'rewarded' ? 'Nagroda przyznana' :
                   r.status === 'completed' ? 'Zrealizowane' : 'Oczekuje'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}