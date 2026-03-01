'use client'

import { useStore } from '@tanstack/react-store'
import type {
  NoInfer,
  RowData,
  Table,
  TableFeatures,
  TableState,
} from '@tanstack/table-core'
import type { FunctionComponent, ReactNode } from 'react'

export type SubscribeProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
> = {
  /**
   * The table instance to subscribe to. Required when using as a standalone component.
   * Not needed when using as `table.Subscribe`.
   */
  table: Table<TFeatures, TData>
  /**
   * A selector function that selects the part of the table state to subscribe to.
   * This allows for fine-grained reactivity by only re-rendering when the selected state changes.
   */
  selector: (state: NoInfer<TableState<TFeatures>>) => TSelected
  /**
   * The children to render. Can be a function that receives the selected state, or a React node.
   */
  children: ((state: TSelected) => ReactNode) | ReactNode
}

/**
 * A React component that allows you to subscribe to the table state.
 *
 * This is useful for opting into state re-renders for specific parts of the table state.
 *
 * @example
 * ```tsx
 * // As a standalone component
 * <Subscribe table={table} selector={(state) => ({ rowSelection: state.rowSelection })}>
 *   {({ rowSelection }) => (
 *     <div>Selected rows: {Object.keys(rowSelection).length}</div>
 *   )}
 * </Subscribe>
 * ```
 *
 * @example
 * ```tsx
 * // As table.Subscribe (table instance method)
 * <table.Subscribe selector={(state) => ({ rowSelection: state.rowSelection })}>
 *   {({ rowSelection }) => (
 *     <div>Selected rows: {Object.keys(rowSelection).length}</div>
 *   )}
 * </table.Subscribe>
 * ```
 */
export function Subscribe<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
>(
  props: SubscribeProps<TFeatures, TData, TSelected>,
): ReturnType<FunctionComponent> {
  const selected = useStore(props.table.store, props.selector)

  return typeof props.children === 'function'
    ? props.children(selected)
    : props.children
}
