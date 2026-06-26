import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layout/PageLayout';
import PackageCard from '@/components/packages/PackageCard';
import PackageBuyModal from '@/components/packages/PackageBuyModal';

export default function PackagesPage() {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.PackageTemplate.filter({ is_active: true }, 'price', 20)
      .then(data => setTemplates(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="min-h-screen bg-background pt-28 pb-24 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <span className="text-gold text-xs tracking-[0.4em] uppercase">Karnety masażowe</span>
            <h1 className="font-display text-4xl lg:text-6xl mt-4 text-foreground">
              Pakiety<br />zabiegowe
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl">
              Kup pakiet i oszczędzaj. Każdy karnet to przedpłacona seria wizyt — wygodniej, taniej, bez bariery decyzji przy każdej rezerwacji.
            </p>
            <div className="luminous-rule mt-6 max-w-xs" />
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-border border-t-gold rounded-full animate-spin" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-24 border border-border">
              <p className="text-muted-foreground">Brak dostępnych pakietów. Zapytaj nas o indywidualną ofertę.</p>
              <a
                href="https://wa.me/48787907141?text=Cześć!%20Pytam%20o%20pakiety%20masaży."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 px-8 py-3 text-sm tracking-widest uppercase text-white"
                style={{ backgroundColor: '#25D366' }}
              >
                Napisz do nas
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((t, i) => (
                <PackageCard key={t.id} template={t} index={i} onBuy={() => setSelected(t)} />
              ))}
            </div>
          )}

          {/* Info section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border pt-16">
            {[
              { title: 'Ważność 12 miesięcy', desc: 'Karnety ważne rok od daty zakupu — korzystaj we własnym tempie.' },
              { title: 'Elastyczna rezerwacja', desc: 'Każdą wizytę z karnetu możesz umówić online lub telefonicznie.' },
              { title: 'Bez przepadania', desc: 'Niewykorzystane wizyty możesz przekazać bliskiej osobie.' },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-gold text-xs tracking-widest uppercase mb-2">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="font-display text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <PackageBuyModal template={selected} onClose={() => setSelected(null)} />
      )}
    </PageLayout>
  );
}