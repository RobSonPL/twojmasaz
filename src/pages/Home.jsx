import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import PageLayout from '@/components/layout/PageLayout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import VoucherCTA from '@/components/home/VoucherCTA';
import GallerySection from '@/components/home/GallerySection';
import LoyaltySection from '@/components/home/LoyaltySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FaqSection from '@/components/home/FaqSection';
import ContactSection from '@/components/home/ContactSection';
import AssistantChat from '@/components/chat/AssistantChat';

export default function Home() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    base44.entities.Service.filter({ is_active: true }, 'sort_order', 20)
      .then(data => { if (data.length > 0) setServices(data); })
      .catch(() => {});
  }, []);

  return (
    <PageLayout>
      <HeroSection />
      <ServicesSection services={services} />
      <HowItWorksSection />
      <GallerySection />
      <LoyaltySection />
      <VoucherCTA />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
      <AssistantChat />
    </PageLayout>
  );
}