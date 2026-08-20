import {
  constructRow as _createRow,
  flexRender as _flexRender,
} from '@tanstack/react-table'
import { getAllLeafColumnDefs, getColumnId } from './column.utils'
import type { Renderable } from '@tanstack/react-table'
import type { JSX, ReactNode } from 'react'

import type {
  MRT_ColumnDef,
  MRT_ColumnHelper,
  MRT_Row,
  MRT_RowData,
  MRT_TableInstance,
} from '../types'

export const flexRender = _flexRender as (
  Comp: Renderable<any>,
  props: any,
) => JSX.Element | ReactNode

/**
 * A helper utility for creating MRT column definitions with type inference
 * for each individual column's `TValue`. Mirrors v9's `createColumnHelper`
 * surface (`accessor`, `columns`, `display`, `group`) but bound to MRT's
 * column-def shape (extra MRT-specific props, `StockFeatures` pre-bound).
 *
 * From a JavaScript perspective, `display` / `group` / `columns` are identity
 * functions — they exist purely to anchor TypeScript inference.
 *
 * @example
 * ```tsx
 * const helper = createMRTColumnHelper<Person>()
 * const columns = helper.columns([
 *   helper.accessor('firstName', { header: 'First' }),
 *   helper.accessor((row) => row.lastName, { id: 'lastName' }),
 *   helper.display({ id: 'actions', header: 'Actions' }),
 * ])
 * ```
 */
export function createMRTColumnHelper<
  TData extends MRT_RowData,
>(): MRT_ColumnHelper<TData> {
  return {
    accessor: (accessor, column) => {
      return typeof accessor === 'function'
        ? ({
            ...column,
            accessorFn: accessor,
          } as any)
        : ({
            ...column,
            accessorKey: accessor,
          } as any)
    },
    columns: <TColumns extends ReadonlyArray<MRT_ColumnDef<TData, any>>>(
      columns: [...TColumns],
    ): Array<MRT_ColumnDef<TData, any>> & [...TColumns] => columns,
    display: (column) => column,
    group: (column) => column,
  }
}

export const createRow = <TData extends MRT_RowData>(
  table: MRT_TableInstance<TData>,
  originalRow?: TData,
  rowIndex = -1,
  depth = 0,
  subRows?: Array<MRT_Row<TData>>,
  parentId?: string,
): MRT_Row<TData> =>
  _createRow(
    table as any,
    'mrt-row-create',
    originalRow ??
      Object.assign(
        {},
        ...getAllLeafColumnDefs(table.options.columns).map((col) => ({
          [getColumnId(col)]: '',
        })),
      ),
    rowIndex,
    depth,
    subRows as any,
    parentId,
  ) as MRT_Row<TData>
