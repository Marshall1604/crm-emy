import * as React from 'react';
import { cn } from '@/lib/utils';
export const Textarea=React.forwardRef<HTMLTextAreaElement,React.ComponentProps<'textarea'>>(({className,...props},ref)=><textarea ref={ref} className={cn('flex min-h-24 w-full resize-y rounded-md border border-[#d9e0e7] bg-white px-3 py-2 text-sm text-[#263142] outline-none placeholder:text-[#a2a9b4] focus:border-[#4b7ead] focus:ring-2 focus:ring-[#2b69a5]/10',className)} {...props}/>);
Textarea.displayName='Textarea';
