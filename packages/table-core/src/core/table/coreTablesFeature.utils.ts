import { cloneState, functionalUpdate } from '../../utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { TableOptions } from '../../types/TableOptions'
import type { TableState } from '../../types/TableState'

/**
 * Synchronizes externally controlled state slices into the table's base atoms.
 *
 * This keeps `options.state` values mirrored in the atom graph so derived
 * atoms, stores, and table APIs read a consistent snapshot.
 *
 * Adapters that update options during their host's render phase pass the
 * state snapshot captured by the committed render as `capturedState` — the
 * shared options object may already hold values from a newer render that
 * never commits. Pass `null` to publish nothing (a captured "no controlled
 * state"); omitting the argument reads the current `table.options.state`
 * instead. An optional `compare` suppresses semantically unchanged slice
 * writes; the default remains reference equality.
 *
 * The reactivity `commit` hook (when bound) is invoked inside the same batch,
 * even when nothing is published, so resolution changes with no atom write
 * (e.g. a controlled slice released back to internal ownership) still
 * invalidate subscribers.
 *
 * @example
 * ```ts
 * table_syncExternalStateToBaseAtoms(table)
 * table_syncExternalStateToBaseAtoms(table, capturedState ?? null, shallow)
 * ```
 */
export function table_syncExternalStateToBaseAtoms<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  capturedState?: Partial<TableState<TFeatures>> | null,
  compare: (currentState: unknown, externalState: unknown) => boolean = (
    currentState,
    externalState,
  ) => currentState === externalState,
): void {
  const state =
    capturedState === undefined ? table.options.state : capturedState

  table._reactivity.batch(() => {
    if (state) {
      for (const key in state) {
        const baseAtom = (table.baseAtoms as Record<string, any>)[key]
        if (!baseAtom) {
          continue
        }

        const externalState = state[key as keyof typeof state]
        const currentState = table._reactivity.untrack(() => baseAtom.get())
        if (!compare(currentState, externalState)) {
          baseAtom.set(() => externalState)
        }
      }
    }

    table._reactivity.commit?.()
  })
}

/**
 * Resets all internal table base atoms to `table.initialState`, then clears
 * transient instance data through registered feature reset hooks.
 *
 * This resets internally owned state slices in a single reactivity batch. Use
 * feature-specific reset APIs when a slice may be externally owned.
 *
 * @example
 * ```ts
 * table_reset(table)
 * ```
 */
export function table_reset<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): void {
  const snap = cloneState(table.initialState)
  table._reactivity.batch(() => {
    const keys = Object.keys(snap) as Array<keyof typeof snap>
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!
      ;(table.baseAtoms as any)[key].set(snap[key])
    }
  })

  const features = Object.values(table._features)
  for (let i = 0; i < features.length; i++) {
    features[i]!.resetTableInstanceData?.(table)
  }
}

/**
 * Merges new table options with the current resolved options.
 *
 * If `options.mergeOptions` is provided, it owns the merge behavior; otherwise
 * options are shallow-merged. Static options that should never change after
 * initialization are restored on a fresh object so framework merge helpers may
 * return readonly getter/proxy objects.
 *
 * @example
 * ```ts
 * const options = table_mergeOptions(table, nextOptions)
 * ```
 */
export function table_mergeOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  newOptions: TableOptions<TFeatures, TData>,
) {
  const { features, atoms, initialState } = table.options

  // simple merge if no mergeOptions is provided - performant
  if (!table.options.mergeOptions) {
    return {
      ...table.options,
      ...newOptions,
      features,
      atoms,
      initialState,
    }
  }

  // else use the mergeOptions function and preserve getters/setters
  const mergedOptions = table.options.mergeOptions(
    table.options as TableOptions<TFeatures, TData>,
    newOptions,
  )
  const descriptors: PropertyDescriptorMap = {
    ...Object.getOwnPropertyDescriptors(mergedOptions),
  }

  return Object.defineProperties(
    Object.create(Object.getPrototypeOf(mergedOptions)),
    {
      ...descriptors,
      features: {
        value: features,
        enumerable: true,
        configurable: true,
        writable: true,
      },
      atoms: {
        value: atoms,
        enumerable: true,
        configurable: true,
        writable: true,
      },
      initialState: {
        value: initialState,
        enumerable: true,
        configurable: true,
        writable: true,
      },
    },
  ) as TableOptions<TFeatures, TData>
}

/**
 * Updates the table options object.
 *
 * The updater receives the current resolved options and the merged result is
 * immediately assigned to the table instance.
 *
 * When the adapter's reactivity bindings declare `deferExternalStateSync`,
 * controlled state is NOT mirrored into the base atoms here — the adapter
 * publishes the captured state after its host framework commits by calling
 * `table_syncExternalStateToBaseAtoms` itself.
 *
 * @example
 * ```ts
 * table_setOptions(table, (old) => old)
 * ```
 */
export function table_setOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<TableOptions<TFeatures, TData>>,
): void {
  const newOptions = functionalUpdate(
    updater,
    table.options as TableOptions<TFeatures, TData>,
  )
  const mergedOptions = table_mergeOptions(table, newOptions)

  if (table.optionsStore) {
    table.optionsStore.set(() => mergedOptions)
  } else {
    table.options = mergedOptions
  }
  if (!table._reactivity.deferExternalStateSync) {
    table_syncExternalStateToBaseAtoms(table)
  }
}
