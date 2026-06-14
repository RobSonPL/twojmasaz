import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Settings, MessageSquare, Gift, BarChart2, Menu, X, LogOut, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const navItems = [
  { label: 'Kalendarz', href: '/admin', icon: Calendar },
  { label: 'Usługi', href: '/admin/uslugi', icon: Settings },
  { label: 'Wiadomości', href: '/admin/wiadomosci', icon: MessageSquare },
  { label: 'Vouchery', href: '/admin/vouchery', icon: Gift },
  { label: 'Statystyki', href: '/admin/statystyki', icon: BarChart2 },
  { label: 'Karty SOAP', href: '/admin/soap', icon: FileText },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.me()
      .then(user => {
        if (user?.role === 'admin') {
          setIsAdmin(true);
        } else {
          navigate('/', { replace: true });
        }
      })
      .catch(() => navigate('/login', { replace: true }))
      .finally(() => setAuthChecked(true));
  }, []);

  if (!authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-obsidian">
        <div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-obsidian border-r border-white/5 flex flex-col
        transition-transform duration-300 lg:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="px-6 py-8 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-7 h-7 border border-gold flex items-center justify-center">
              <span className="font-display text-xs text-gold">WM</span>
            </div>
            <span className="font-display text-xs tracking-[0.2em] uppercase text-bone/60">Panel Admina</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-gold/10 text-gold border-l-2 border-gold'
                        : 'text-bone/40 hover:text-bone hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-4 py-6 border-t border-white/5">
          <button
            onClick={() => base44.auth.logout('/')}
            className="flex items-center gap-3 px-4 py-3 text-sm text-bone/30 hover:text-bone/60 transition-colors w-full"
          >
            <LogOut size={16} />
            Wyloguj się
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-obsidian/80 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden sticky top-0 z-20 bg-obsidian border-b border-white/5 px-4 py-4 flex items-center justify-between">
          <span className="font-display text-xs text-bone/60 tracking-wider uppercase">Panel Admina</span>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-bone p-2">
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}