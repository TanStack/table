import { shallow, useSelector } from '@tanstack/preact-store'
import type { Atom, ReadonlyAtom } from '@tanstack/preact-store'
import type {
  RowData,
  Table,
  TableFeatures,
  TableState,
} from '@tanstack/table-core'
import type { ComponentChildren } from 'preact'

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
  children: ((state: TSelected) => ComponentChildren) | ComponentChildren
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
  children: ((state: TSourceValue) => ComponentChildren) | ComponentChildren
}

/**
 * Subscribe to a projected value from a source (atom or store).
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
  children: ((state: TSelected) => ComponentChildren) | ComponentChildren
}

/**
 * Subscribe to a single source — atom or store (identity or projected).
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
 * A Preact component that allows you to subscribe to the table state.
 *
 * For `table.Subscribe` from `useTable`, prefer that API — it uses overloads so
 * JSX contextual typing works. This standalone component uses a union `props` type.
 */
export function Subscribe<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSourceValue,
>(
  props: SubscribePropsWithSourceIdentity<TFeatures, TData, TSourceValue>,
): ComponentChildren
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
): ComponentChildren
export function Subscribe<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
>(
  props: SubscribePropsWithStore<TFeatures, TData, TSelected>,
): ComponentChildren
export function Subscribe<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
  TSourceValue,
>(
  props: SubscribeProps<TFeatures, TData, TSelected, TSourceValue>,
): ComponentChildren {
  const source = 'source' in props ? props.source : props.table.store
  const selectFn =
    'source' in props ? (props.selector ?? ((x: unknown) => x)) : props.selector

  const selected = useSelector(
    source as never,
    selectFn as Parameters<typeof useSelector>[1],
    {
      compare: shallow,
    },
  ) as TSelected

  return typeof props.children === 'function'
    ? (props.children as (state: TSelected) => ComponentChildren)(selected)
    : props.children
}
