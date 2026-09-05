import { getAggregatedCellRender } from '@tanstack/table-core/flex-render'
import type {
  Cell,
  CellData,
  Header,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'
import type { TemplateResult, noChange, nothing } from 'lit'
import type { DirectiveResult } from 'lit/directive.js'

export type LitRenderable =
  | TemplateResult
  | DirectiveResult
  | Node
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | typeof nothing
  | typeof noChange
  | Iterable<LitRenderable>

/**
 * Renders a Lit table template value with the provided context props.
 *
 * Use this lower-level helper for custom header, cell, or footer renderers when
 * you already have the render function and context. `FlexRender` is the
 * convenience wrapper for table cell/header/footer objects.
 *
 * @example
 * ```ts
 * flexRender(cell.column.columnDef.cell, cell.getContext())
 * ```
 */
export function flexRender<TProps>(
  Comp: ((props: TProps) => LitRenderable) | LitRenderable,
  props: TProps,
): LitRenderable {
  if (Comp === null || Comp === undefined) return null

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
>(props: FlexRenderProps<TFeatures, TData, TValue>): LitRenderable {
  if ('cell' in props && props.cell) {
    const cell = props.cell
    const columnDef = cell.column.columnDef
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

    return flexRender(columnDef.cell, cell.getContext())
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
