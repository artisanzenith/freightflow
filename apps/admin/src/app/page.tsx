import { CtaSection } from '@/components/marketing/CtaSection';
import { Faq } from '@/components/marketing/Faq';
import { Features } from '@/components/marketing/Features';
import { Hero } from '@/components/marketing/Hero';
import { Pricing } from '@/components/marketing/Pricing';
import { SiteFooter } from '@/components/marketing/SiteFooter';
import { SiteHeader } from '@/components/marketing/SiteHeader';
import { Testimonials } from '@/components/marketing/Testimonials';

/**
 * Marketing landing page. Content is driven by `@/config/site` and
 * `@/config/pricing`; sections are composed here.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
        <Faq />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
