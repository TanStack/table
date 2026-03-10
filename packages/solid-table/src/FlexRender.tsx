import { Match, Switch, createComponent } from 'solid-js'
import type { JSX } from 'solid-js'
import type {
  Cell,
  CellData,
  Header,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'

export function flexRender<TProps>(
  Comp: ((_props: TProps) => JSX.Element) | JSX.Element | undefined,
  props: TProps,
): JSX.Element {
  if (!Comp) return null

  if (typeof Comp === 'function') {
    return createComponent(Comp, props as any)
  }

  return Comp
}

/**
 * Simplified component wrapper of `flexRender`. Use this utility component to render headers, cells, or footers with custom markup.
 * Only one prop (`cell`, `header`, or `footer`) may be passed.
 * @example <FlexRender cell={cell} />
 * @example <FlexRender header={header} />
 * @example <FlexRender footer={footer} />
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
 * Simplified component wrapper of `flexRender`. Use this utility component to render headers, cells, or footers with custom markup.
 * Only one prop (`cell`, `header`, or `footer`) may be passed.
 * @example
 * ```tsx
 * <FlexRender cell={cell} />
 * <FlexRender header={header} />
 * <FlexRender footer={footer} />
 * ```
 *
 * This replaces calling `flexRender` directly like this:
 * ```tsx
 * flexRender(cell.column.columnDef.cell, cell.getContext())
 * flexRender(header.column.columnDef.header, header.getContext())
 * flexRender(footer.column.columnDef.footer, footer.getContext())
 * ```
 */
export function FlexRender<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: FlexRenderProps<TFeatures, TData, TValue>) {
  return (
    <Switch>
      <Match when={'cell' in props && props.cell}>
        {(cell) =>
          flexRender(cell().column.columnDef.cell, cell().getContext())
        }
      </Match>
      <Match when={'header' in props && props.header}>
        {(header) =>
          flexRender(header().column.columnDef.header, header().getContext())
        }
      </Match>
      <Match when={'footer' in props && props.footer}>
        {(footer) =>
          flexRender(footer().column.columnDef.footer, footer().getContext())
        }
      </Match>
    </Switch>
  )
}
