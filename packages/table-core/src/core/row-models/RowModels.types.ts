import type { Table_RowModels_Faceted } from '../../features/column-faceting/ColumnFaceting.types'
import type { Table_RowModels_Filtered } from '../../features/column-filtering/ColumnFiltering.types'
import type { Table_RowModels_Grouped } from '../../features/column-grouping/ColumnGrouping.types'
import type { Table_RowModels_Expanded } from '../../features/row-expanding/RowExpanding.types'
import type { Table_RowModels_Paginated } from '../../features/row-pagination/RowPagination.types'
import type { Table_RowModels_Sorted } from '../../features/row-sorting/RowSorting.types'
import type { Row } from '../../types/Row'
import type { Table } from '../../types/Table'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowData } from '../../types/type-utils'

export interface RowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  rows: Array<Row<TFeatures, TData>>
  flatRows: Array<Row<TFeatures, TData>>
  rowsById: Record<string, Row<TFeatures, TData>>
}

export interface CreateRowModel_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * This required option is a factory for a function that computes and returns the core row model for the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getcorerowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  coreRowModel?: (
    table: Table<TFeatures, TData>,
  ) => () => RowModel<TFeatures, TData>
}

export interface CachedRowModel_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  coreRowModel?: () => RowModel<TFeatures, TData>
}

export interface Table_RowModels_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns the core row model before any processing has been applied.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getcorerowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  getCoreRowModel: () => RowModel<TFeatures, TData>
  /**
   * Returns the final model after all processing from other used features has been applied. This is the row model that is most commonly used for rendering.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getrowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  getRowModel: () => RowModel<TFeatures, TData>
}

export type Table_RowModels<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table_RowModels_Core<TFeatures, TData> &
  Table_RowModels_Faceted<TFeatures, TData> &
  Table_RowModels_Filtered<TFeatures, TData> &
  Table_RowModels_Grouped<TFeatures, TData> &
  Table_RowModels_Expanded<TFeatures, TData> &
  Table_RowModels_Paginated<TFeatures, TData> &
  Table_RowModels_Sorted<TFeatures, TData>
