import { createEffect, createSignal } from 'solid-js'
import { createDebouncer } from './debouncer'

type DebouncedInputProps = {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
  class?: string
  type?: string
  placeholder?: string
}

export function DebouncedInput(props: DebouncedInputProps) {
  // The input shows the typed value, and resets when `props.value` changes.
  const [value, setValue] = createSignal<string | number>(() => props.value)

  const onChangeDebouncer = createDebouncer(
    (nextValue: string | number) => props.onChange(nextValue),
    {
      wait: () => props.debounce ?? 200,
    },
  )

  createEffect(value, (nextValue) => onChangeDebouncer.maybeExecute(nextValue))

  return (
    <input
      type={props.type ?? 'text'}
      value={value()}
      onInput={(e) => {
        if (e.currentTarget.value === '') {
          setValue('')
        } else if (props.type === 'number') {
          setValue(e.currentTarget.valueAsNumber)
        } else {
          setValue(e.currentTarget.value)
        }
      }}
      placeholder={props.placeholder}
      class={props.class}
    />
  )
}
