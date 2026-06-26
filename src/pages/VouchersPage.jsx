import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import PageLayout from '@/components/layout/PageLayout';


import VoucherBuilder from '@/components/voucher/VoucherBuilder';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { Gift } from 'lucide-react';

export default function VouchersPage() {
  const { isAuthenticated, navigateToLogin } = useAuth();
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
          {isAuthenticated ? (
            <VoucherBuilder services={services} />
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
              <div className="max-w-md mx-auto border border-border bg-secondary/20 p-8">
                <Gift size={48} className="text-gold mx-auto mb-4" />
                <h3 className="font-display text-2xl text-foreground mb-2">Voucher prezentowy</h3>
                <p className="text-muted-foreground mb-6">
                  Personalizowany voucher na kwotę lub konkretną usługę. Zaloguj się, aby kupić.
                </p>
                <button
                  onClick={navigateToLogin}
                  className="bg-foreground text-background px-10 py-4 text-sm tracking-widest uppercase hover:bg-gold hover:text-obsidian transition-all duration-300"
                >
                  Zaloguj się
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}