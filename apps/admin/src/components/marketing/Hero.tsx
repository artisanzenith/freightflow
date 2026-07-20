import Link from 'next/link';
import { Badge, Button, Container } from '@freightflow/ui';

import { site } from '@/config/site';

export function Hero() {
  const { hero } = site;

  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      {/* Decorative grid + glow */}
      <div className="pointer-events-none absolute inset-0 bg-grid-navy [background-size:40px_40px] opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-600/30 blur-3xl" />

      <Container className="relative">
        <div className="mx-auto max-w-3xl py-24 text-center sm:py-32">
          <div className="flex justify-center animate-fade-in">
            <Badge variant="accent">{hero.badge}</Badge>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight animate-fade-in-up sm:text-6xl">
            {hero.title}{' '}
            <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
              {hero.highlight}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-navy-100 animate-fade-in-up">
            {hero.subtitle}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 animate-fade-in-up sm:flex-row">
            <Link href={hero.primaryCta.href}>
              <Button size="lg" className="shadow-glow">
                {hero.primaryCta.label}
              </Button>
            </Link>
            <a href={hero.secondaryCta.href}>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                {hero.secondaryCta.label}
              </Button>
            </a>
          </div>

          <dl className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-8">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-3xl font-bold text-white">{stat.value}</span>
                  <span className="mt-1 block text-sm text-navy-200">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
