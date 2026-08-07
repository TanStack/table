import { createContext } from 'reka-ui'
import type { ComputedRef } from 'vue'

export { default as Faceted } from './Faceted.vue'
export { default as FacetedBadgeList } from './FacetedBadgeList.vue'
export { default as FacetedContent } from './FacetedContent.vue'
export { default as FacetedItem } from './FacetedItem.vue'
export { default as FacetedTrigger } from './FacetedTrigger.vue'

// The list parts are the Command primitives; `FacetedContent` provides the
// surrounding `Command` root.
export {
  CommandEmpty as FacetedEmpty,
  CommandGroup as FacetedGroup,
  CommandInput as FacetedInput,
  CommandList as FacetedList,
  CommandSeparator as FacetedSeparator,
} from '@/components/ui/command'

export interface FacetedContext {
  value: ComputedRef<string | Array<string> | undefined>
  multiple: ComputedRef<boolean>
  onItemSelect: (value: string) => void
}

export const [useFaceted, provideFacetedContext] =
  createContext<FacetedContext>('Faceted')
