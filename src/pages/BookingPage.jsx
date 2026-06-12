import PageLayout from '@/components/layout/PageLayout';
import BookingWizard from '@/components/booking/BookingWizard';
import { motion } from 'framer-motion';

export default function BookingPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-bone pt-24 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <span className="text-gold text-xs tracking-[0.4em] uppercase">Rezerwacja online</span>
            <h1 className="font-display text-4xl lg:text-6xl mt-4 text-obsidian">
              Zarezerwuj<br />wizytę
            </h1>
            <div className="luminous-rule mt-6 max-w-xs" style={{ height: '1px' }} />
          </motion.div>

          {/* Wizard */}
          <BookingWizard />
        </div>
      </div>
    </PageLayout>
  );
}