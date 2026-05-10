import { createDebouncer } from '@tanstack/solid-pacer/debouncer'
import { createEffect, createSignal } from 'solid-js'

type DebouncedInputProps = {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
  class?: string
  type?: string
  placeholder?: string
}

export function DebouncedInput(props: DebouncedInputProps) {
  const [value, setValue] = createSignal<string | number>(props.value)

  createEffect(() => {
    setValue(() => props.value)
  })

  const onChangeDebouncer = createDebouncer(
    (nextValue: string | number) => props.onChange(nextValue),
    { wait: () => props.debounce ?? 200 },
  )

  createEffect(() => {
    onChangeDebouncer.maybeExecute(value())
  })

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
