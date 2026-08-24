import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import PageLayout from '@/components/layout/PageLayout';
import HeroSection from '@/components/home/HeroSection';
import B2BSection from '@/components/home/B2BSection';
import ServicesSection from '@/components/home/ServicesSection';
import AIAdvisorSection from '@/components/home/AIAdvisorSection';
import PriceCalculator from '@/components/home/PriceCalculator';
import ReachMapSection from '@/components/home/ReachMapSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import VoucherCTA from '@/components/home/VoucherCTA';
import GallerySection from '@/components/home/GallerySection';
import LoyaltySection from '@/components/home/LoyaltySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FaqSection from '@/components/home/FaqSection';
import ContactSection from '@/components/home/ContactSection';
import ShareButtons from '@/components/home/ShareButtons';
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
      {/* B2B partners */}
      <B2BSection />
      <ServicesSection services={services} />
      <AIAdvisorSection services={services} />
      <PriceCalculator />
      <ReachMapSection />
      <HowItWorksSection />
      <GallerySection />
      <LoyaltySection />
      <VoucherCTA />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
      <section className="section-padding bg-background">
        <ShareButtons title="Poleć Wesoły Masaż znajomym" />
      </section>
      <AssistantChat />
    </PageLayout>
  );
}