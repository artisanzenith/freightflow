import { Accordion, Container, SectionHeading } from '@freightflow/ui';

import { site } from '@/config/site';

export function Faq() {
  return (
    <section id="faq" className="bg-neutral-50 py-24 sm:py-32">
      <Container size="md">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          description="Everything you need to know about getting started with FreightFlow."
        />
        <Accordion
          className="mt-12"
          items={site.faq.map((item) => ({ question: item.question, answer: item.answer }))}
        />
      </Container>
    </section>
  );
}
