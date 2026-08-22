import type { Cell } from './types/Cell'
import type { Header } from './types/Header'
import type { TableFeatures } from './types/TableFeatures'
import type { CellData, RowData } from './types/type-utils'
import { formatAggregatedCellValue } from './features/row-aggregation/rowAggregationFeature.utils'

/**
 * Renders a static value or render function with the provided props.
 *
 * Framework adapters use this helper to support column definitions that contain either plain values or template functions.
 */
export function flexRender<TProps extends object>(
  comp: unknown,
  props: TProps,
): unknown | null {
  if (comp == null) return null

  if (typeof comp === 'function') {
    return comp(props)
  }

  return comp
}

export type FlexRenderProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> =
  | { cell: Cell<TFeatures, TData, TValue>; header?: never; footer?: never }
  | {
      header: Header<TFeatures, TData, TValue>
      cell?: never
      footer?: never
    }
  | {
      footer: Header<TFeatures, TData, TValue>
      cell?: never
      header?: never
    }

/**
 * Renders a static value or render function with the provided props.
 *
 * Framework adapters use this helper to support column definitions that contain either plain values or template functions.
 */
export function FlexRender<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: FlexRenderProps<TFeatures, TData, TValue>): unknown | null {
  if ('cell' in props && props.cell) {
    const cell = props.cell
    const def = cell.column.columnDef
    // When the column-grouping feature is registered, a cell can be in one of
    // three special modes that should not render `columnDef.cell` directly:
    //   - aggregated: render `columnDef.aggregatedCell` (falling back to
    //     `columnDef.cell` if the column did not define one)
    //   - placeholder: a duplicate value within a group — render nothing
    //   - grouped: the group header cell — fall through to `columnDef.cell`;
    //     consumers that want a custom group header typically branch on
    //     `cell.getIsGrouped()` themselves first
    // The optional-chaining + cast keeps this safe when the grouping feature
    // is not registered (the methods are absent at the type level then).
    const groupingCell = cell as typeof cell & {
      getIsAggregated?: () => boolean
      getIsPlaceholder?: () => boolean
    }
    const groupingDef = def as typeof def & {
      aggregatedCell?: typeof def.cell
    }
    if (groupingCell.getIsAggregated?.()) {
      return flexRender(
        groupingDef.aggregatedCell ??
          def.cell ??
          ((context) =>
            formatAggregatedCellValue(
              context.getValue(),
              context.column.columnDef.aggregationFn,
            )),
        cell.getContext(),
      )
    }
    if (groupingCell.getIsPlaceholder?.()) {
      return null
    }
    return flexRender(def.cell, cell.getContext())
  }

  // Placeholder headers and footers are not skipped here. Whether a
  // placeholder renders is the caller's decision, which is what makes
  // `header.rowSpan` usable for merging header cells vertically.
  if ('header' in props && props.header) {
    return flexRender(
      props.header.column.columnDef.header,
      props.header.getContext(),
    )
  }

  if ('footer' in props && props.footer) {
    return flexRender(
      props.footer.column.columnDef.footer,
      props.footer.getContext(),
    )
  }

  return null
}
