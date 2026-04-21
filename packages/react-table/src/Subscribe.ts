'use client'

import { shallow, useSelector } from '@tanstack/react-store'
import type { Atom, ReadonlyAtom } from '@tanstack/react-store'
import type {
  RowData,
  Table,
  TableFeatures,
  TableState,
} from '@tanstack/table-core'
import type { FunctionComponent, ReactNode } from 'react'

/**
 * Subscribe to `table.store` (full table state). The selector receives the full
 * {@link TableState}.
 */
export type SubscribePropsWithStore<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
> = {
  table: Table<TFeatures, TData>
  /**
   * Select from full table state. Re-renders when the selected value changes
   * (shallow compare).
   *
   * Required in store mode so you never accidentally subscribe to the whole
   * store without an explicit projection.
   */
  selector: (state: TableState<TFeatures>) => TSelected
  children: ((state: TSelected) => ReactNode) | ReactNode
}

/**
 * Subscribe to the full value of a slice atom (e.g. `table.atoms.rowSelection`).
 * Omitting `selector` is equivalent to the identity selector — children receive
 * `TAtomValue`.
 */
export type SubscribePropsWithAtomIdentity<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TAtomValue,
> = {
  table: Table<TFeatures, TData>
  atom: Atom<TAtomValue> | ReadonlyAtom<TAtomValue>
  selector?: undefined
  children: ((state: TAtomValue) => ReactNode) | ReactNode
}

/**
 * Subscribe to a projected value from a slice atom. The selector receives the
 * atom value; children receive the projected `TSelected`.
 */
export type SubscribePropsWithAtomWithSelector<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TAtomValue,
  TSelected,
> = {
  table: Table<TFeatures, TData>
  atom: Atom<TAtomValue> | ReadonlyAtom<TAtomValue>
  selector: (state: TAtomValue) => TSelected
  children: ((state: TSelected) => ReactNode) | ReactNode
}

/**
 * Subscribe to a single slice atom (identity or projected). Prefer
 * {@link SubscribePropsWithAtomIdentity} or {@link SubscribePropsWithAtomWithSelector}
 * for clearer inference when `selector` is omitted.
 */
export type SubscribePropsWithAtom<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TAtomValue,
  TSelected = TAtomValue,
> =
  | SubscribePropsWithAtomIdentity<TFeatures, TData, TAtomValue>
  | SubscribePropsWithAtomWithSelector<TFeatures, TData, TAtomValue, TSelected>

export type SubscribeProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = unknown,
  TAtomValue = unknown,
> =
  | SubscribePropsWithStore<TFeatures, TData, TSelected>
  | SubscribePropsWithAtomIdentity<TFeatures, TData, TAtomValue>
  | SubscribePropsWithAtomWithSelector<TFeatures, TData, TAtomValue, TSelected>

/**
 * A React component that allows you to subscribe to the table state.
 *
 * This is useful for opting into state re-renders for specific parts of the table state.
 *
 * For `table.Subscribe` from `useTable`, prefer that API — it uses overloads so JSX
 * contextual typing works. This standalone component uses a union `props` type.
 *
 * @example
 * ```tsx
 * // As a standalone component — full store
 * <Subscribe table={table} selector={(state) => ({ rowSelection: state.rowSelection })}>
 *   {({ rowSelection }) => (
 *     <div>Selected rows: {Object.keys(rowSelection).length}</div>
 *   )}
 * </Subscribe>
 * ```
 *
 * @example
 * ```tsx
 * // Entire slice atom (no selector)
 * <Subscribe table={table} atom={table.atoms.rowSelection}>
 *   {(rowSelection) => <div>...</div>}
 * </Subscribe>
 * ```
 *
 * @example
 * ```tsx
 * // Project atom value (e.g. one row’s selection)
 * <Subscribe
 *   table={table}
 *   atom={table.atoms.rowSelection}
 *   selector={(rowSelection) => rowSelection?.[row.id]}
 * >
 *   {(selected) => <tr data-selected={!!selected}>...</tr>}
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
  TAtomValue,
>(
  props: SubscribePropsWithAtomIdentity<TFeatures, TData, TAtomValue>,
): ReturnType<FunctionComponent>
export function Subscribe<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TAtomValue,
  TSelected,
>(
  props: SubscribePropsWithAtomWithSelector<
    TFeatures,
    TData,
    TAtomValue,
    TSelected
  >,
): ReturnType<FunctionComponent>
export function Subscribe<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
>(
  props: SubscribePropsWithStore<TFeatures, TData, TSelected>,
): ReturnType<FunctionComponent>
export function Subscribe<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
  TAtomValue,
>(
  props: SubscribeProps<TFeatures, TData, TSelected, TAtomValue>,
): ReturnType<FunctionComponent> {
  const source = 'atom' in props ? props.atom : props.table.store
  const selectFn =
    'atom' in props ? (props.selector ?? ((x: unknown) => x)) : props.selector

  const selected = useSelector(
    // Atom and store share the same selection protocol; union args need a widen for TS.
    source,
    selectFn as Parameters<typeof useSelector>[1],
    {
      compare: shallow,
    },
  ) as TSelected

  return typeof props.children === 'function'
    ? (props.children as (state: TSelected) => ReactNode)(selected)
    : props.children
}
