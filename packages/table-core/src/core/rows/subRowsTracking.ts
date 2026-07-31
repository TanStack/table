import type { Atom } from '@tanstack/store'
import type { Row } from '../../types/Row'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'

interface SubRowsTrackingState {
  current: unknown
  versionAtom: Atom<number>
}

const subRowsTracking = new WeakMap<object, SubRowsTrackingState>()

/**
 * Reads a row's sub-rows while making replacement of that array observable to
 * table computeds.
 *
 * Most row APIs never need to observe `subRows` directly, so the revision atom
 * and accessor are installed only when a computed such as `getLeafRows` first
 * asks for a tracked read. The accessor remains enumerable and preserves the
 * public mutable `subRows` property while ensuring later direct assignments
 * bump the revision atom.
 *
 * @internal
 */
export function row_getTrackedSubRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): Array<Row<TFeatures, TData>> {
  const tracking = subRowsTracking.get(row)

  if (!tracking) {
    const createdTracking: SubRowsTrackingState = {
      current: row.subRows,
      versionAtom: row.table._reactivity.createWritableAtom(0, {
        debugName: `row/${row.id}/subRowsVersion`,
      }),
    }
    subRowsTracking.set(row, createdTracking)

    Object.defineProperty(row, 'subRows', {
      configurable: true,
      enumerable: true,
      get: () => {
        createdTracking.versionAtom.get()
        return createdTracking.current
      },
      set: (next: Array<Row<TFeatures, TData>>) => {
        if (createdTracking.current === next) return
        createdTracking.current = next
        createdTracking.versionAtom.set((version) => version + 1)
      },
    })

    createdTracking.versionAtom.get()
    return createdTracking.current as Array<Row<TFeatures, TData>>
  }

  tracking.versionAtom.get()
  return tracking.current as Array<Row<TFeatures, TData>>
}

/**
 * Replaces a row's sub-row array and publishes the change when the row has
 * acquired a tracked sub-row reader.
 *
 * @internal
 */
export function row_setSubRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, subRows: Array<Row<TFeatures, TData>>): void {
  const tracking = subRowsTracking.get(row)

  if (!tracking) {
    row.subRows = subRows
    return
  }

  if (tracking.current === subRows) return
  tracking.current = subRows
  tracking.versionAtom.set((version) => version + 1)
}
