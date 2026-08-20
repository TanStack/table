/**
 * Indeterminate checkbox used by the row-selection column
 * (both the select-all header and the per-row select cell).
 */
import { useEffect, useRef } from 'preact/hooks'

export function IndeterminateCheckbox({
  indeterminate,
  className = '',
  checked,
  onChange,
  disabled,
  ...rest
}: {
  indeterminate?: boolean
  checked?: boolean
  disabled?: boolean
  onChange?: (event: Event) => void
} & Record<string, any>) {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !checked && indeterminate
    }
  }, [ref, indeterminate, checked])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      {...rest}
    />
  )
}
