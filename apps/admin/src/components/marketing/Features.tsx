import { Container, SectionHeading } from '@freightflow/ui';

import { site } from '@/config/site';
import { FeatureIcon } from './FeatureIcon';

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to run freight"
          description="One workflow for loads, documents, drivers, and money — designed for how small carriers actually operate."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {site.features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <FeatureIcon name={feature.icon} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-navy-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
