/**
 * Marketing site content configuration.
 *
 * Copy for the landing page (nav, hero, features, testimonials, FAQ, footer)
 * lives here so content edits don't require touching components. Pricing has
 * its own dedicated file: `./pricing`.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  /** Simple icon key resolved by the FeatureIcon component. */
  icon: 'dispatch' | 'documents' | 'money' | 'mobile' | 'shield' | 'chart';
}

export interface Stat {
  value: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  nav: NavLink[];
  hero: {
    badge: string;
    title: string;
    highlight: string;
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    stats: Stat[];
  };
  features: Feature[];
  testimonials: Testimonial[];
  faq: FaqItem[];
  footerLinks: { heading: string; links: NavLink[] }[];
}

export const site: SiteConfig = {
  name: 'FreightFlow',
  tagline: 'Dispatch software built for owner-operators and small fleets.',
  description:
    'FreightFlow is the modern dispatch platform for owner-operators and small trucking companies in the USA. Manage loads, documents, drivers, and money from one place.',
  nav: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ],
  hero: {
    badge: 'Built for US owner-operators & small fleets',
    title: 'Run your dispatch,',
    highlight: 'not your paperwork',
    subtitle:
      'FreightFlow brings loads, documents, drivers, and settlements into one clean workflow — so you spend less time chasing paperwork and more time moving freight.',
    primaryCta: { label: 'Start free trial', href: '/register' },
    secondaryCta: { label: 'See pricing', href: '#pricing' },
    stats: [
      { value: '1–20', label: 'trucks per fleet' },
      { value: '5 min', label: 'to dispatch a load' },
      { value: '100%', label: 'mobile-first' },
    ],
  },
  features: [
    {
      title: 'Dispatch board',
      description:
        'Track every load from request to delivery. Assign drivers, trucks, and trailers with a full status history.',
      icon: 'dispatch',
    },
    {
      title: 'Document hub',
      description:
        'Rate confirmations, BOLs, and PODs in one secure place — attached to the right load, ready when you need them.',
      icon: 'documents',
    },
    {
      title: 'Money in & out',
      description:
        'Log expenses and revenue against each load and truck to see real per-load profitability, not guesses.',
      icon: 'money',
    },
    {
      title: 'Driver mobile app',
      description:
        'Drivers get assigned loads, upload documents from the cab, and update status without a single phone call.',
      icon: 'mobile',
    },
    {
      title: 'Secure by design',
      description:
        'Row-level security isolates every company’s data. Your loads, drivers, and finances stay yours.',
      icon: 'shield',
    },
    {
      title: 'Reporting',
      description:
        'Understand utilization, revenue per mile, and cost trends with reports built for small carriers.',
      icon: 'chart',
    },
  ],
  testimonials: [
    {
      quote:
        'I went from spreadsheets and a shoebox of receipts to knowing exactly what each load nets me. Game changer.',
      author: 'Marcus D.',
      role: 'Owner-operator, Ohio',
    },
    {
      quote:
        'Dispatching four trucks used to mean endless texts. Now my drivers just open the app and go.',
      author: 'Priya S.',
      role: 'Fleet owner, Texas',
    },
    {
      quote:
        'The document hub alone paid for itself. No more digging through email for a POD at billing time.',
      author: 'Danny R.',
      role: 'Owner-operator, Georgia',
    },
  ],
  faq: [
    {
      question: 'Who is FreightFlow for?',
      answer:
        'Owner-operators and small trucking companies in the USA, typically running 1 to 20 trucks. It’s designed to be simpler and more affordable than enterprise TMS platforms.',
    },
    {
      question: 'Is there a free trial?',
      answer:
        'Yes. You can start a free trial on any plan. No credit card is required to explore the product during the foundation phase.',
    },
    {
      question: 'Can my drivers use it on their phones?',
      answer:
        'Absolutely. FreightFlow is mobile-first. Drivers get a dedicated app to see assigned loads, upload documents, and update status from the road.',
    },
    {
      question: 'How is my data protected?',
      answer:
        'Every company’s data is isolated using row-level security at the database layer. Documents are stored in private buckets accessible only to your team.',
    },
    {
      question: 'Do you charge per truck or per user?',
      answer:
        'Plans are priced per truck per month, with unlimited dispatch users on Small Fleet and above. See the pricing section for details.',
    },
  ],
  footerLinks: [
    {
      heading: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'FAQ', href: '#faq' },
      ],
    },
    {
      heading: 'Account',
      links: [
        { label: 'Log in', href: '/login' },
        { label: 'Sign up', href: '/register' },
        { label: 'Reset password', href: '/reset-password' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Privacy', href: '#' },
      ],
    },
  ],
};
