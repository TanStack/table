// @ts-ignore
import App from './App.svelte'
import { mount } from 'svelte'

import type { FilterFn } from '@tanstack/svelte-table'

import type { RankingInfo } from '@tanstack/match-sorter-utils'

declare module '@tanstack/svelte-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const app = mount(App, {
  target: document.getElementById('root')!,
})

export default app
