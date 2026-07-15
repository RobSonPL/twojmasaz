import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQ_ITEMS = [
  {
    category: 'Dojazd',
    question: 'Do jakich miejsc dojeżdżacie?',
    answer: 'Dojeżdżamy do klientów w promieniu do 50 km od Jaczkowic. Po przekroczeniu tego dystansu doliczamy dodatkową opłatę za kilometr. Dokładny koszt dojazdu zostanie podany podczas rezerwacji na podstawie podanego adresu.',
  },
  {
    category: 'Dojazd',
    question: 'Co przygotować przed przyjazdem masażysty?',
    answer: 'Przygotuj wystarczająco przestrzenne miejsce (min. 2 × 3 m), czysty ręcznik i luźne ubranie. Pamiętaj o przewietrzeniu pomieszczenia, ale nie chłodnym — temperatura powinna być komfortowa. Masażysta przywozi ze sobą profesjonalny stół, olejki i muzykę relaksacyjną.',
  },
  {
    category: 'Dojazd',
    question: 'Ile trwa dojazd do mnie?',
    answer: 'Czas dojazdu zależy od odległości — zazwyczaj od 20 do 60 minut. Masażysta przyjeżdża na miejsce około 10 minut przed wyznaczoną godziną, aby przygotować sprzęt. W rezerwacji podaj dokładny adres, a my potwierdzimy czas przyjazdu.',
  },
  {
    category: 'Płatność',
    question: 'Jakie są formy płatności?',
    answer: 'Akceptujemy płatność gotówką oraz kartą bezpośrednio po masażu. Vouchery i pakiety można opłacić online kartą przez bezpieczny system Stripe. Możliwa jest również płatność BLIK przy rezerwacji online.',
  },
  {
    category: 'Płatność',
    question: 'Kiedy płacę za masaż?',
    answer: 'Płatność następuje po zakończeniu masażu, bezpośrednio u masażysty. W przypadku voucherów i pakietów płatność realizowana jest online przed rezerwacją terminu wizyt.',
  },
  {
    category: 'Płatność',
    question: 'Czy mogę kupić voucher jako prezent?',
    answer: 'Tak! Vouchery dostępne są na konkretną usługę lub dowolną kwotę. Możesz dodać dedykację dla obdarowanego. Voucher ważny jest 12 miesięcy i wysyłamy go w formie eleganckiego PDF z unikalnym kodem.',
  },
  {
    category: 'Przygotowanie',
    question: 'Jak przygotować się do masażu?',
    answer: 'Na 2 godziny przed masażem zjedź lekki posiłek i unikaj obfitych dań. Pij dużo wody. Przed wizytą weź ciepły prysznic, aby rozgrzać mięśnie. Zdejmij biżuterię i załóż luźne, wygodne ubranie.',
  },
  {
    category: 'Przygotowanie',
    question: 'Czy mam się rozebrać przed masażem?',
    answer: 'Masażysta wychodzi na moment, abyś mógł się przygotować. Na masaż relaksacyjny rozbierasz się do poziomu komfortu — pozostawiasz bieliznę, a masażysta przykrywa części ciała ręcznikiem. Twoja prywatność i intymność są zawsze zachowane.',
  },
  {
    category: 'Przygotowanie',
    question: 'Czy przed masażem muszę skonsultować się z lekarzem?',
    answer: 'Przed pierwszym masażem wypełnisz krótki formularz zdrowotny. Jeśli masz przewlekłe schorzenia, świeże urazy, jesteś w ciąży lub przyjmujesz leki, skonsultuj się z lekarzem. Masażysta dobierze techniki i intensywność do Twojego stanu zdrowia.',
  },
];

const CATEGORY_COLORS = {
  'Dojazd': 'text-blue-600',
  'Płatność': 'text-green-600',
  'Przygotowanie': 'text-gold',
};

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-6 text-left group"
      >
        <div className="flex-1">
          <span className={`text-xs tracking-[0.25em] uppercase mb-2 block ${CATEGORY_COLORS[item.category] || 'text-muted-foreground'}`}>
            {item.category}
          </span>
          <h3 className={`font-display text-lg transition-colors ${open ? 'text-gold' : 'text-foreground group-hover:text-gold'}`}>
            {item.question}
          </h3>
        </div>
        <div className="flex-shrink-0 mt-1">
          {open ? (
            <Minus size={20} className="text-gold" />
          ) : (
            <Plus size={20} className="text-muted-foreground group-hover:text-gold transition-colors" />
          )}
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-muted-foreground leading-relaxed pr-10">
          {item.answer}
        </p>
      </motion.div>
    </div>
  );
}

export default function FaqSection() {
  return (
    <section className="py-20 lg:py-28 px-6 lg:px-12 bg-background">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-xs tracking-[0.4em] uppercase">FAQ</span>
          <h2 className="font-display text-4xl lg:text-5xl mt-3 text-foreground">
            Najczęściej zadawane pytania
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Wszystko, co warto wiedzieć o dojeździe, płatnościach i przygotowaniu do masażu.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem key={i} item={item} index={i} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12 pt-8 border-t border-border"
        >
          <p className="text-muted-foreground mb-4 text-sm">
            Nie znalazłeś odpowiedzi na swoje pytanie?
          </p>
          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 text-gold text-sm tracking-widest uppercase hover:text-gold-light transition-colors"
          >
            Skontaktuj się z nami →
          </a>
        </motion.div>
      </div>
    </section>
  );
}