import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Link2, Check, Mail, MessageSquare, Phone } from 'lucide-react';

const SHARE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://wesolymasaz.pl';
const SHARE_TEXT = encodeURIComponent('Zdecydowanie polecam Wesoły Masaż — profesjonalne masaże z dojazdem i w salonie. Sprawdź: ');
const SHARE_URL_ENC = encodeURIComponent(SHARE_URL);

const channels = [
  {
    label: 'Facebook',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    href: `https://www.facebook.com/sharer/sharer.php?u=${SHARE_URL_ENC}`,
    color: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
  },
  {
    label: 'WhatsApp',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    href: `https://wa.me/?text=${SHARE_TEXT}${SHARE_URL_ENC}`,
    color: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
  },
  {
    label: 'Messenger',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.733 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
      </svg>
    ),
    href: `https://www.facebook.com/dialog/send?link=${SHARE_URL_ENC}&app_id=&redirect_uri=${SHARE_URL_ENC}`,
    color: 'hover:bg-[#00B2FF] hover:text-white hover:border-[#00B2FF]',
  },
  {
    label: 'X',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    href: `https://twitter.com/intent/tweet?text=${SHARE_TEXT}&url=${SHARE_URL_ENC}`,
    color: 'hover:bg-obsidian hover:text-bone hover:border-obsidian',
  },
];

export default function ShareButtons({ compact = false, title = 'Poleć nas znajomym' }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground tracking-widest uppercase mr-1 flex items-center gap-1.5">
          <Share2 size={12} /> Udostępnij
        </span>
        {channels.map((ch) => (
          <a
            key={ch.label}
            href={ch.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ch.label}
            className={`w-9 h-9 flex items-center justify-center border border-border text-muted-foreground transition-all duration-200 ${ch.color}`}
          >
            {ch.icon}
          </a>
        ))}
        <a
          href={`mailto:?subject=${encodeURIComponent('Polecam Wesoły Masaż')}&body=${SHARE_TEXT}${SHARE_URL_ENC}`}
          aria-label="E-mail"
          className="w-9 h-9 flex items-center justify-center border border-border text-muted-foreground hover:bg-gold hover:text-obsidian hover:border-gold transition-all duration-200"
        >
          <Mail size={16} />
        </a>
        <a
          href={`sms:?&body=${SHARE_TEXT}${SHARE_URL_ENC}`}
          aria-label="SMS"
          className="w-9 h-9 flex items-center justify-center border border-border text-muted-foreground hover:bg-gold hover:text-obsidian hover:border-gold transition-all duration-200"
        >
          <MessageSquare size={16} />
        </a>
        <button
          onClick={copyLink}
          aria-label="Kopiuj link"
          className="w-9 h-9 flex items-center justify-center border border-border text-muted-foreground hover:bg-gold hover:text-obsidian hover:border-gold transition-all duration-200"
        >
          {copied ? <Check size={16} className="text-gold" /> : <Link2 size={16} />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-gold text-xs tracking-[0.4em] uppercase flex items-center justify-center gap-2"
        >
          <Share2 size={14} /> Poleć nas
        </motion.span>
        <motion.h3
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="font-display text-3xl lg:text-4xl mt-3 text-foreground"
        >
          {title}
        </motion.h3>
        <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto">
          Podziel się Wesołym Masażem ze znajomymi — może też potrzebują chwili relaksu.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {channels.map((ch, i) => (
          <motion.a
            key={ch.label}
            href={ch.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ch.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className={`w-12 h-12 flex items-center justify-center border border-border text-muted-foreground transition-all duration-200 ${ch.color}`}
          >
            {ch.icon}
          </motion.a>
        ))}
        <motion.a
          href={`mailto:?subject=${encodeURIComponent('Polecam Wesoły Masaż')}&body=${SHARE_TEXT}${SHARE_URL_ENC}`}
          aria-label="E-mail"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45 }}
          className="w-12 h-12 flex items-center justify-center border border-border text-muted-foreground hover:bg-gold hover:text-obsidian hover:border-gold transition-all duration-200"
        >
          <Mail size={20} />
        </motion.a>
        <motion.a
          href={`sms:?&body=${SHARE_TEXT}${SHARE_URL_ENC}`}
          aria-label="SMS"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="w-12 h-12 flex items-center justify-center border border-border text-muted-foreground hover:bg-gold hover:text-obsidian hover:border-gold transition-all duration-200"
        >
          <MessageSquare size={20} />
        </motion.a>
        <motion.button
          onClick={copyLink}
          aria-label="Kopiuj link"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55 }}
          className="w-12 h-12 flex items-center justify-center border border-border text-muted-foreground hover:bg-gold hover:text-obsidian hover:border-gold transition-all duration-200"
        >
          {copied ? <Check size={20} className="text-gold" /> : <Link2 size={20} />}
        </motion.button>
      </div>

      {copied && (
        <span className="text-xs text-gold tracking-widest uppercase">Link skopiowany!</span>
      )}
    </div>
  );
}