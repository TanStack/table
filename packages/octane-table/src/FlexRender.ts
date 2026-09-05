// flexRender / FlexRender — plain TypeScript on purpose.
//
// Neither needs a slot-keyed hook (they call none) nor JSX (`createElement`
// builds the descriptor directly), so this file stays a normal `.ts` module and
// needs no `.tsrx.d.ts` sidecar.
import { createElement } from 'octane'
import { getAggregatedCellRender } from '@tanstack/table-core/flex-render'
import type { CellData, RowData, TableFeatures } from '@tanstack/table-core'
import type { OctaneNode } from 'octane'
import type { FlexRenderProps, Renderable } from './types'

/**
 * If rendering headers, cells, or footers with custom markup, use `flexRender`
 * instead of `cell.getValue()` or `cell.renderValue()`.
 *
 * @example flexRender(cell.column.columnDef.cell, cell.getContext())
 *
 * Port note: upstream additionally detects class components and
 * `react.memo`/`react.forward_ref` exotic objects. Both branches are dead in
 * octane — there are no class components or `forwardRef`, and octane's `memo()`
 * returns a plain function — so a component is exactly `typeof === 'function'`.
 * The descriptor `createElement` returns renders at value position; non-component
 * values (strings, numbers, pre-created descriptors) pass through as-is.
 */
export function flexRender<TProps extends object>(
  Comp: Renderable<TProps>,
  props: TProps,
): OctaneNode {
  return Comp == null
    ? null
    : typeof Comp === 'function'
      ? createElement(Comp, props)
      : Comp
}

/**
 * Simplified component wrapper of {@link flexRender}. Use this utility component
 * to render headers, cells, or footers with custom markup. Only one prop
 * (`cell`, `header`, or `footer`) may be passed.
 *
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
>(props: FlexRenderProps<TFeatures, TData, TValue>): OctaneNode {
  if ('cell' in props && props.cell) {
    const cell = props.cell
    const def = cell.column.columnDef
    // `columnGroupingFeature` is optional, so these only exist when grouping
    // is enabled — probe rather than require the feature in `TFeatures`.
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
    return flexRender(def.cell, cell.getContext())
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
