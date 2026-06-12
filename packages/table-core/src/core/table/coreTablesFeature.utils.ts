import { cloneState, functionalUpdate } from '../../utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { TableOptions } from '../../types/TableOptions'

/**
 * Synchronizes externally controlled state slices into the table's base atoms.
 *
 * This keeps legacy `options.state` values reflected in the atom graph so
 * derived atoms, stores, and table APIs read a consistent snapshot.
 *
 * @example
 * ```ts
 * table_syncExternalStateToBaseAtoms(table)
 * ```
 */
export function table_syncExternalStateToBaseAtoms<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): void {
  const state = table.options.state
  if (!state) {
    return
  }

  table._reactivity.batch(() => {
    for (const key in state) {
      const baseAtom = (table.baseAtoms as Record<string, any>)[key]
      if (!baseAtom) {
        continue
      }

      const externalState = state[key as keyof typeof state]
      if (externalState !== baseAtom.get()) {
        baseAtom.set(() => externalState)
      }
    }
  })
}

/**
 * Resets all internal table base atoms to `table.initialState`.
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
}

/**
 * Merges new table options with the current resolved options.
 *
 * If `options.mergeOptions` is provided, it owns the merge behavior; otherwise
 * options are shallow-merged.
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
  if (table.options.mergeOptions) {
    return table.options.mergeOptions(
      table.options as TableOptions<TFeatures, TData>,
      newOptions,
    )
  }

  return {
    ...table.options,
    ...newOptions,
  }
}

/**
 * Updates the table options object.
 *
 * The updater receives the current resolved options and the merged result is
 * immediately assigned to the table instance.
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
  // table static options that should never change after initialization
  const { features, atoms, initialState } = table.options
  const mergedOptions = Object.assign(table_mergeOptions(table, newOptions), {
    // Once the table instance is created those properties should never change after initialization,
    // so we assign them back preserving the `table_mergeOptions` object reference
    features,
    atoms,
    initialState,
  })

  if (table.optionsStore) {
    table.optionsStore.set(() => mergedOptions)
  } else {
    table.options = mergedOptions
  }
  table_syncExternalStateToBaseAtoms(table)
}
