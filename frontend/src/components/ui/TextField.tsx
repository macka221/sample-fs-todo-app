import { useId, type InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  hint?: string
  label: string
}

export function TextField({
  'aria-describedby': ariaDescribedBy,
  className = '',
  hint,
  id,
  label,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const describedBy = [ariaDescribedBy, hintId].filter(Boolean).join(' ')

  return (
    <div className="min-w-0 flex-1">
      <label
        className="mb-1.5 block text-xs font-semibold text-slate-700"
        htmlFor={inputId}
      >
        {label}
      </label>
      <input
        aria-describedby={describedBy || undefined}
        className={`min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-xs outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-100 ${className}`}
        id={inputId}
        {...inputProps}
      />
      {hint ? (
        <p className="mt-1.5 text-xs leading-5 text-slate-500" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
