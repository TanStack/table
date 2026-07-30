import { stockFeatures } from '@tanstack/table-core'
import { createTable } from '../src/createTable.svelte'
import { hook } from './fixtures/hook-fixture'
import type * as publicApi from '../src'
import type { AppSvelteTable } from '../src/createTableHook.svelte'
import type { SvelteTable } from '../src/createTable.svelte'
// @ts-expect-error SubscribeSource is no longer exported.
import type { SubscribeSource } from '../src'

type Data = { id: string }

const options = {
  data: [{ id: '1' }],
  columns: [{ id: 'id', accessorKey: 'id' }],
  features: stockFeatures,
}

const table = createTable(options)
const svelteTable: SvelteTable<typeof stockFeatures, Data> = table
const appTable = hook.createAppTable({
  data: options.data,
  columns: options.columns,
})
const typedAppTable: AppSvelteTable<typeof stockFeatures, Data, any, any, any> =
  appTable
const appOptions = { data: options.data, columns: options.columns }
const removedSelector = (state: unknown) => state

// @ts-expect-error The Svelte adapter no longer accepts a creation selector.
createTable(options, (state) => state)

// @ts-expect-error createAppTable accepts only its table options.
hook.createAppTable(appOptions, removedSelector)

// @ts-expect-error Selected table.state was removed in v9.0.0-beta.59.
table.state

// @ts-expect-error SvelteTable no longer has a selected-state generic.
type RemovedSelectedState = SvelteTable<typeof stockFeatures, Data, unknown>

type ExpectFalse<T extends false> = T
type HasSubscribeTable = 'subscribeTable' extends keyof typeof publicApi
  ? true
  : false
type SubscribeTableWasRemoved = ExpectFalse<HasSubscribeTable>

type RemovedSubscribeSource = SubscribeSource<unknown>

void svelteTable
void typedAppTable
export type PublicApiAssertions =
  | SubscribeTableWasRemoved
  | RemovedSelectedState
  | RemovedSubscribeSource
