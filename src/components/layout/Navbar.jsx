import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Usługi', href: '/#uslugi' },
  { label: 'Jak to działa', href: '/#jak-to-dziala' },
  { label: 'Vouchery', href: '/vouchery' },
  { label: 'Kontakt', href: '/#kontakt' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navBg = scrolled
    ? 'bg-obsidian/95 backdrop-blur-md border-b border-white/5'
    : 'bg-transparent';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group focus-gold">
          <div className="w-8 h-8 border border-gold flex items-center justify-center">
            <span className="font-display text-xs font-semibold text-gold tracking-widest">WM</span>
          </div>
          <span className="font-display text-sm tracking-[0.2em] uppercase text-bone font-medium">
            Wesoły Masaż
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-bone/60 hover:text-bone text-sm tracking-widest uppercase transition-colors duration-300 focus-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/rezerwacja"
            className="gold-outline-btn px-6 py-2.5 text-xs tracking-widest uppercase font-medium focus-gold"
          >
            Zarezerwuj
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden text-bone focus-gold p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-obsidian/98 backdrop-blur-xl border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-bone/70 hover:text-bone text-lg font-display italic transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/rezerwacja"
                className="gold-outline-btn px-6 py-3 text-sm tracking-widest uppercase text-center mt-2"
                onClick={() => setMenuOpen(false)}
              >
                Zarezerwuj wizytę
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}