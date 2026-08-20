<!-- Root of the faceted filter combobox — a popover + command palette that
  supports single or multiple selection. Port of the react example's faceted.tsx. -->
<script lang="ts">
  import type { Snippet } from 'svelte'
  import { Popover } from '@/lib/components/ui/popover'
  import { setFacetedContext } from './faceted-context'

  let {
    value,
    onValueChange,
    multiple = false,
    children,
  }: {
    value?: string | Array<string>
    onValueChange?: (value: string | Array<string> | undefined) => void
    multiple?: boolean
    children?: Snippet
  } = $props()

  let open = $state(false)

  function onItemSelect(selectedValue: string) {
    if (!onValueChange) return

    if (multiple) {
      const currentValue = Array.isArray(value) ? value : []
      const newValue = currentValue.includes(selectedValue)
        ? currentValue.filter((v) => v !== selectedValue)
        : [...currentValue, selectedValue]
      onValueChange(newValue)
    } else {
      onValueChange(value === selectedValue ? undefined : selectedValue)

      requestAnimationFrame(() => {
        open = false
      })
    }
  }

  setFacetedContext({
    get value() {
      return value
    },
    get multiple() {
      return multiple
    },
    onItemSelect,
  })
</script>

<Popover bind:open>
  {@render children?.()}
</Popover>
