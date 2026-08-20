<script lang="ts">
  let {
    value,
    onchange,
    debounce = 500,
    ...rest
  }: {
    value: string | number
    onchange: (value: string | number) => void
    debounce?: number
    [key: string]: any
  } = $props()

  let internalValue: string | number = $state('')

  $effect(() => {
    internalValue = value
  })

  $effect(() => {
    const v = internalValue
    const timeout = setTimeout(() => {
      onchange(v)
    }, debounce)
    return () => clearTimeout(timeout)
  })
</script>

<input {...rest} bind:value={internalValue} />
