import * as React from 'react';
import { cn } from '@/lib/utils';
export const Input=React.forwardRef<HTMLInputElement,React.ComponentProps<'input'>>(({className,...props},ref)=><input ref={ref} className={cn('flex h-10 w-full rounded-md border border-[#d9e0e7] bg-white px-3 py-2 text-sm text-[#263142] outline-none placeholder:text-[#a2a9b4] focus:border-[#4b7ead] focus:ring-2 focus:ring-[#2b69a5]/10 disabled:cursor-not-allowed disabled:bg-[#f5f6f8]',className)} {...props}/>);
Input.displayName='Input';
