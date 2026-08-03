import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table, Table_Internal } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { HeaderGroup } from '../../types/HeaderGroup'
import type { Column } from '../../types/Column'

export interface Table_Headers<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Builds the visible header groups for the current column tree, visibility,
   * and pinning state.
   */
  getHeaderGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * Builds footer groups by reversing the current header group order.
   */
  getFooterGroups: () => Array<HeaderGroup<TFeatures, TData>>
  /**
   * Flattens every header from every header group, including parent and
   * placeholder headers.
   */
  getFlatHeaders: () => Array<Header<TFeatures, TData, unknown>>
  /**
   * Collects only leaf headers, excluding parent/group headers.
   */
  getLeafHeaders: () => Array<Header<TFeatures, TData, unknown>>
}

export interface HeaderContext<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
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
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
  TValue extends CellData = CellData,
> {
  /**
   * The col-span for the header.
   */
  colSpan: number
  /**
   * The header's associated column object.
   */
  column: Column<TFeatures, TData, TValue>
  /**
   * The depth of the header, zero-indexed.
   */
  depth: number
  /**
   * The header's associated header group object.
   */
  headerGroup: HeaderGroup<TFeatures, TData> | null
  /**
   * The unique identifier for the header.
   */
  id: string
  /**
   * The index for the header within the header group.
   */
  index: number
  /**
   * A boolean denoting if the header is a placeholder header. Placeholder
   * headers fill the rows above a shallow leaf column's real header so that
   * every header group row accounts for every visible column. Render them as
   * empty cells, or use `header.rowSpan` to merge each chain of placeholders
   * into one vertically spanning header cell.
   */
  isPlaceholder: boolean
  /**
   * If the header is a placeholder header, this will be a unique header ID that does not conflict with any other headers across the table.
   */
  placeholderId?: string
  /**
   * The number of header group rows the header should span when merging header
   * cells vertically. A leaf column that is shallower than the deepest leaf
   * column produces a chain of placeholder headers above its real header; the
   * placeholder at the top of the chain reports the chain's full span, and
   * every header it covers (including the real leaf header in the bottom row)
   * reports 0. To merge vertically, skip headers with a rowSpan of 0 and
   * render every other header with the `rowSpan` attribute and its column's
   * header content, even when it is a placeholder. Headers in even column
   * trees always report 1.
   */
  rowSpan: number
  /**
   * The header's hierarchical sub/child headers. Will be empty if the header's associated column is a leaf-column.
   */
  subHeaders: Array<Header<TFeatures, TData, TValue>>
  /**
   * Reference to the parent table instance.
   */
  table: Table_Internal<TFeatures, TData>
}

export interface Header_Header<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
  TValue extends CellData = CellData,
> extends Header_CoreProperties<TFeatures, TData, TValue> {
  /**
   * Returns the rendering context (or props) for column-based components like headers, footers and filters.
   */
  getContext: () => HeaderContext<TFeatures, TData, TValue>
  /**
   * Returns the leaf headers hierarchically nested under this header.
   */
  getLeafHeaders: () => Array<Header<TFeatures, TData, TValue>>
}

export interface HeaderGroup_Header<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
  TValue extends CellData = CellData,
> {
  depth: number
  headers: Array<Header<TFeatures, TData, TValue>>
  id: string
}
