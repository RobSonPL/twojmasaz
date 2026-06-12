import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import PageLayout from '@/components/layout/PageLayout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import VoucherCTA from '@/components/home/VoucherCTA';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    base44.entities.Service.filter({ is_active: true }, 'sort_order', 20)
      .then(data => { if (data.length > 0) setServices(data); })
      .catch(() => {});
  }, []);

  return (
    <PageLayout dark>
      <HeroSection />
      <ServicesSection services={services} />
      <HowItWorksSection />
      <VoucherCTA />
      <TestimonialsSection />
      <ContactSection />
    </PageLayout>
  );
}