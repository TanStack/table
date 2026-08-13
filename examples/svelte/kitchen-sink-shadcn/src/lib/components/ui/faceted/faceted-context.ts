import { getContext, setContext } from 'svelte'

/** Shared state for the Faceted combobox, provided by `<Faceted.Root>`. */
export interface FacetedContext {
  readonly value: string | Array<string> | undefined
  readonly multiple: boolean
  onItemSelect: (value: string) => void
}

const key = Symbol('faceted')

export function setFacetedContext(context: FacetedContext) {
  setContext(key, context)
}

export function useFacetedContext(name: string): FacetedContext {
  const context = getContext<FacetedContext | undefined>(key)
  if (!context) {
    throw new Error(`\`${name}\` must be used within \`Faceted\``)
  }
  return context
}
