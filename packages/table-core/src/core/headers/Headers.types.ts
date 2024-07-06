import type { Column, Header, HeaderGroup, RowData, Table } from '../../types'

export interface TableOptions_Headers {
  /**
   * Set this option to `true` to output header debugging information to the console.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugheaders)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  debugHeaders?: boolean
}

export interface Table_Headers<TData extends RowData> {
  /**
   * Returns all header groups for the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getheadergroups)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getHeaderGroups: () => Array<HeaderGroup<TData>>
  /**
   * Returns the footer groups for the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getfootergroups)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getFooterGroups: () => Array<HeaderGroup<TData>>
  /**
   * Returns headers for all columns in the table, including parent headers.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getflatheaders)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getFlatHeaders: () => Array<Header<TData, unknown>>
  /**
   * Returns headers for all leaf columns in the table, (not including parent headers).
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getleafheaders)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getLeafHeaders: () => Array<Header<TData, unknown>>
}

export interface HeaderContext<TData, TValue> {
  /**
   * An instance of a column.
   */
  column: Column<TData, TValue>
  /**
   * An instance of a header.
   */
  header: Header<TData, TValue>
  /**
   * The table instance.
   */
  table: Table<TData>
}

export interface Header_CoreProperties<TData extends RowData, TValue> {
  /**
   * The col-span for the header.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/header#colspan)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  colSpan: number
  /**
   * The header's associated column object.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/header#column)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  column: Column<TData, TValue>
  /**
   * The depth of the header, zero-indexed based.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/header#depth)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  depth: number
  /**
   * The header's associated header group object.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/header#headergroup)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  headerGroup: HeaderGroup<TData> | null
  /**
   * The unique identifier for the header.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/header#id)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  id: string
  /**
   * The index for the header within the header group.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/header#index)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  index: number
  /**
   * A boolean denoting if the header is a placeholder header.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/header#isplaceholder)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  isPlaceholder: boolean
  /**
   * If the header is a placeholder header, this will be a unique header ID that does not conflict with any other headers across the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/header#placeholderid)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  placeholderId?: string
  /**
   * The row-span for the header.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/header#rowspan)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  rowSpan: number
  /**
   * The header's hierarchical sub/child headers. Will be empty if the header's associated column is a leaf-column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/header#subheaders)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  subHeaders: Array<Header<TData, TValue>>
}

export interface Header_Core<TData extends RowData, TValue>
  extends Header_CoreProperties<TData, TValue> {
  /**
   * Returns the rendering context (or props) for column-based components like headers, footers and filters.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/header#getcontext)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getContext: () => HeaderContext<TData, TValue>
  /**
   * Returns the leaf headers hierarchically nested under this header.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/header#getleafheaders)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/headers)
   */
  getLeafHeaders: () => Array<Header<TData, unknown>>
}

export interface HeaderGroup_Core<TData extends RowData> {
  depth: number
  headers: Array<Header<TData, unknown>>
  id: string
}
