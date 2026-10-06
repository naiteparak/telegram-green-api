import type { ComponentPropsWithoutRef } from 'react';

type ButtonSizeProps =
  { size?: 'regular' } | { size: 'icon'; 'aria-label': string };

type ButtonProps = ComponentPropsWithoutRef<'button'> &
  ButtonSizeProps & {
    variant?: 'primary' | 'ghost';
  };

const variants = {
  primary:
    'bg-primary font-bold text-on-primary shadow-primary enabled:hover:bg-primary-hover active:enabled:translate-y-px',
  ghost: 'bg-transparent text-icon enabled:hover:bg-surface-hover',
};

const sizes = {
  regular: 'gap-2.5 rounded-[13px] px-[15px] py-[13px]',
  icon: 'size-10 shrink-0 rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'regular',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`inline-flex items-center justify-center transition-[background-color,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    />
  );
}
