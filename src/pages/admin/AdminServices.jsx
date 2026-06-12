import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';

const EMPTY = { name: '', description: '', price: '', duration_minutes: '', category: 'relaksacyjny', is_available_home: true, is_available_studio: true, is_active: true };

function ServiceForm({ initial = EMPTY, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  return (
    <div className="border border-gold/20 bg-gold/5 p-6 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="text-bone/40 text-xs tracking-widest uppercase block mb-2">Nazwa *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-transparent border-b border-white/10 py-2 text-bone focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="text-bone/40 text-xs tracking-widest uppercase block mb-2">Kategoria</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full bg-[#111] border-b border-white/10 py-2 text-bone focus:outline-none focus:border-gold">
            {['relaksacyjny', 'terapeutyczny', 'sportowy', 'specjalistyczny'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-bone/40 text-xs tracking-widest uppercase block mb-2">Cena (PLN) *</label>
          <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            className="w-full bg-transparent border-b border-white/10 py-2 text-bone focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="text-bone/40 text-xs tracking-widest uppercase block mb-2">Czas (min) *</label>
          <input type="number" value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))}
            className="w-full bg-transparent border-b border-white/10 py-2 text-bone focus:outline-none focus:border-gold" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-bone/40 text-xs tracking-widest uppercase block mb-2">Opis</label>
          <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full bg-transparent border-b border-white/10 py-2 text-bone focus:outline-none focus:border-gold resize-none" />
        </div>
        <div className="flex gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer text-bone/60 text-sm">
            <input type="checkbox" checked={form.is_available_home} onChange={e => setForm(f => ({ ...f, is_available_home: e.target.checked }))} className="w-4 h-4" />
            Dojazd
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-bone/60 text-sm">
            <input type="checkbox" checked={form.is_available_studio} onChange={e => setForm(f => ({ ...f, is_available_studio: e.target.checked }))} className="w-4 h-4" />
            Salon
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-bone/60 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4" />
            Aktywna
          </label>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => onSave(form)} disabled={!form.name || !form.price}
          className="flex items-center gap-2 bg-gold text-obsidian px-6 py-2.5 text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-all disabled:opacity-40">
          <Check size={14} /> Zapisz
        </button>
        <button onClick={onCancel} className="flex items-center gap-2 border border-white/10 text-bone/40 px-6 py-2.5 text-xs tracking-widest uppercase hover:border-white/20">
          <X size={14} /> Anuluj
        </button>
      </div>
    </div>
  );
}

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    base44.entities.Service.list('sort_order', 50).then(data => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  const handleAdd = async (form) => {
    const created = await base44.entities.Service.create({
      ...form,
      price: Number(form.price),
      duration_minutes: Number(form.duration_minutes),
    });
    setServices(prev => [...prev, created]);
    setAdding(false);
  };

  const handleEdit = async (form) => {
    const updated = await base44.entities.Service.update(editing.id, {
      ...form,
      price: Number(form.price),
      duration_minutes: Number(form.duration_minutes),
    });
    setServices(prev => prev.map(s => s.id === editing.id ? { ...s, ...updated } : s));
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Czy na pewno usunąć tę usługę?')) return;
    await base44.entities.Service.delete(id);
    setServices(prev => prev.filter(s => s.id !== id));
  };

  return (
    <AdminLayout>
      <div className="text-bone">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-bone">Usługi</h1>
            <p className="text-bone/40 text-sm mt-1">Zarządzaj ofertą masaży</p>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 border border-gold/50 text-gold px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all"
          >
            <Plus size={14} /> Dodaj usługę
          </button>
        </div>

        {adding && <ServiceForm onSave={handleAdd} onCancel={() => setAdding(false)} />}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-bone/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {services.map(service => (
              editing?.id === service.id ? (
                <ServiceForm key={service.id} initial={service} onSave={handleEdit} onCancel={() => setEditing(null)} />
              ) : (
                <div key={service.id} className="border border-white/5 bg-white/[0.02] p-5 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-bone">{service.name}</span>
                      {!service.is_active && <span className="text-xs text-bone/30 border border-white/10 px-2 py-0.5">nieaktywna</span>}
                    </div>
                    <div className="text-bone/40 text-xs mt-1 font-mono">
                      {service.price} PLN · {service.duration_minutes} min · {service.category}
                      {service.is_available_home && ' · 🏠'}
                      {service.is_available_studio && ' · 🏢'}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setEditing(service)} className="w-8 h-8 border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(service.id)} className="w-8 h-8 border border-white/10 flex items-center justify-center hover:border-red-400 hover:text-red-400 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}