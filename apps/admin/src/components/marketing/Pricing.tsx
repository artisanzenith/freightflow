'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge, Button, Container, SectionHeading, cn } from '@freightflow/ui';

import { pricing, type BillingInterval, type PricingTier } from '@/config/pricing';

function formatPrice(tier: PricingTier, interval: BillingInterval): string {
  const amount = interval === 'monthly' ? tier.priceMonthly : tier.priceAnnual;
  if (amount === null) return 'Custom';
  return `$${amount}`;
}

function CheckIcon({ included }: { included: boolean }) {
  return included ? (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  ) : (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-neutral-300"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Pricing() {
  const [interval, setInterval] = useState<BillingInterval>('monthly');

  return (
    <section id="pricing" className="bg-neutral-50 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, per-truck pricing"
          description="Start free. Scale as you add trucks. No long-term contracts."
        />

        {/* Billing interval toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <span
            className={cn(
              'text-sm font-medium',
              interval === 'monthly' ? 'text-navy-900' : 'text-neutral-500',
            )}
          >
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={interval === 'annual'}
            aria-label="Toggle annual billing"
            onClick={() => setInterval((v) => (v === 'monthly' ? 'annual' : 'monthly'))}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
              interval === 'annual' ? 'bg-brand-600' : 'bg-neutral-300',
            )}
          >
            <span
              className={cn(
                'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                interval === 'annual' ? 'translate-x-5' : 'translate-x-0.5',
              )}
            />
          </button>
          <span className="flex items-center gap-2">
            <span
              className={cn(
                'text-sm font-medium',
                interval === 'annual' ? 'text-navy-900' : 'text-neutral-500',
              )}
            >
              Annual
            </span>
            <Badge variant="success">{pricing.annualDiscountLabel}</Badge>
          </span>
        </div>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-3">
          {pricing.tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'relative flex h-full flex-col rounded-3xl border bg-white p-8',
                tier.featured
                  ? 'border-brand-600 shadow-xl lg:-mt-4 lg:mb-4'
                  : 'border-neutral-200 shadow-sm',
              )}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="brand">Most popular</Badge>
                </div>
              )}

              <h3 className="text-lg font-semibold text-navy-900">{tier.name}</h3>
              <p className="mt-1 text-sm text-neutral-500">{tier.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-navy-900">
                  {formatPrice(tier, interval)}
                </span>
                <span className="text-sm text-neutral-500">/ {tier.unit}</span>
              </div>

              <Link href="/register" className="mt-6 block">
                <Button variant={tier.featured ? 'primary' : 'outline'} fullWidth>
                  {tier.cta}
                </Button>
              </Link>

              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => {
                  const included = feature.included ?? true;
                  return (
                    <li
                      key={feature.label}
                      className={cn(
                        'flex gap-3 text-sm',
                        included ? 'text-neutral-700' : 'text-neutral-400',
                      )}
                    >
                      <CheckIcon included={included} />
                      <span>{feature.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-neutral-500">
          Prices in {pricing.currency}. Annual plans are billed yearly at the discounted monthly
          rate.
        </p>
      </Container>
    </section>
  );
}
