import type { Cell } from './types/Cell'
import type { Header } from './types/Header'
import type { TableFeatures } from './types/TableFeatures'
import type { CellData, RowData } from './types/type-utils'

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
    return flexRender(props.cell.column.columnDef.cell, props.cell.getContext())
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
