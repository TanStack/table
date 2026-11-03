/**
 * Indeterminate checkbox used by the row-selection column
 * (both the select-all header and the per-row select cell).
 *
 * Solid handles reactivity natively, so `checked`/`indeterminate` are read
 * from props (kept reactive by the callers) and the indeterminate DOM property
 * is set with `prop:indeterminate`.
 */

export function IndeterminateCheckbox(props: {
  indeterminate?: boolean
  class?: string
  checked?: boolean
  disabled?: boolean
  onChange?: (event: Event) => void
  onClick?: (event: MouseEvent) => void
}) {
  return (
    <input
      type="checkbox"
      prop:indeterminate={!props.checked && !!props.indeterminate}
      class={props.class ?? ''}
      checked={props.checked}
      disabled={props.disabled}
      onChange={props.onChange}
      onClick={props.onClick}
    />
  )
}
