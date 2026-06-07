// @ts-ignore -- svelte module types
import { mount } from 'svelte'
import App from './App.svelte'
import type { FilterFn, RowData } from '@tanstack/svelte-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { features } from './features'

declare module '@tanstack/svelte-table' {
  interface FilterFns {
    fuzzy: FilterFn<typeof features, RowData>
  }
  interface FilterMeta {
    itemRank?: RankingInfo
  }
}

const app = mount(App, {
  target: document.getElementById('root')!,
})

export default app
