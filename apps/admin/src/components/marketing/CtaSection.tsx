import Link from 'next/link';
import { Button, Container } from '@freightflow/ui';

import { site } from '@/config/site';

export function CtaSection() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-600/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to run your dispatch the easy way?
            </h2>
            <p className="mt-4 text-lg text-navy-100">
              Start your free trial today. Set up in minutes — no credit card required.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="shadow-glow">
                  {site.hero.primaryCta.label}
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  Log in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
