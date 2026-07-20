/**
 * Pricing configuration — the single source of truth for plans shown on the
 * marketing site. Edit tiers, prices, and features here; the pricing UI renders
 * entirely from this file. No pricing values are hard-coded in components.
 *
 * Prices are in USD. `priceMonthly` / `priceAnnual` are per-month amounts;
 * annual is the effective monthly rate when billed yearly. Use `null` for
 * custom/contact-us pricing.
 */

export type BillingInterval = 'monthly' | 'annual';

export interface PricingFeature {
  /** Feature label shown in the plan's checklist. */
  label: string;
  /** When false, renders as a muted/not-included row. Defaults to true. */
  included?: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  /** One-line positioning statement. */
  tagline: string;
  /** Per-month price when billed monthly; null = custom pricing. */
  priceMonthly: number | null;
  /** Per-month price when billed annually; null = custom pricing. */
  priceAnnual: number | null;
  /** Unit shown after the price, e.g. "per truck / mo". */
  unit: string;
  /** Highlights this tier as the recommended option. */
  featured?: boolean;
  /** Call-to-action label for this tier's button. */
  cta: string;
  features: PricingFeature[];
}

export interface PricingConfig {
  /** Discount copy shown next to the annual toggle, e.g. "Save 20%". */
  annualDiscountLabel: string;
  currency: string;
  tiers: PricingTier[];
}

export const pricing: PricingConfig = {
  currency: 'USD',
  annualDiscountLabel: 'Save 20%',
  tiers: [
    {
      id: 'owner-operator',
      name: 'Owner-Operator',
      tagline: 'For a single truck running solo.',
      priceMonthly: 29,
      priceAnnual: 23,
      unit: 'per truck / mo',
      cta: 'Start free trial',
      features: [
        { label: 'Dispatch board & load lifecycle' },
        { label: 'Document uploads (rate cons, BOL, POD)' },
        { label: 'Basic expense & revenue tracking' },
        { label: 'Mobile app for drivers' },
        { label: 'Email support' },
        { label: 'Multi-user dispatch', included: false },
        { label: 'Advanced reporting', included: false },
      ],
    },
    {
      id: 'fleet',
      name: 'Small Fleet',
      tagline: 'For growing fleets of 2–20 trucks.',
      priceMonthly: 24,
      priceAnnual: 19,
      unit: 'per truck / mo',
      featured: true,
      cta: 'Start free trial',
      features: [
        { label: 'Everything in Owner-Operator' },
        { label: 'Multi-user dispatch & driver roles' },
        { label: 'Fleet & trailer management' },
        { label: 'Advanced reporting & profitability' },
        { label: 'In-app messaging & notifications' },
        { label: 'Priority support' },
        { label: 'Dedicated onboarding', included: false },
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      tagline: 'For larger carriers with custom needs.',
      priceMonthly: null,
      priceAnnual: null,
      unit: 'custom pricing',
      cta: 'Contact sales',
      features: [
        { label: 'Everything in Small Fleet' },
        { label: 'Volume discounts' },
        { label: 'Dedicated onboarding & training' },
        { label: 'Custom integrations (ELD, factoring)' },
        { label: 'SLA & dedicated support' },
        { label: 'Single sign-on (SSO)' },
      ],
    },
  ],
};
