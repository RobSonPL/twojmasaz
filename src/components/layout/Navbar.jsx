import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import { useTheme } from '@/lib/ThemeContext';

const NAV_LINKS = [
  { href: '/#uslugi', label: 'Usługi' },
  { href: '/#jak-to-dziala', label: 'Jak to działa' },
  { href: '/#galeria', label: 'Galeria' },
  { href: '/#opinie', label: 'Opinie' },
  { href: '/vouchery', label: 'Vouchery' },
  { href: '/#kontakt', label: 'Kontakt' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { theme } = useTheme() || { theme: 'light-color' };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  const isHomePage = location.pathname === '/';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-background border-b border-border shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 border border-gold flex items-center justify-center">
            <span className="font-display text-xs font-semibold text-gold tracking-widest">WM</span>
          </div>
          <span
            className="font-display text-sm tracking-[0.2em] uppercase font-medium transition-colors text-foreground"
          >
            Wesoły Masaż
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs tracking-[0.15em] uppercase transition-colors duration-200 text-muted-foreground hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Link
            to="/konto"
            className="hidden md:inline-flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:text-gold hover:border-gold transition-colors"
            title="Moje konto"
          >
            <User size={14} />
          </Link>
          <Link
            to="/rezerwacja"
            className="hidden md:inline-flex items-center gap-2 bg-gold text-obsidian px-5 py-2 text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors duration-300"
          >
            Rezerwuj
          </Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden transition-colors text-foreground"
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-gold transition-colors tracking-widest uppercase"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/konto"
            className="text-sm text-muted-foreground hover:text-gold transition-colors tracking-widest uppercase"
            onClick={() => setMenuOpen(false)}
          >
            Moje konto
          </Link>
          <Link
            to="/rezerwacja"
            className="inline-flex items-center justify-center bg-gold text-obsidian px-5 py-3 text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors"
          >
            Rezerwuj wizytę
          </Link>
        </div>
      )}
    </header>
  );
}