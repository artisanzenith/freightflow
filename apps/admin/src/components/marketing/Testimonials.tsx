import { Container, SectionHeading } from '@freightflow/ui';

import { site } from '@/config/site';

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by drivers who run the numbers"
          description="Owner-operators and small fleets use FreightFlow to stay organized and profitable."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {site.testimonials.map((t) => (
            <figure
              key={t.author}
              className="flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <blockquote className="text-navy-800">
                <p className="leading-relaxed">“{t.quote}”</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                  {t.author
                    .split(' ')
                    .map((p) => p[0])
                    .join('')}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-navy-900">{t.author}</span>
                  <span className="block text-xs text-neutral-500">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
