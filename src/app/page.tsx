import Hero from '@/components/sections/Hero';
import ServiceOverview from '@/components/sections/ServiceOverview';
import FloatingServiceWidget from '@/components/sections/FloatingServiceWidget';
import RecentWork from '@/components/sections/RecentWork';
import WhyChoose from '@/components/sections/WhyChoose';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import Testimonials from '@/components/sections/Testimonials';
import Partners from '@/components/sections/Partners';
import ContactMini from '@/components/sections/ContactMini';
import CTA from '@/components/sections/CTA';

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <ServiceOverview />
      <WhyChoose />
      <RecentWork />
      <Testimonials />
      <ProcessTimeline />
      <Partners />
      <ContactMini />
      <CTA />
      <FloatingServiceWidget />
    </div>
  );
}
