import { shallow, useSelector } from '@tanstack/svelte-store'
import type {
  Atom,
  ReadonlyAtom,
  ReadonlyStore,
  Store,
} from '@tanstack/svelte-store'

export type SubscribeSource<TValue> =
  | Atom<TValue>
  | ReadonlyAtom<TValue>
  | Store<TValue>
  | ReadonlyStore<TValue>

/**
 * Creates a fine-grained Svelte subscription to a TanStack Store source.
 *
 * Pass a table atom or store and optionally project it with a selector. The
 * returned selector store exposes `.current`, making it useful for reading
 * focused table state outside the broad `createTable` selector.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   const selected = subscribeTable(
 *     table.atoms.rowSelection,
 *     (rowSelection) => rowSelection[row.id],
 *   )
 * </script>
 *
 * <input type="checkbox" checked={!!selected.current} />
 * ```
 */
export function subscribeTable<TSourceValue>(
  source: SubscribeSource<TSourceValue>,
): ReturnType<typeof useSelector<TSourceValue>>
export function subscribeTable<TSourceValue, TSelected>(
  source: SubscribeSource<TSourceValue>,
  selector: (state: TSourceValue) => TSelected,
): ReturnType<typeof useSelector<TSourceValue, TSelected>>
export function subscribeTable<TSourceValue, TSelected>(
  source: SubscribeSource<TSourceValue>,
  selector?: (state: TSourceValue) => TSelected,
) {
  return useSelector(source, selector, { compare: shallow })
}
