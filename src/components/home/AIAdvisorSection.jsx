import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, RotateCcw, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const QUESTIONS = [
  {
    id: 'area',
    label: 'Gdzie czujesz największe napięcie?',
    options: [
      { value: 'kark_szyja', label: 'Kark i szyja' },
      { value: 'plecy', label: 'Plecy (góra/całe)' },
      { value: 'nogi', label: 'Nogi i stopy' },
      { value: 'cale_cialo', label: 'Całe ciało' },
      { value: 'twarz_glowa', label: 'Twarz i głowa' },
    ],
  },
  {
    id: 'goal',
    label: 'Jaki jest Twój główny cel?',
    options: [
      { value: 'relaks', label: 'Głęboki relaks i odprężenie' },
      { value: 'bol_napiecie', label: 'Ulgę w bólu i napięciu' },
      { value: 'regeneracja', label: 'Regeneracja po treningu' },
      { value: 'energia', label: 'Pobudzenie i energia' },
      { value: 'uroda', label: 'Promienny wygląd skóry' },
    ],
  },
  {
    id: 'pressure',
    label: 'Jaką siłę masażu preferujesz?',
    options: [
      { value: 'bardzo_delikatny', label: 'Bardzo delikatny i kojący' },
      { value: 'umiarkowany', label: 'Umiarkowany, zbalansowany' },
      { value: 'gleboki_mocny', label: 'Głęboki i mocny' },
      { value: 'cieplo', label: 'Ciepło kamieni ponad siłę' },
    ],
  },
];

