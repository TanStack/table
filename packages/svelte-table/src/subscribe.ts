import { shallow, useSelector } from '@tanstack/svelte-store'
import type {
  RowData,
  Table,
  TableFeatures,
  TableState,
} from '@tanstack/table-core'

/**
 * Fine-grained subscription to `table.store` using `useSelector` with shallow
 * comparison. Call from `<script>` so the selector is contextually typed
 * (same inference model as React’s `Subscribe` / `table.Subscribe`).
 */
export function subscribeTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
>(
  table: Table<TFeatures, TData>,
  selector: (state: TableState<TFeatures>) => TSelected,
) {
  return useSelector(table.store, selector, { compare: shallow })
}
