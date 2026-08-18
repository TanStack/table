import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Column } from '../../types/Column'

/**
 * The table's cell span index for the rows that are currently rendered.
 *
 * Cell APIs read this; it is exposed for devtools and for virtualizers that
 * need to know where a run's anchor sits relative to the rendered window.
 */
export interface CellSpanIndex<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Column spans per render-order row position, indexed by render-order column
   * position. Holes are the common case: only rows that declared a column span
   * get an array. In a stored array, the spanning cell holds its span and the
   * cells it covers hold `0`; every other cell holds `1`.
   */
  colSpans: Array<Int32Array | undefined>
  /**
   * Render-order index for every visible column id. Hidden columns are absent.
   */
  columnIndexes: Record<string, number>
  /**
   * Row spans per column id, indexed by render-order row position. Only columns
   * that produced at least one run longer than one row appear here; a missing
   * column means every cell in it spans exactly one row. In a stored array, the
   * run's anchor row holds the run length and the rows it covers hold `0`.
   */
  rowSpans: Record<string, Int32Array>
  /**
   * The exact ordered rows this index was built from, in render order:
   * top-pinned rows, then the (paginated) center rows, then bottom-pinned
   * rows. Cell reads compare against this to reject stale row positions.
   */
  rows: ReadonlyArray<Row<TFeatures, TData>>
}

/**
 * Context passed to a `spanRows` predicate for each candidate row.
 *
 * The run is anchored: `anchorRow` is the row whose cell will render the
 * merged content, and every later row in the run is tested against it, which
 * keeps runs transitive by construction. `previousRow` is provided for
 * predicates that want a step-wise comparison instead.
 */
export interface RowSpanContext<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
  TValue extends CellData = CellData,
> {
  anchorRow: Row<TFeatures, TData>
  anchorValue: TValue
  column: Column<TFeatures, TData, TValue>
  previousRow: Row<TFeatures, TData>
  row: Row<TFeatures, TData>
  table: Table<TFeatures, TData>
  value: TValue
}

/**
 * Context passed to a `spanColumns` resolver for each rendered row.
 */
export interface ColSpanContext<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
  TValue extends CellData = CellData,
> {
  column: Column<TFeatures, TData, TValue>
  row: Row<TFeatures, TData>
  table: Table<TFeatures, TData>
}

export interface ColumnDef_CellSpanning<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
  TValue extends CellData = CellData,
> {
  /**
   * Turns this column off for cell spanning even when the table allows it.
   * Defaults to `true`.
   */
  enableCellSpanning?: boolean
  /**
   * Makes this column's cell span the given number of columns per row,
   * starting at itself and counted in the order columns actually render.
   *
   * Return `1` or less for no span. Larger values are clamped to the end of
   * the cell's pinned region, so a span can never cross the start-pinned,
   * center, or end-pinned boundary; pass `Infinity` for "the rest of my
   * region". Hidden columns are not counted.
   *
   * @example
   * ```ts
   * { accessorKey: 'label', spanColumns: ({ row }) => row.original.isSummary ? Infinity : 1 }
   * ```
   */
  spanColumns?:
    number | ((context: ColSpanContext<TFeatures, TData, TValue>) => number)
  /**
   * Merges adjacent rows in this column into a single vertically spanning
   * cell.
   *
   * `true` merges rows whose values for this column are the same value
   * (`Object.is`). Nullish values never merge under the default comparison.
   *
   * A predicate replaces the comparison entirely and decides whether `row`
   * joins the run anchored at `anchorRow`; it may merge nullish values. It is
   * called once per candidate row each time the span index rebuilds, and each
   * call allocates one context object, so keep it cheap.
   *
   * Spans are always recomputed from the rows that are actually rendered, so
   * sorting, filtering, and paging only change which rows are adjacent. Runs
   * never cross a page boundary, a pinned-row section boundary, a change of
   * position in the row tree, or a grouped row. Ignored while this column is
   * grouped.
   *
   * @example
   * ```ts
   * { accessorKey: 'department', spanRows: true }
   * ```
   */
  spanRows?:
    boolean | ((context: RowSpanContext<TFeatures, TData, TValue>) => boolean)
}

export interface TableOptions_CellSpanning {
  /**
   * Allows cells to span rows or columns. When `false` every cell reports a
   * span of `1` and the span index is never built. Defaults to `true`.
   */
  enableCellSpanning?: boolean
}

export interface Cell_CellSpanning {
  /**
   * Number of columns this cell spans when rendered. `1` when it does not
   * span, and `0` when another cell's column span covers it.
   *
   * Never render a `0` as a `colSpan` attribute; skip the cell instead. See
   * `getIsCovered`.
   */
  getColSpan: () => number
  /**
   * Whether another cell's span covers this cell. Skip rendering covered
   * cells; the cell that covers them carries the content and the span
   * attributes.
   */
  getIsCovered: () => boolean
  /**
   * Number of rows this cell spans when rendered. `1` when it does not span,
   * and `0` when a spanning cell above it covers it, matching the
   * `header.rowSpan` convention.
   *
   * Never render a `0` as a `rowSpan` attribute: in HTML, `rowspan="0"` means
   * "span to the end of the row group", which merges the cell down the entire
   * table section. Skip the cell instead. See `getIsCovered`.
   */
  getRowSpan: () => number
}

export interface Table_CellSpanning<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * The memoized span index for the rows that are currently rendered.
   */
  getCellSpanIndex: () => CellSpanIndex<TFeatures, TData>
}
