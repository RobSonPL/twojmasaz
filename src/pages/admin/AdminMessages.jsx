import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Mail, Phone, Check, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    base44.entities.ContactMessage.list('-created_date', 100).then(data => {
      setMessages(data);
      setLoading(false);
    });
  }, []);

  const markRead = async (id) => {
    await base44.entities.ContactMessage.update(id, { status: 'read' });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m));
  };

  const STATUS = { new: 'Nowa', read: 'Przeczytana', replied: 'Odpowiedziano' };
  const STATUS_COLOR = { new: 'text-gold', read: 'text-bone/40', replied: 'text-green-400' };

  return (
    <AdminLayout>
      <div className="text-bone">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-bone">Wiadomości</h1>
          <p className="text-bone/40 text-sm mt-1">Zapytania kontaktowe od klientów</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-bone/20 border-t-gold rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="border border-white/5 p-12 text-center text-bone/20 text-sm">
                Brak wiadomości
              </div>
            ) : messages.map(msg => (
              <button
                key={msg.id}
                onClick={() => { setSelected(msg); markRead(msg.id); }}
                className={`w-full text-left border p-5 transition-all duration-200 ${
                  selected?.id === msg.id ? 'border-gold/40 bg-gold/5' : 'border-white/5 hover:border-white/10 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium text-bone">{msg.name}</span>
                  <span className={`text-xs font-mono ${STATUS_COLOR[msg.status]}`}>{STATUS[msg.status]}</span>
                </div>
                <p className="text-bone/40 text-sm line-clamp-2">{msg.message}</p>
                <div className="text-bone/20 text-xs mt-2 font-mono">
                  {msg.created_date ? format(parseISO(msg.created_date), 'd MMM yyyy', { locale: pl }) : '—'}
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          {selected ? (
            <div className="border border-white/5 bg-white/[0.02] p-8">
              <h3 className="font-display text-xl text-bone mb-6">{selected.name}</h3>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-bone/50">
                  <Mail size={14} className="text-gold" />
                  <a href={`mailto:${selected.email}`} className="hover:text-gold transition-colors">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-3 text-sm text-bone/50">
                    <Phone size={14} className="text-gold" />
                    <a href={`tel:${selected.phone}`} className="hover:text-gold transition-colors">{selected.phone}</a>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-bone/50">
                  <Clock size={14} className="text-gold" />
                  {selected.created_date ? format(parseISO(selected.created_date), 'd MMMM yyyy, HH:mm', { locale: pl }) : '—'}
                </div>
              </div>
              <div className="border-t border-white/5 pt-6">
                <p className="text-bone/70 leading-relaxed">{selected.message}</p>
              </div>
              <div className="mt-8 flex gap-3">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 bg-gold text-obsidian px-6 py-3 text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-all"
                >
                  <Mail size={14} /> Odpowiedz e-mailem
                </a>
                {selected.phone && (
                  <a
                    href={`https://wa.me/${selected.phone?.replace(/\D/g,'')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-white/10 text-bone/50 px-6 py-3 text-xs tracking-widest uppercase hover:border-gold hover:text-gold transition-all"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="border border-white/5 p-12 flex items-center justify-center">
              <span className="text-bone/20 text-sm">Wybierz wiadomość, aby zobaczyć szczegóły</span>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}