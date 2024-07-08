import type { RowData, RowModel, Table } from '../../types'

export interface TableOptions_RowModels<TData extends RowData> {}

export interface Table_RowModels<TData extends RowData> {
  _getCoreRowModel?: () => RowModel<TData>
  /**
   * Returns the core row model before any processing has been applied.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getcorerowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  getCoreRowModel: () => RowModel<TData>
  /**
   * Returns the final model after all processing from other used features has been applied. This is the row model that is most commonly used for rendering.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  getRowModel: () => RowModel<TData>
}
