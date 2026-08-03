import type { SortDirection } from './rowSortingFeature.types'

/**
 * Maps a column's sort state to a valid `aria-sort` attribute value.
 *
 * Pass the result of `column.getIsSorted()` directly: an ascending sort becomes
 * `'ascending'`, a descending sort becomes `'descending'`, and the unsorted
 * state (`false`) becomes `'none'`.
 *
 * @example
 * ```tsx
 * <th aria-sort={getAriaSort(header.column.getIsSorted())}>…</th>
 * ```
 */
export function getAriaSort(
  sorted: false | SortDirection,
): 'ascending' | 'descending' | 'none' {
  if (sorted === 'asc') return 'ascending'
  if (sorted === 'desc') return 'descending'
  return 'none'
}
