import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { HeaderGroup } from '../../types/HeaderGroup'
import type { Column } from '../../types/Column'

export interface Table_Headers<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns all header groups for the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getheadergroups)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getHeaderGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * Returns the footer groups for the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getfootergroups)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getFooterGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * Returns headers for all columns in the table, including parent headers.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getflatheaders)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getFlatHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * Returns headers for all leaf columns in the table, (not including parent headers).
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getleafheaders)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getLeafHeaders: () => Array<Header<TFeatures, TData, unknown>>
}

export interface HeaderContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  /**
   * An instance of a column.
   */
  column: Column<TFeatures, TData, TValue>
  /**
   * An instance of a header.
   */
  header: Header<TFeatures, TData, TValue>
  /**
   * The table instance.
   */
  table: Table<TFeatures, TData>
}

export interface Header_CoreProperties<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  /**
   * The col-span for the header.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/header#colspan)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  colSpan: number
  /**
   * The header's associated column object.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/header#column)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  column: Column<TFeatures, TData, TValue>
  /**
   * The depth of the header, zero-indexed based.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/header#depth)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  depth: number
  /**
   * The header's associated header group object.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/header#headergroup)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  headerGroup: HeaderGroup<TFeatures, TData> | null
  /**
   * The unique identifier for the header.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/header#id)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  id: string
  /**
   * The index for the header within the header group.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/header#index)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  index: number
  /**
   * A boolean denoting if the header is a placeholder header.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/header#isplaceholder)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  isPlaceholder: boolean
  /**
   * If the header is a placeholder header, this will be a unique header ID that does not conflict with any other headers across the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/header#placeholderid)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  placeholderId?: string
  /**
   * The row-span for the header.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/header#rowspan)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  rowSpan: number
  /**
   * The header's hierarchical sub/child headers. Will be empty if the header's associated column is a leaf-column.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/header#subheaders)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  subHeaders: Array<Header<TFeatures, TData, TValue>>
  /**
   * Reference to the parent table instance.
   */
  _table: Table<TFeatures, TData>
}

export interface Header_Header<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> extends Header_CoreProperties<TFeatures, TData, TValue> {
  /**
   * Returns the rendering context (or props) for column-based components like headers, footers and filters.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/header#getcontext)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getContext: () => HeaderContext<TFeatures, TData, TValue>
  /**
   * Returns the leaf headers hierarchically nested under this header.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/header#getleafheaders)
   * [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getLeafHeaders: () => Array<Header<TFeatures, TData, TValue>>
}

export interface HeaderGroup_Header<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  depth: number
  headers: Array<Header<TFeatures, TData, TValue>>
  id: string
}
