import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b69a5]/30 disabled:pointer-events-none disabled:opacity-50', {
  variants: { variant: { default:'bg-[#092c5c] text-white hover:bg-[#0f3f7a]', outline:'border border-[#d9e0e7] bg-white text-[#344054] hover:bg-[#f6f8fb]', ghost:'text-[#5d6878] hover:bg-[#f1f4f7]', invoice:'border border-[#0a8b65] bg-white text-[#087555] hover:bg-[#edf8f4]', destructive:'text-[#b54755] hover:bg-[#fff1f2]' }, size: { default:'h-10 px-4', sm:'h-8 px-3 text-xs', icon:'h-9 w-9' } },
  defaultVariants: { variant:'default', size:'default' }
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
export const Button = React.forwardRef<HTMLButtonElement,ButtonProps>(({className,variant,size,asChild=false,...props},ref)=>{const Comp=asChild?Slot:'button';return <Comp ref={ref} className={cn(buttonVariants({variant,size,className}))} {...props}/>});
Button.displayName='Button';
