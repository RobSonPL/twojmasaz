import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';

export default function HeroSection() {
  const heroRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove);
      return () => hero.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen bg-obsidian flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-obsidian via-obsidian to-[#1a1408]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1800&q=80&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'luminosity',
          }}
        />
        <div className="absolute inset-0 bg-obsidian/60" />
      </div>

      {/* Floating cursor CTA */}
      <motion.div
        className="absolute pointer-events-none z-20 hidden lg:flex"
        animate={{
          x: cursorPos.x - 48,
          y: cursorPos.y - 48,
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="w-24 h-24 rounded-full border border-gold flex items-center justify-center backdrop-blur-sm bg-obsidian/20">
          <span className="text-gold text-xs tracking-widest uppercase text-center leading-tight">
            Rezerwuj<br/>teraz
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[80vh]">

          {/* Left: Big heading */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-6"
            >
              <span className="text-gold text-xs tracking-[0.4em] uppercase font-body">
                ✦ Twoja chwila wytchnienia
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9 }}
              className="font-display text-bone leading-[0.9] mb-8"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 9rem)', letterSpacing: '-0.03em' }}
            >
              STREFA<br />
              <em className="text-gold not-italic">SPOKOJU</em>
            </motion.h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className="h-px bg-gradient-to-r from-gold to-transparent mb-8 max-w-xs"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="text-bone/50 text-lg max-w-md leading-relaxed font-body"
            >
              Profesjonalne masaże z dojazdem do Twojego domu lub w naszym salonie. Rezerwacja online w 60 sekund.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mt-12"
            >
              <Link
                to="/rezerwacja"
                className="group inline-flex items-center gap-3 bg-gold text-obsidian px-8 py-4 text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300 focus-gold"
              >
                Zarezerwuj wizytę
                <ArrowDownRight size={16} className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </Link>
              <a
                href="#uslugi"
                className="gold-outline-btn inline-flex items-center gap-3 px-8 py-4 text-sm tracking-widest uppercase font-medium focus-gold"
              >
                Zobacz usługi
              </a>
            </motion.div>
          </div>

          {/* Right: Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="lg:col-span-5 flex flex-col gap-6 lg:pl-12"
          >
            <div className="border-l border-gold/30 pl-6">
              <div className="font-mono text-4xl text-bone font-medium">4.9</div>
              <div className="text-bone/40 text-xs tracking-widest uppercase mt-1">Średnia ocen klientów</div>
            </div>
            <div className="border-l border-gold/30 pl-6">
              <div className="font-mono text-4xl text-bone font-medium">500+</div>
              <div className="text-bone/40 text-xs tracking-widest uppercase mt-1">Zadowolonych klientów</div>
            </div>
            <div className="border-l border-gold/30 pl-6">
              <div className="font-mono text-4xl text-bone font-medium">6</div>
              <div className="text-bone/40 text-xs tracking-widest uppercase mt-1">Rodzajów masażu</div>
            </div>

            <div className="mt-4 p-6 border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-bone/40 text-xs tracking-widest uppercase">Dostępne terminy</span>
              </div>
              <p className="text-bone/70 text-sm">Dojazd do klienta i salon stacjonarny — wybierz opcję, która Ci odpowiada.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="relative z-10 flex justify-center pb-8"
      >
        <a href="#uslugi" className="flex flex-col items-center gap-2 text-bone/30 hover:text-gold transition-colors group">
          <span className="text-xs tracking-widest uppercase">Przewiń</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-10 bg-gradient-to-b from-bone/30 to-transparent group-hover:from-gold/50"
          />
        </a>
      </motion.div>
    </section>
  );
}