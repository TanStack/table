import { getAggregatedCellRender } from '@tanstack/table-core/flex-render'
import type {
  Cell,
  CellData,
  Header,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'

/**
 * Renders an Alpine table value with the provided context props.
 *
 * Use this lower-level helper for custom header, cell, or footer renderers when
 * you already have the render function and context. `FlexRender` is the
 * convenience wrapper for table cell/header/footer objects. Renderers typically
 * return a string of markup that you render into the DOM with `x-html`.
 *
 * @example
 * ```ts
 * flexRender(cell.column.columnDef.cell, cell.getContext())
 * ```
 */
export function flexRender<TProps extends object>(
  render: any,
  props: TProps,
): any {
  if (typeof render === 'function') {
    return render(props)
  }
  return render
}

/**
 * Simplified wrapper of `flexRender`. Use this utility function to render headers, cells, or footers with custom markup.
 * Only one prop (`cell`, `header`, or `footer`) may be passed.
 * @example
 * ```html
 * <th x-html="FlexRender({ header })"></th>
 * <td x-html="FlexRender({ cell })"></td>
 * <th x-html="FlexRender({ footer: header })"></th>
 * ```
 *
 * This replaces calling `flexRender` directly like this:
 * ```ts
 * flexRender(cell.column.columnDef.cell, cell.getContext())
 * flexRender(header.column.columnDef.header, header.getContext())
 * flexRender(footer.column.columnDef.footer, footer.getContext())
 * ```
 */
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
 * Simplified wrapper of `flexRender`. Use this utility function to render headers, cells, or footers with custom markup.
 * Only one prop (`cell`, `header`, or `footer`) may be passed.
 * @example
 * ```html
 * <th x-html="FlexRender({ header })"></th>
 * <td x-html="FlexRender({ cell })"></td>
 * <th x-html="FlexRender({ footer: header })"></th>
 * ```
 */
export function FlexRender<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: FlexRenderProps<TFeatures, TData, TValue>): any {
  if ('cell' in props && props.cell) {
    const cell = props.cell
    const definition = cell.column.columnDef
    const groupingCell = cell as typeof cell & {
      getIsAggregated?: () => boolean
      getIsPlaceholder?: () => boolean
    }

    if (groupingCell.getIsAggregated?.()) {
      return flexRender(getAggregatedCellRender(cell), cell.getContext())
    }

    if (groupingCell.getIsPlaceholder?.()) {
      return null
    }

    return flexRender(definition.cell, cell.getContext())
  }

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
