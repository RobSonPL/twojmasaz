import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import PageLayout from '@/components/layout/PageLayout';
import VoucherBuilder from '@/components/voucher/VoucherBuilder';
import { motion } from 'framer-motion';

export default function VouchersPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    base44.entities.Service.filter({ is_active: true }, 'sort_order', 30)
      .then(data => setServices(data))
      .catch(() => {});
  }, []);

  return (
    <PageLayout>
      <div className="min-h-screen bg-background pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <span className="text-gold text-xs tracking-[0.4em] uppercase">Prezenty</span>
            <h1 className="font-display text-4xl lg:text-6xl mt-4 text-foreground">
              Vouchery<br />
              <em className="text-gold">prezentowe</em>
            </h1>
            <p className="text-muted-foreground text-lg mt-6 max-w-lg">
              Podaruj komuś wyjątkową chwilę relaksu. Personalizowany voucher — na kwotę lub konkretną usługę — wysyłany na e-mail i WhatsApp.
            </p>
            <div className="luminous-rule mt-6 max-w-xs" style={{ height: '1px' }} />
          </motion.div>

          {/* Builder */}
          <VoucherBuilder services={services} />
        </div>
      </div>
    </PageLayout>
  );
}