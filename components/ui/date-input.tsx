import * as React from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '../lib/utils'
import { Input } from './input'

export interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(({ className, ...props }, ref) => {
  return (
    <div className="relative">
      <Input
        ref={ref}
        type="date"
        className={cn('pl-8', className)}
        {...props}
      />
      <CalendarIcon className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
})
DateInput.displayName = 'DateInput'

export { DateInput }
