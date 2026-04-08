import type {
  Cell,
  CellData,
  Header,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'
import type { TemplateResult } from 'lit'

export function flexRender<TProps>(
  Comp:
    | ((props: TProps) => TemplateResult | string)
    | string
    | TemplateResult
    | undefined,
  props: TProps,
): TemplateResult | string | null {
  if (!Comp) return null

  if (typeof Comp === 'function') {
    return Comp(props)
  }

  return Comp
}

/**
 * Simplified component wrapper of `flexRender`. Use this utility function to render headers, cells, or footers with custom markup.
 * Only one prop (`cell`, `header`, or `footer`) may be passed.
 * @example
 * ```ts
 * ${FlexRender({ cell })}
 * ${FlexRender({ header })}
 * ${FlexRender({ footer: header })}
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
 * Simplified component wrapper of `flexRender`. Use this utility function to render headers, cells, or footers with custom markup.
 * Only one prop (`cell`, `header`, or `footer`) may be passed.
 * @example
 * ```ts
 * ${FlexRender({ cell })}
 * ${FlexRender({ header })}
 * ${FlexRender({ footer: header })}
 * ```
 *
 * This replaces calling `flexRender` directly like this:
 * ```ts
 * flexRender(cell.column.columnDef.cell, cell.getContext())
 * flexRender(header.column.columnDef.header, header.getContext())
 * flexRender(footer.column.columnDef.footer, footer.getContext())
 * ```
 */
export function FlexRender<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  props: FlexRenderProps<TFeatures, TData, TValue>,
): TemplateResult | string | null {
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
