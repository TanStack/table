import { Match, Show, Switch, createComponent } from 'solid-js'
import { getAggregatedCellRender } from '@tanstack/table-core/flex-render'
import type { JSX } from 'solid-js'
import type {
  Cell,
  CellData,
  Header,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'

/**
 * Renders a Solid table template value with the provided context props.
 *
 * Use this for custom header, cell, or footer renderers when you need the
 * lower-level function form. Most Solid UIs can use the `FlexRender` component
 * instead.
 *
 * @example
 * ```tsx
 * flexRender(cell.column.columnDef.cell, cell.getContext())
 * ```
 */
export function flexRender<TProps>(
  Comp: ((_props: TProps) => JSX.Element) | JSX.Element | undefined,
  props: TProps,
): JSX.Element {
  if (Comp === null || Comp === undefined) return null

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
      {/* `keyed` is required so content re-renders when the prop changes to a
          new cell/header instance (e.g. new data under a persistent virtual
          item). Non-keyed Match only re-runs children on truthiness changes. */}
      <Match keyed when={'cell' in props && props.cell}>
        {(c) => {
          const def = c.column.columnDef
          // When the column-grouping feature is registered, a cell can be in
          // one of three special modes that should not render `columnDef.cell`
          // directly:
          //   - aggregated: render `columnDef.aggregatedCell` (falling back to
          //     `columnDef.cell` if the column did not define one)
          //   - placeholder: a duplicate value within a group — render nothing
          //   - grouped: the group header cell — fall through to
          //     `columnDef.cell`; consumers that want a custom group header
          //     typically branch on `cell.getIsGrouped()` themselves first
          // The optional-chaining + cast keeps this safe when the grouping
          // feature is not registered.
          const groupingCell = c as typeof c & {
            getIsAggregated?: () => boolean
            getIsPlaceholder?: () => boolean
          }

          return (
            <Show
              when={groupingCell.getIsAggregated?.()}
              fallback={
                <Show when={!groupingCell.getIsPlaceholder?.()} fallback={null}>
                  {flexRender(def.cell, c.getContext())}
                </Show>
              }
            >
              {flexRender(getAggregatedCellRender(c), c.getContext())}
            </Show>
          )
        }}
      </Match>
      <Match keyed when={'header' in props && props.header}>
        {(header) =>
          flexRender(header.column.columnDef.header, header.getContext())
        }
      </Match>
      <Match keyed when={'footer' in props && props.footer}>
        {(footer) =>
          flexRender(footer.column.columnDef.footer, footer.getContext())
        }
      </Match>
    </Switch>
  )
}
