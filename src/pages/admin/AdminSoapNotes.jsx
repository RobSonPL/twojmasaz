import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, ChevronDown, ChevronUp, X, Save, FileText } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

const EMPTY_NOTE = {
  client_name: '',
  client_email: '',
  visit_date: new Date().toISOString().split('T')[0],
  service_name: '',
  subjective: '',
  objective: '',
  assessment: '',
  plan: '',
  therapist_notes: '',
};

function NoteForm({ initial = EMPTY_NOTE, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.client_email || !form.visit_date) return;
    setSaving(true);
    if (form.id) {
      await base44.entities.SoapNote.update(form.id, form);
    } else {
      await base44.entities.SoapNote.create(form);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="border border-gold/30 bg-card p-6 mb-6">
      <h3 className="font-display text-xl text-foreground mb-6">
        {form.id ? 'Edytuj notatkę SOAP' : 'Nowa notatka SOAP'}
      </h3>

      {/* Client info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs tracking-widest uppercase text-muted-foreground mb-1 block">Imię i nazwisko *</label>
          <input value={form.client_name} onChange={e => set('client_name', e.target.value)}
            className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground focus:outline-none focus:border-gold" placeholder="Jan Kowalski" />
        </div>
        <div>
          <label className="text-xs tracking-widest uppercase text-muted-foreground mb-1 block">E-mail *</label>
          <input type="email" value={form.client_email} onChange={e => set('client_email', e.target.value)}
            className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground focus:outline-none focus:border-gold" placeholder="jan@example.com" />
        </div>
        <div>
          <label className="text-xs tracking-widest uppercase text-muted-foreground mb-1 block">Data wizyty *</label>
          <input type="date" value={form.visit_date} onChange={e => set('visit_date', e.target.value)}
            className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground focus:outline-none focus:border-gold" />
        </div>
      </div>
      <div className="mb-6">
        <label className="text-xs tracking-widest uppercase text-muted-foreground mb-1 block">Usługa</label>
        <input value={form.service_name} onChange={e => set('service_name', e.target.value)}
          className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground focus:outline-none focus:border-gold" placeholder="np. Masaż relaksacyjny 60 min" />
      </div>

      {/* SOAP fields */}
      <div className="space-y-5 mb-6">
        {[
          { key: 'subjective', label: 'S — Subiektywne', placeholder: 'Co mówi klient? Skargi, odczucia, cel wizyty...' },
          { key: 'objective', label: 'O — Obiektywne', placeholder: 'Obserwacje terapeuty: napięcia, zakres ruchu, obszary bólowe...' },
          { key: 'assessment', label: 'A — Ocena', placeholder: 'Wnioski i diagnoza terapeutyczna...' },
          { key: 'plan', label: 'P — Plan', placeholder: 'Zalecenia, kolejne kroki, techniki do zastosowania...' },
          { key: 'therapist_notes', label: 'Notatki prywatne', placeholder: 'Dodatkowe notatki (widoczne tylko dla terapeuty)...' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="text-xs tracking-widest uppercase text-muted-foreground mb-1 block">
              <span className="text-gold">{label.split('—')[0]}</span>{label.includes('—') ? '—' + label.split('—')[1] : ''}
            </label>
            <textarea rows={3} value={form[key]} onChange={e => set(key, e.target.value)}
              className="w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold resize-none transition-colors"
              placeholder={placeholder} />
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving || !form.client_email || !form.visit_date}
          className="flex items-center gap-2 bg-gold text-obsidian px-6 py-2.5 text-xs tracking-widest uppercase font-medium hover:bg-gold-light disabled:opacity-40 transition-colors">
          <Save size={14} />
          {saving ? 'Zapisuję...' : 'Zapisz notatkę'}
        </button>
        <button onClick={onCancel} className="flex items-center gap-2 border border-border px-6 py-2.5 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
          <X size={14} /> Anuluj
        </button>
      </div>
    </div>
  );
}

function NoteCard({ note, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border hover:border-gold/40 transition-colors">
      <div className="flex items-center justify-between px-5 py-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-8 h-8 border border-gold/30 flex items-center justify-center flex-shrink-0">
            <FileText size={14} className="text-gold" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground">{note.client_name || note.client_email}</div>
            <div className="text-xs text-muted-foreground">{note.visit_date} · {note.service_name || 'Brak usługi'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={e => { e.stopPropagation(); onEdit(note); }}
            className="text-xs text-muted-foreground hover:text-gold transition-colors tracking-widest uppercase px-2 py-1 border border-transparent hover:border-gold/30">
            Edytuj
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(note.id); }}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1">
            <X size={12} />
          </button>
          {expanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="border-t border-border overflow-hidden">
            <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'S — Subiektywne', value: note.subjective },
                { label: 'O — Obiektywne', value: note.objective },
                { label: 'A — Ocena', value: note.assessment },
                { label: 'P — Plan', value: note.plan },
                { label: 'Notatki prywatne', value: note.therapist_notes },
              ].filter(f => f.value).map(({ label, value }) => (
                <div key={label} className="sm:col-span-1">
                  <div className="text-xs tracking-widest uppercase text-gold mb-1">{label}</div>
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminSoapNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.SoapNote.list('-visit_date', 100);
    setNotes(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Usunąć tę notatkę?')) return;
    await base44.entities.SoapNote.delete(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditNote(null);
    load();
  };

  const filtered = notes.filter(n =>
    !search || n.client_name?.toLowerCase().includes(search.toLowerCase()) ||
    n.client_email?.toLowerCase().includes(search.toLowerCase())
  );

  const uniqueClients = new Set(notes.map(n => n.client_email)).size;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <span className="text-gold text-xs tracking-[0.4em] uppercase">Panel admina</span>
            <h1 className="font-display text-3xl text-foreground mt-1">Karty klientów SOAP</h1>
          </div>
          <button onClick={() => { setEditNote(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-gold text-obsidian px-5 py-2.5 text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors">
            <Plus size={14} /> Nowa notatka
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Notatek łącznie', value: notes.length },
            { label: 'Unikalnych klientów', value: uniqueClients },
            { label: 'W tym miesiącu', value: notes.filter(n => n.visit_date?.startsWith(new Date().toISOString().slice(0, 7))).length },
          ].map((s, i) => (
            <div key={i} className="border border-border p-4 text-center">
              <div className="font-mono text-2xl text-gold mb-1">{s.value}</div>
              <div className="text-xs text-muted-foreground tracking-widest uppercase">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <NoteForm
            initial={editNote || EMPTY_NOTE}
            onSave={handleSaved}
            onCancel={() => { setShowForm(false); setEditNote(null); }}
          />
        )}

        {/* Search */}
        <div className="flex items-center gap-3 border border-border px-4 py-3 mb-6">
          <Search size={14} className="text-muted-foreground flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Szukaj po imieniu lub e-mailu..."
            className="flex-1 bg-transparent text-sm text-foreground focus:outline-none" />
        </div>

        {/* Notes list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-border border-t-gold rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-border">
            <FileText size={32} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{search ? 'Brak wyników wyszukiwania.' : 'Brak notatek SOAP. Utwórz pierwszą.'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(note => (
              <NoteCard key={note.id} note={note} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}