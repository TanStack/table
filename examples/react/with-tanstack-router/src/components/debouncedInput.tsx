import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { useEffect, useState } from 'react'
import type { InputHTMLAttributes } from 'react'

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 200,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState<string | number>(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const debouncedOnChange = useDebouncedCallback(onChange, { wait: debounce })

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => {
        const nextValue =
          e.target.value === ''
            ? ''
            : props.type === 'number'
              ? e.target.valueAsNumber
              : e.target.value

        setValue(nextValue)
        debouncedOnChange(nextValue)
      }}
    />
  )
}
