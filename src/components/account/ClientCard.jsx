import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, CreditCard, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';

const LOYALTY_GOAL = 5;

export default function ClientCard({ user, completedCount, cyclesCompleted }) {
  const [generating, setGenerating] = useState(false);
  const cyclePosition = completedCount % LOYALTY_GOAL;
  const memberSince = user?.created_date
    ? new Date(user.created_date).toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })
    : '—';

  const generatePDF = async () => {
    setGenerating(true);

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85, 55] });

    // Background
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 85, 55, 'F');

    // Gold border
    doc.setDrawColor(201, 169, 110);
    doc.setLineWidth(0.4);
    doc.rect(2, 2, 81, 51);

    // Header logo text
    doc.setTextColor(201, 169, 110);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('WESOŁY MASAŻ', 5, 9);

    doc.setTextColor(250, 250, 250);
    doc.setFontSize(5);
    doc.setFont('helvetica', 'normal');
    doc.text('KARTA KLIENTA', 5, 13);

    // Divider
    doc.setDrawColor(201, 169, 110);
    doc.setLineWidth(0.2);
    doc.line(5, 15, 80, 15);

    // Client name
    doc.setTextColor(250, 250, 250);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(user?.full_name || 'Klient', 5, 23);

    // Email
    doc.setFontSize(5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(user?.email || '', 5, 27);

    // Member since
    doc.setTextColor(201, 169, 110);
    doc.setFontSize(5);
    doc.text(`Klient od: ${memberSince}`, 5, 32);

    // Stats
    doc.setTextColor(250, 250, 250);
    doc.setFontSize(6);
    doc.text(`Wizyty: ${completedCount}`, 5, 38);
    doc.text(`Darmowe: ${cyclesCompleted}`, 5, 43);

    // Loyalty progress dots
    const dotY = 47;
    const dotStartX = 40;
    for (let i = 0; i < LOYALTY_GOAL; i++) {
      const filled = i < cyclePosition;
      if (filled) {
        doc.setFillColor(201, 169, 110);
        doc.circle(dotStartX + i * 7, dotY, 2, 'F');
      } else {
        doc.setDrawColor(201, 169, 110);
        doc.setLineWidth(0.3);
        doc.circle(dotStartX + i * 7, dotY, 2);
      }
    }
    // Gift dot
    doc.setDrawColor(201, 169, 110);
    doc.circle(dotStartX + LOYALTY_GOAL * 7, dotY, 2.5);
    doc.setTextColor(201, 169, 110);
    doc.setFontSize(4);
    doc.text('🎁', dotStartX + LOYALTY_GOAL * 7 - 1.5, dotY + 1);

    // Bottom
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(4);
    doc.text('884 060 680  ·  wesoly-masaz.pl', 5, 52);

    doc.save(`karta-klienta-${user?.full_name?.replace(/\s+/g, '-') || 'WM'}.pdf`);
    setGenerating(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      {/* Visual card */}
      <div className="relative bg-obsidian border border-gold/30 p-6 aspect-[1.6/1] max-w-sm flex flex-col justify-between overflow-hidden mb-4">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)',
            backgroundSize: '6px 6px',
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 border border-gold flex items-center justify-center">
              <span className="text-gold text-xs font-bold">WM</span>
            </div>
            <span className="text-bone/40 text-xs tracking-[0.3em] uppercase font-display">Wesoły Masaż</span>
          </div>
          <div className="text-bone/20 text-xs tracking-widest uppercase">Karta klienta</div>
        </div>
        <div className="relative">
          <div className="text-bone font-display text-lg mb-0.5">{user?.full_name || 'Klient'}</div>
          <div className="text-bone/40 text-xs mb-3">{user?.email}</div>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: LOYALTY_GOAL }, (_, i) => (
              <div key={i} className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs transition-all`}
                style={{
                  borderColor: i < cyclePosition ? '#C9A96E' : 'rgba(255,255,255,0.15)',
                  backgroundColor: i < cyclePosition ? '#C9A96E' : 'transparent',
                  color: i < cyclePosition ? '#0A0A0A' : 'rgba(255,255,255,0.3)',
                  fontSize: '9px',
                  fontWeight: 700,
                }}>
                {i < cyclePosition ? '✓' : i + 1}
              </div>
            ))}
            <div className="w-5 h-5 rounded-full border border-gold/30 flex items-center justify-center text-xs">🎁</div>
          </div>
          <div className="absolute bottom-0 right-0 text-right">
            <div className="text-gold font-mono text-xs">{completedCount} wizyt</div>
            <div className="text-bone/20 text-xs">od {memberSince}</div>
          </div>
        </div>
      </div>

      <button
        onClick={generatePDF}
        disabled={generating}
        className="flex items-center gap-2 border border-gold text-gold px-6 py-3 text-xs tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all duration-300 disabled:opacity-50"
      >
        {generating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        {generating ? 'Generuję PDF...' : 'Pobierz kartę PDF'}
      </button>
      <p className="text-xs text-muted-foreground mt-2">Pobierz kartę klienta do portfela lub wydrukuj.</p>
    </motion.div>
  );
}