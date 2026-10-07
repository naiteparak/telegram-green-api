import type { ComponentPropsWithoutRef } from 'react';

type ButtonSizeProps =
  { size?: 'regular' } | { size: 'icon'; 'aria-label': string };

type ButtonProps = ComponentPropsWithoutRef<'button'> &
  ButtonSizeProps & {
    variant?: 'primary' | 'flat' | 'ghost';
    shape?: 'rounded' | 'circle';
  };

const primaryStyles =
  'bg-primary font-bold text-on-primary enabled:hover:bg-primary-hover active:enabled:translate-y-px';

const variants = {
  primary: `${primaryStyles} shadow-primary`,
  flat: primaryStyles,
  ghost: 'bg-transparent text-icon enabled:hover:bg-surface-hover',
};

const sizes = {
  regular: 'gap-2.5 px-[15px] py-[13px]',
  icon: 'size-10 shrink-0',
};

export default function Button({
  variant = 'primary',
  size = 'regular',
  shape = 'rounded',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`inline-flex items-center justify-center transition-[background-color,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${shape === 'circle' ? 'rounded-full' : size === 'icon' ? 'rounded-xl' : 'rounded-[13px]'} ${className}`}
    />
  );
}
