import React from 'react'
import type {
  Cell,
  CellData,
  Header,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'
import type { ComponentType, JSX, ReactNode } from 'react'

export type Renderable<TProps> = ReactNode | ComponentType<TProps>

function isReactComponent<TProps>(
  component: unknown,
): component is ComponentType<TProps> {
  return (
    isClassComponent(component) ||
    typeof component === 'function' ||
    isExoticComponent(component)
  )
}

function isClassComponent(component: any) {
  return (
    typeof component === 'function' &&
    (() => {
      const proto = Object.getPrototypeOf(component)
      return proto.prototype && proto.prototype.isReactComponent
    })()
  )
}

function isExoticComponent(component: any) {
  return (
    typeof component === 'object' &&
    typeof component.$$typeof === 'symbol' &&
    ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description)
  )
}

/**
 * If rendering headers, cells, or footers with custom markup, use flexRender instead of `cell.getValue()` or `cell.renderValue()`.
 * @example flexRender(cell.column.columnDef.cell, cell.getContext())
 */
export function flexRender<TProps extends object>(
  Comp: Renderable<TProps>,
  props: TProps,
): ReactNode | JSX.Element {
  return !Comp ? null : isReactComponent<TProps>(Comp) ? (
    <Comp {...props} />
  ) : (
    Comp
  )
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
  if ('cell' in props && props.cell) {
    const cell = props.cell
    const def = cell.column.columnDef
    // When the column-grouping feature is registered, a cell can be in one of
    // three special modes that should not render `columnDef.cell` directly:
    //   - aggregated: render `columnDef.aggregatedCell` (falling back to
    //     `columnDef.cell` if the column did not define one)
    //   - placeholder: a duplicate value within a group — render nothing
    //   - grouped: the group header cell — let the consumer render this; we
    //     fall through to `columnDef.cell` so the existing behavior is
    //     preserved (consumers that want a custom group header typically
    //     branch on `cell.getIsGrouped()` themselves before calling FlexRender)
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
        groupingDef.aggregatedCell ?? def.cell,
        cell.getContext(),
      )
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
