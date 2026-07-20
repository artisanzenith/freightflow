import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * The de-facto standard combining `clsx` (conditional joining) with
 * `tailwind-merge` (last-wins conflict resolution).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
