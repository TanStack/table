import Root from './faceted.svelte'
import Trigger from './faceted-trigger.svelte'
import BadgeList from './faceted-badge-list.svelte'
import Content from './faceted-content.svelte'
import Item from './faceted-item.svelte'
import {
  CommandEmpty as Empty,
  CommandGroup as Group,
  CommandInput as Input,
  CommandList as List,
  CommandSeparator as Separator,
} from '@/lib/components/ui/command'

export {
  Root,
  Trigger,
  BadgeList,
  Content,
  Item,
  Input,
  List,
  Empty,
  Group,
  Separator,
  //
  Root as Faceted,
  Trigger as FacetedTrigger,
  BadgeList as FacetedBadgeList,
  Content as FacetedContent,
  Item as FacetedItem,
  Input as FacetedInput,
  List as FacetedList,
  Empty as FacetedEmpty,
  Group as FacetedGroup,
  Separator as FacetedSeparator,
}
