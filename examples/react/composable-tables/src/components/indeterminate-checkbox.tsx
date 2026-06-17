/**
 * Indeterminate checkbox used by the row-selection column
 * (both the select-all header and the per-row select cell).
 */
import { useEffect, useRef } from 'react'
import type { HTMLProps } from 'react'

export function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate, rest.checked])

  return <input type="checkbox" ref={ref} className={className} {...rest} />
}
