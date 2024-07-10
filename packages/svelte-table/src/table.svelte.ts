import {
  type RowData,
  type TableFeatures,
  type TableOptions,
  type TableOptions,
  type TableState,
  _createTable,
} from '@tanstack/table-core'

/**
 * Creates a reactive TanStack table object for Svelte.
 * @param options Table options to create the table with.
 * @returns A reactive table object.
 * @example
 * ```svelte
 * <script>
 *   const table = createTable({ ... })
 * </script>
 *
 * <table>
 *   <thead>
 *     {#each table.getHeaderGroups() as headerGroup}
 *       <tr>
 *         {#each headerGroup.headers as header}
 *           <th colspan={header.colSpan}>
 *         	   <FlexRender content={header.column.columnDef.header} context={header.getContext()} />
 *         	 </th>
 *         {/each}
 *       </tr>
 *     {/each}
 *   </thead>
 * 	 <!-- ... -->
 * </table>
 * ```
 */
export function createTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(options: TableOptions<TFeatures, TData>) {
  const resolvedOptions: TableOptions<TFeatures, TData> = mergeObjects(
    {
      state: {},
      onStateChange() {},
      renderFallbackValue: null,
      mergeOptions: (
        defaultOptions: TableOptions<TFeatures, TData>,
        newOptions: Partial<TableOptions<TFeatures, TData>>,
      ) => {
        return mergeObjects(defaultOptions, newOptions)
      },
    },
    options,
  )

  const table = _createTable(resolvedOptions)
  let state = $state<Partial<TableState>>(table.initialState)

  function updateOptions() {
    table.setOptions((prev) => {
      return mergeObjects(prev, options, {
        state: mergeObjects(state, options.state || {}),
        onStateChange: (updater: any) => {
          if (updater instanceof Function) state = updater(state)
          else state = mergeObjects(state, updater)

          options.onStateChange?.(updater)
        },
      })
    })
  }

  updateOptions()

  $effect.pre(() => {
    updateOptions()
  })

  return table
}

/**
 * Merges objects together while keeping their getters alive.
 * Taken from SolidJS: {@link https://github.com/solidjs/solid/blob/24abc825c0996fd2bc8c1de1491efe9a7e743aff/packages/solid/src/server/rendering.ts#L82-L115}
 * */
function mergeObjects<T>(source: T): T
function mergeObjects<T, U>(source: T, source1: U): T & U
function mergeObjects<T, U, V>(source: T, source1: U, source2: V): T & U & V
function mergeObjects<T, U, V, W>(
  source: T,
  source1: U,
  source2: V,
  source3: W,
): T & U & V & W
function mergeObjects(...sources: any): any {
  const target = {}
  for (let source of sources) {
    if (typeof source === 'function') source = source()
    if (source) {
      const descriptors = Object.getOwnPropertyDescriptors(source)
      for (const key in descriptors) {
        if (key in target) continue
        Object.defineProperty(target, key, {
          enumerable: true,
          get() {
            for (let i = sources.length - 1; i >= 0; i--) {
              let v,
                s = sources[i]
              if (typeof s === 'function') s = s()
              // eslint-disable-next-line prefer-const
              v = (s || {})[key]
              if (v !== undefined) return v
            }
          },
        })
      }
    }
  }
  return target
}
