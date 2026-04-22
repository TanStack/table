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
 * Subscribe to the full value of a source (e.g. `table.atoms.rowSelection` or
 * `table.optionsStore`). Omitting `selector` is equivalent to the identity
 * selector — children receive `TSourceValue`.
 */
export type SubscribePropsWithSourceIdentity<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSourceValue,
> = {
  table: Table<TFeatures, TData>
  source: Atom<TSourceValue> | ReadonlyAtom<TSourceValue>
  selector?: undefined
  children: ((state: TSourceValue) => ReactNode) | ReactNode
}

/**
 * Subscribe to a projected value from a source (atom or store). The selector
 * receives the source value; children receive the projected `TSelected`.
 */
export type SubscribePropsWithSourceWithSelector<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSourceValue,
  TSelected,
> = {
  table: Table<TFeatures, TData>
  source: Atom<TSourceValue> | ReadonlyAtom<TSourceValue>
  selector: (state: TSourceValue) => TSelected
  children: ((state: TSelected) => ReactNode) | ReactNode
}

/**
 * Subscribe to a single source — atom or store (identity or projected). Prefer
 * {@link SubscribePropsWithSourceIdentity} or {@link SubscribePropsWithSourceWithSelector}
 * for clearer inference when `selector` is omitted.
 */
export type SubscribePropsWithSource<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSourceValue,
  TSelected = TSourceValue,
> =
  | SubscribePropsWithSourceIdentity<TFeatures, TData, TSourceValue>
  | SubscribePropsWithSourceWithSelector<
      TFeatures,
      TData,
      TSourceValue,
      TSelected
    >

export type SubscribeProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = unknown,
  TSourceValue = unknown,
> =
  | SubscribePropsWithStore<TFeatures, TData, TSelected>
  | SubscribePropsWithSourceIdentity<TFeatures, TData, TSourceValue>
  | SubscribePropsWithSourceWithSelector<
      TFeatures,
      TData,
      TSourceValue,
      TSelected
    >

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
 * // Entire source (atom or store) — no selector
 * <Subscribe table={table} source={table.atoms.rowSelection}>
 *   {(rowSelection) => <div>...</div>}
 * </Subscribe>
 * ```
 *
 * @example
 * ```tsx
 * // Project source value (e.g. one row’s selection)
 * <Subscribe
 *   table={table}
 *   source={table.atoms.rowSelection}
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
  TSourceValue,
>(
  props: SubscribePropsWithSourceIdentity<TFeatures, TData, TSourceValue>,
): ReturnType<FunctionComponent>
export function Subscribe<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSourceValue,
  TSelected,
>(
  props: SubscribePropsWithSourceWithSelector<
    TFeatures,
    TData,
    TSourceValue,
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
  TSourceValue,
>(
  props: SubscribeProps<TFeatures, TData, TSelected, TSourceValue>,
): ReturnType<FunctionComponent> {
  const source = 'source' in props ? props.source : props.table.store
  const selectFn =
    'source' in props ? (props.selector ?? ((x: unknown) => x)) : props.selector

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
