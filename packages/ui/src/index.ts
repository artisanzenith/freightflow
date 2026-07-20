/**
 * @freightflow/ui
 *
 * FreightFlow design system: design tokens, a Tailwind preset, and reusable
 * React components shared across web surfaces. The mobile app consumes tokens
 * directly; web apps consume both tokens (via the Tailwind preset) and
 * components.
 */

export const PACKAGE_NAME = '@freightflow/ui';

// Design tokens + Tailwind preset
export * from './tokens';
export { default as tailwindPreset } from './tailwind-preset';

// Utilities
export { cn } from './utils/cn';

// Components
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './components/Button';
export { Input, type InputProps } from './components/Input';
export { Label, type LabelProps } from './components/Label';
export { FormField, type FormFieldProps } from './components/FormField';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
} from './components/Card';
export { Badge, type BadgeProps, type BadgeVariant } from './components/Badge';
export { Container, type ContainerProps } from './components/Container';
export { SectionHeading, type SectionHeadingProps } from './components/SectionHeading';
export { Logo, type LogoProps } from './components/Logo';
export { Accordion, type AccordionProps, type AccordionItem } from './components/Accordion';
