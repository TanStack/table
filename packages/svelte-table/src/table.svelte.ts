import {
  createTable,
  type RowData,
  type TableOptions,
  type TableOptionsResolved,
  type TableState,
} from '@tanstack/table-core'

/**
 * Creates a tanstack table object that's reactive using Svelte 5 runes. For more
 * information on why this returns a function, see Svelte's
 * {@link https://svelte-5-preview.vercel.app/docs/universal-reactivity#gotchas gotchas}
 * note for Universal Reactivity.
 * @param options Table options to create the table with.
 * @returns A reactive table object.
 * @example
 * ```svelte
 * <script>
 *   const table = createSvelteTable({ ... })
 * </script>
 * 
 * <table>
 *   <thead>
 *     {#each table().getHeaderGroups() as headerGroup}
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
 * @see {@link https://svelte-5-preview.vercel.app/docs/runes}
 * @see {@link https://svelte-5-preview.vercel.app/docs/universal-reactivity}
 */
export function createSvelteTable<TData extends RowData>(
  options: TableOptions<TData>
) {
  const resolvedOptions: TableOptionsResolved<TData> = {
    state: {},
    onStateChange() {},
    renderFallbackValue: null,
    ...options,
  }

  const _table = createTable(resolvedOptions)
  let _state = $state<Partial<TableState>>(_table.initialState)

  const table = $derived.by(() => {
    return createTable({
      ...resolvedOptions,
      state: { ..._state },
      onStateChange(updater) {
        if (updater instanceof Function) {
          _state = updater({ ...table.getState(), ..._state })
        } else {
          _state = updater
        }
        resolvedOptions.onStateChange?.(updater)
      },
    })
  })

  return () => table
}