export default function AIAdvisorSection({ services = [] }) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const activeServices = services.length > 0 ? services : [];

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 250);
    } else {
      getRecommendation(newAnswers);
    }
  };

  const getRecommendation = async (allAnswers) => {
    setLoading(true);
    setError(null);
    try {
      const servicesContext = activeServices
        .map(
          (s) =>
            `- ID: ${s.id}, Nazwa: ${s.name}, Kategoria: ${s.category}, Cena: ${s.price} PLN, Czas: ${s.duration_minutes} min, Opis: ${s.description || 'brak'}, Dostępny w salonie: ${s.is_available_studio}, Dostępny z dojazdem: ${s.is_available_home}`
        )
        .join('\n');

      const prompt = `Jesteś ekspertem od masaży w salonie Wesoły Masaż. Na podstawie odpowiedzi klienta rekomenduj JEDEN idealny masaż z poniższej listy usług.

ODPOWIEDZI KLIENTA:
- Obszar napięcia: ${allAnswers.area}
- Cel: ${allAnswers.goal}
- Preferowana siła: ${allAnswers.pressure}

DOSTĘPNE USŁUGI:
${servicesContext}

Zwróć rekomendację w formacie JSON z polami:
- service_id: ID wybranej usługi z listy powyżej
- service_name: nazwa wybranej usługi
- reasoning: 2-3 zdania po polsku, dlaczego ten masaż jest idealny dla tego klienta (zwracaj się bezpośrednio do klienta, używaj "Ty")
- confidence: liczba 0-100 (jak pewna jest rekomendacja)

Wybierz usługę, która najlepiej pasuje do potrzeb klienta.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            service_id: { type: 'string' },
            service_name: { type: 'string' },
            reasoning: { type: 'string' },
            confidence: { type: 'number' },
          },
          required: ['service_id', 'service_name', 'reasoning', 'confidence'],
        },
      });

      setResult(response);
    } catch (e) {
      setError('Nie udało się połączyć z doradcą. Spróbuj ponownie lub przejdź do listy usług.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStarted(false);
    setStep(0);
    setAnswers({});
    setResult(null);
    setError(null);
    setLoading(false);
  };

  // ── Idle state: invitation card
  if (!started) {
    return (
      <section className="section-padding bg-background">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative border border-gold/30 bg-gradient-to-br from-secondary/40 via-background to-secondary/20 p-10 lg:p-16 overflow-hidden group"
          >
            {/* Decorative gold corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-gold/40" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-gold/40" />

            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center w-14 h-14 border border-gold/40 mb-6"
              >
                <Sparkles size={22} className="text-gold" />
              </motion.div>

              <span className="text-gold text-xs tracking-[0.4em] uppercase block mb-4">
                AI Doradca
              </span>

              <h2 className="font-display text-3xl lg:text-5xl text-foreground mb-6 leading-tight">
                Dobierz masaż<br />
                <em className="text-gold not-italic">idealnie dla Ciebie</em>
              </h2>

              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                Nie wiesz, który masaż wybrać? Odpowiedz na 3 krótkie pytania, a nasz AI doradca rekomenduje usługę dopasowaną do Twoich potrzeb.
              </p>

              <button
                onClick={() => setStarted(true)}
                className="inline-flex items-center gap-3 bg-gold text-obsidian px-8 py-4 text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300 focus-gold group"
              >
                Rozpocznij quiz
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // ── Quiz / Result state
  return (
    <section className="section-padding bg-background">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <div className="relative border border-border bg-card p-8 lg:p-12 min-h-[420px] flex flex-col">
          {/* Progress dots */}
          {!result && !error && (
            <div className="flex items-center gap-3 mb-10">
              {QUESTIONS.map((q, i) => (
                <div
                  key={q.id}
                  className={`h-px flex-1 transition-all duration-500 ${
                    i <= step ? 'bg-gold' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Loading state */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <Loader2 size={32} className="text-gold animate-spin mb-6" />
                <span className="text-gold text-xs tracking-[0.4em] uppercase mb-3">
                  AI analizuje Twoje odpowiedzi
                </span>
                <p className="text-muted-foreground text-sm">Dobieram idealny masaż…</p>
              </motion.div>
            )}

            {/* Error state */}
            {error && !loading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <p className="text-muted-foreground mb-8 max-w-sm">{error}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => getRecommendation(answers)}
                    className="inline-flex items-center gap-2 bg-gold text-obsidian px-6 py-3 text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors"
                  >
                    Spróbuj ponownie
                  </button>
                  <Link
                    to="/rezerwacja"
                    className="inline-flex items-center gap-2 gold-outline-btn px-6 py-3 text-xs tracking-widest uppercase font-medium"
                  >
                    Przejdź do rezerwacji
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Result state */}
            {result && !loading && !error && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col"
              >
                <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4">
                  Twoja rekomendacja
                </span>

                <h3 className="font-display text-4xl lg:text-5xl text-foreground mb-2 leading-tight">
                  {result.service_name}
                </h3>

                {result.confidence && (
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-1 w-24 bg-border overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="h-full bg-gold"
                      />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {result.confidence}% dopasowania
                    </span>
                  </div>
                )}

                <p className="text-muted-foreground text-lg leading-relaxed mb-8 flex-1">
                  {result.reasoning}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to={`/rezerwacja?service=${result.service_id}`}
                    className="inline-flex items-center gap-3 bg-gold text-obsidian px-8 py-4 text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300 group"
                  >
                    Rezerwuj ten masaż
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 gold-outline-btn px-6 py-4 text-sm tracking-widest uppercase font-medium"
                  >
                    <RotateCcw size={14} />
                    Wypełnij ponownie
                  </button>
                </div>
              </motion.div>
            )}

            {/* Quiz question */}
            {!result && !loading && !error && (
              <motion.div
                key={`q-${step}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col"
              >
                <span className="font-mono text-xs text-muted-foreground mb-3">
                  Pytanie {step + 1} z {QUESTIONS.length}
                </span>
                <h3 className="font-display text-2xl lg:text-3xl text-foreground mb-8 leading-tight">
                  {QUESTIONS[step].label}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {QUESTIONS[step].options.map((opt, i) => (
                    <motion.button
                      key={opt.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleAnswer(QUESTIONS[step].id, opt.value)}
                      className={`text-left p-4 border border-border hover:border-gold hover:bg-secondary/40 transition-all duration-300 group ${
                        answers[QUESTIONS[step].id] === opt.value ? 'border-gold bg-secondary/40' : ''
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        <span className="text-foreground text-sm font-medium">{opt.label}</span>
                        <ArrowRight
                          size={14}
                          className="text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all"
                        />
                      </span>
                    </motion.button>
                  ))}
                </div>

                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="mt-6 text-xs text-muted-foreground hover:text-gold transition-colors tracking-widest uppercase self-start"
                  >
                    ← Wstecz
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}