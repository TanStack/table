import { createEffect, createSignal, onCleanup } from 'solid-js'

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

  createEffect(() => {
    const currentValue = value()
    const timeout = setTimeout(() => {
      props.onChange(currentValue)
    }, props.debounce ?? 200)
    onCleanup(() => clearTimeout(timeout))
  })

  return (
    <input
      type={props.type ?? 'text'}
      value={value() as string}
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
