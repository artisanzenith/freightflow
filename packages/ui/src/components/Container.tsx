import { type HTMLAttributes } from 'react';

import { cn } from '../utils/cn';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
};

/** Centered, width-constrained content wrapper with responsive gutters. */
export function Container({ className, size = 'lg', ...props }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizes[size], className)} {...props} />
  );
}
