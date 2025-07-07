import * as React from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '../lib/utils'
import { Input } from './input'

export interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, ...props }, ref) => {
    const internalRef = React.useRef<HTMLInputElement>(null)
    React.useImperativeHandle(ref, () => internalRef.current as HTMLInputElement)

    const openPicker = () => {
      internalRef.current?.showPicker?.()
    }

    return (
      <div className="relative">
        <Input
          ref={internalRef}
          type="date"
          className={cn('pl-8', className)}
          {...props}
        />
        <button
          type="button"
          onClick={openPicker}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
        >
          <CalendarIcon className="h-4 w-4" />
        </button>
      </div>
    )
  }
)
DateInput.displayName = 'DateInput'

export { DateInput }
