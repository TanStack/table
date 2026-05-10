import { shallow, useSelector } from '@tanstack/preact-store'
import type {
  Atom,
  ReadonlyAtom,
  ReadonlyStore,
  Store,
} from '@tanstack/preact-store'
import type { TableFeatures, TableState } from '@tanstack/table-core'
import type { ComponentChildren } from 'preact'

export type SubscribeSource<TValue> =
  | Atom<TValue>
  | ReadonlyAtom<TValue>
  | Store<TValue>
  | ReadonlyStore<TValue>

/**
 * Subscribe to `table.store` (full table state). The selector receives the full
 * {@link TableState}.
 */
export type SubscribePropsWithStore<
  TFeatures extends TableFeatures,
  TSelected,
> = {
  source: SubscribeSource<TableState<TFeatures>>
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
export type SubscribePropsWithSourceIdentity<TSourceValue> = {
  source: SubscribeSource<TSourceValue>
  selector?: undefined
  children: ((state: TSourceValue) => ComponentChildren) | ComponentChildren
}

/**
 * Subscribe to a projected value from a source (atom or store).
 */
export type SubscribePropsWithSourceWithSelector<TSourceValue, TSelected> = {
  source: SubscribeSource<TSourceValue>
  selector: (state: TSourceValue) => TSelected
  children: ((state: TSelected) => ComponentChildren) | ComponentChildren
}

/**
 * Subscribe to a single source — atom or store (identity or projected).
 */
export type SubscribePropsWithSource<TSourceValue, TSelected = TSourceValue> =
  | SubscribePropsWithSourceIdentity<TSourceValue>
  | SubscribePropsWithSourceWithSelector<TSourceValue, TSelected>

export type SubscribeProps<
  TFeatures extends TableFeatures,
  TSelected = unknown,
  TSourceValue = unknown,
> =
  | SubscribePropsWithStore<TFeatures, TSelected>
  | SubscribePropsWithSourceIdentity<TSourceValue>
  | SubscribePropsWithSourceWithSelector<TSourceValue, TSelected>

/**
 * A Preact component that allows you to subscribe to the table state.
 *
 * For `table.Subscribe` from `useTable`, prefer that API — it uses overloads so
 * JSX contextual typing works. This standalone component uses a union `props` type.
 *
 * @example
 * ```tsx
 * <Subscribe
 *   source={table.store}
 *   selector={(state) => ({ rowSelection: state.rowSelection })}
 * >
 *   {({ rowSelection }) => (
 *     <div>Selected rows: {Object.keys(rowSelection).length}</div>
 *   )}
 * </Subscribe>
 * ```
 *
 * @example
 * ```tsx
 * <Subscribe
 *   source={table.atoms.rowSelection}
 *   selector={(rowSelection) => rowSelection[row.id]}
 * >
 *   {(selected) => <input checked={!!selected} type="checkbox" />}
 * </Subscribe>
 * ```
 */
export function Subscribe<TSourceValue>(
  props: SubscribePropsWithSourceIdentity<TSourceValue>,
): ComponentChildren
export function Subscribe<TSourceValue, TSelected>(
  props: SubscribePropsWithSourceWithSelector<TSourceValue, TSelected>,
): ComponentChildren
export function Subscribe<TFeatures extends TableFeatures, TSelected>(
  props: SubscribePropsWithStore<TFeatures, TSelected>,
): ComponentChildren
export function Subscribe<
  TFeatures extends TableFeatures,
  TSelected,
  TSourceValue,
>(
  props: SubscribeProps<TFeatures, TSelected, TSourceValue>,
): ComponentChildren {
  const selected = useSelector(
    props.source as never,
    props.selector as Parameters<typeof useSelector>[1],
    {
      compare: shallow,
    },
  ) as TSelected

  return typeof props.children === 'function'
    ? (props.children as (state: TSelected) => ComponentChildren)(selected)
    : props.children
}
