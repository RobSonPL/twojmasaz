import { motion } from 'framer-motion';
import { Phone, Mail, Award, GraduationCap, Heart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const QUALIFICATIONS = [
  'Dyplom Masażystki — Technikum Medyczne',
  'Kurs masażu klasycznego i relaksacyjnego',
  'Kurs masażu gorącymi kamieniami',
  'Terapia bańką chińską i drenaż limfatyczny',
  'Masaż sportowy i głęboki — certyfikat specjalistyczny',
  'Pierwsza pomoc medyczna — aktualne zaświadczenie',
];

const CERTIFICATES = [
  { year: '2018', title: 'Masaż klasyczny i izometriczny', issuer: 'Akademia Fizjoterapii' },
  { year: '2020', title: 'Masaż gorącymi kamieniami', issuer: 'Institut Terapii Naturalnych' },
  { year: '2021', title: 'Drenaż limfatyczny manualny', issuer: 'Polskie Stowarzyszenie Masażystów' },
  { year: '2022', title: 'Masaż sportowy i regeneracja powysiłkowa', issuer: 'Akademia Sportu' },
  { year: '2023', title: 'Terapia nerwu błędnego i techniki relaksacyjne', issuer: 'Centrum Medycyny Holistycznej' },
];

export default function AboutSection() {
  return (
    <section id="o-mnie" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-5">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gold text-xs tracking-[0.4em] uppercase"
            >
              O mnie
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl lg:text-6xl mt-4 text-foreground"
            >
              Twoja<br />masażystka
            </motion.h2>
          </div>
          <div className="lg:col-span-7 lg:flex lg:items-end lg:pb-4">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-lg max-w-lg"
            >
              Nazywam się Irena. Od ponad sześciu lat pomagam klientom odzyskać spokój ciała i umysłu. Każdy masaż traktuję indywidualnie — dobieram technikę do Twoich potrzeb, czy to głęboka relaksacja, czy praca nad konkretnym napięciem.
            </motion.p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[4/5] overflow-hidden border border-border">
              <img
                src="https://images.unsplash.com/photo-1591343395082-e120087004b7?w=900&q=80&auto=format&fit=crop"
                alt="Irena — masażystka Wesoły Masaż"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-obsidian/80 to-transparent">
                <div className="text-bone font-display text-2xl">Irena</div>
                <div className="text-bone/70 text-xs tracking-widest uppercase mt-1">Certyfikowana masażystka</div>
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-10"
          >
            {/* Story */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart size={14} className="text-gold" />
                <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Moja filozofia</span>
              </div>
              <p className="text-foreground/70 text-base leading-relaxed">
                Wierzę, że dotyk to język, który ciało rozumie najlepiej. Pracuję w pełni obecnie — bez pośpiechu, z szacunkiem do Twoich granic i potrzeb. Stworzyłam Wesoły Masaż, aby każdy mógł doświadczyć profesjonalnej terapii w komforcie własnego domu lub w przytulnym salonie.
              </p>
            </div>

            {/* Qualifications */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <GraduationCap size={14} className="text-gold" />
                <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Kwalifikacje</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {QUALIFICATIONS.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                    <span className="text-gold mt-1.5 w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            {/* Certificates timeline */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Award size={14} className="text-gold" />
                <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Certyfikaty</span>
              </div>
              <div className="space-y-3">
                {CERTIFICATES.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 py-3 border-b border-border/60 last:border-0"
                  >
                    <span className="font-mono text-sm text-gold w-12 flex-shrink-0">{c.year}</span>
                    <div className="flex-1">
                      <div className="text-sm text-foreground font-medium">{c.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{c.issuer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact + gold CTA */}
            <div className="pt-6 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex flex-col gap-2 text-sm">
                  <a href="tel:+48787907141" className="flex items-center gap-2 text-foreground hover:text-gold transition-colors">
                    <Phone size={14} className="text-gold" />
                    <span className="font-mono">+48 787 907 141</span>
                  </a>
                  <a href="mailto:irena@wesolymasaz.pl" className="flex items-center gap-2 text-foreground hover:text-gold transition-colors">
                    <Mail size={14} className="text-gold" />
                    <span>irena@wesolymasaz.pl</span>
                  </a>
                </div>
                <Link
                  to="/rezerwacja"
                  className="sm:ml-auto inline-flex items-center gap-2 bg-gold text-obsidian px-8 py-4 text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300 focus-gold"
                >
                  Zarezerwuj wizytę
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}