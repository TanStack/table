/**
 * Indeterminate checkbox used by the row-selection column
 * (both the select-all header and the per-row select cell).
 *
 * Solid handles reactivity natively, so `checked`/`indeterminate` are read
 * from props (kept reactive by the callers) and the indeterminate DOM property
 * is synced via a ref in createEffect.
 */
import { createEffect } from 'solid-js'

export function IndeterminateCheckbox(props: {
  indeterminate?: boolean
  class?: string
  checked?: boolean
  disabled?: boolean
  onChange?: (event: Event) => void
}) {
  let ref: HTMLInputElement | undefined

  createEffect(() => {
    if (typeof props.indeterminate === 'boolean' && ref) {
      ref.indeterminate = !props.checked && props.indeterminate
    }
  })

  return (
    <input
      type="checkbox"
      ref={ref}
      class={props.class ?? ''}
      checked={props.checked}
      disabled={props.disabled}
      onChange={props.onChange}
    />
  )
}
