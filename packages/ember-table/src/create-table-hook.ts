import { createColumnHelper as coreCreateColumnHelper } from '@tanstack/table-core'
import { useTable } from './use-table.ts'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
} from '@tanstack/table-core'

export type CreateTableHookOptions<TFeatures extends TableFeatures> = Omit<
  // `any` (not `RowData`) is intentional and matches the other adapters'
  // createTableHook: shared defaults are declared before any specific TData is
  // known, and TData-dependent options like `getRowId` and `meta` are
  // contravariant in TData, so a narrower type would reject them here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TableOptions<TFeatures, any>,
  'columns' | 'data' | 'state'
>

export type AppEmberTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table<TFeatures, TData>

export type AppColumnHelper<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = ReturnType<typeof coreCreateColumnHelper<TFeatures, TData>>

/**
 * Bundles a feature set and shared default options once so every table in your
 * app can be created without repeating them. Returns a typed column helper
 * factory and a `createAppTable` that wraps {@link useTable}.
 *
 * Unlike the React adapter's hook, this does not pre-bind cell/header
 * components onto the table; render with the `FlexRenderCell`,
 * `FlexRenderHeader`, and `FlexRenderFooter` components as usual.
 *
 * @example
 * ```ts
 * const { createAppTable, createAppColumnHelper } = createTableHook({
 *   features: tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns }),
 * })
 *
 * const columnHelper = createAppColumnHelper<Person>()
 * const columns = columnHelper.columns([...])
 *
 * // inside a Glimmer component; passing `this` binds cleanup to its lifecycle
 * table = createAppTable(this, () => ({ columns, data: this.data }))
 * ```
 */
export function createTableHook<TFeatures extends TableFeatures>({
  ...defaultTableOptions
}: CreateTableHookOptions<TFeatures>) {
  function createAppColumnHelper<TData extends RowData>(): AppColumnHelper<
    TFeatures,
    TData
  > {
    return coreCreateColumnHelper<TFeatures, TData>()
  }

  function createAppTable<TData extends RowData>(
    owner: object,
    getTableOptions: () => Omit<TableOptions<TFeatures, TData>, 'features'>,
  ): AppEmberTable<TFeatures, TData>
  function createAppTable<TData extends RowData>(
    getTableOptions: () => Omit<TableOptions<TFeatures, TData>, 'features'>,
  ): AppEmberTable<TFeatures, TData>
  function createAppTable<TData extends RowData>(
    ownerOrGetTableOptions:
      | object
      | (() => Omit<TableOptions<TFeatures, TData>, 'features'>),
    maybeGetTableOptions?: () => Omit<
      TableOptions<TFeatures, TData>,
      'features'
    >,
  ): AppEmberTable<TFeatures, TData> {
    const hasOwner = maybeGetTableOptions !== undefined
    const owner = hasOwner ? ownerOrGetTableOptions : undefined
    const getTableOptions = (
      hasOwner ? maybeGetTableOptions : ownerOrGetTableOptions
    ) as () => Omit<TableOptions<TFeatures, TData>, 'features'>

    // Keep options a thunk: the merge runs inside `useTable`'s options thunk,
    // so tracked properties read in `getTableOptions` stay reactive. Per-table
    // options take precedence over the shared defaults (except `features`,
    // which only the hook provides).
    const getMergedOptions = () =>
      ({
        ...defaultTableOptions,
        ...getTableOptions(),
      }) as TableOptions<TFeatures, TData>

    return owner
      ? useTable<TFeatures, TData>(owner, getMergedOptions)
      : useTable<TFeatures, TData>(getMergedOptions)
  }

  return {
    appFeatures: defaultTableOptions.features as TFeatures,
    createAppColumnHelper,
    createAppTable,
  }
}
