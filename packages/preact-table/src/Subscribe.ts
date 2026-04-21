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
  children: ((state: TAtomValue) => ComponentChildren) | ComponentChildren
}

/**
 * Subscribe to a projected value from a slice atom.
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
  children: ((state: TSelected) => ComponentChildren) | ComponentChildren
}

/**
 * Subscribe to a single slice atom (identity or projected).
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
 * A Preact component that allows you to subscribe to the table state.
 *
 * For `table.Subscribe` from `useTable`, prefer that API — it uses overloads so
 * JSX contextual typing works. This standalone component uses a union `props` type.
 */
export function Subscribe<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TAtomValue,
>(
  props: SubscribePropsWithAtomIdentity<TFeatures, TData, TAtomValue>,
): ComponentChildren
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
  TAtomValue,
>(
  props: SubscribeProps<TFeatures, TData, TSelected, TAtomValue>,
): ComponentChildren {
  const source = 'atom' in props ? props.atom : props.table.store
  const selectFn =
    'atom' in props ? (props.selector ?? ((x: unknown) => x)) : props.selector

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
