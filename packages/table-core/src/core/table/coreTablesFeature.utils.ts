import { cloneState, functionalUpdate } from '../../utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { TableOptions } from '../../types/TableOptions'

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

export function table_reset<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): void {
  const snap = cloneState(table.initialState)
  table._reactivity.batch(() => {
    for (const key of Object.keys(snap) as Array<keyof typeof snap>) {
      ;(table.baseAtoms as any)[key].set(snap[key] as any)
    }
  })
}

export function table_mergeOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  newOptions: TableOptions<TFeatures, TData>,
) {
  if (table.options.mergeOptions) {
    return table.options.mergeOptions(table.options, newOptions)
  }

  return {
    ...table.options,
    ...newOptions,
  }
}

export function table_setOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<TableOptions<TFeatures, TData>>,
): void {
  const newOptions = functionalUpdate(updater, table.options)
  const mergedOptions = table_mergeOptions(table, newOptions)
  if (table.optionsStore) {
    table.optionsStore.set(() => mergedOptions)
  } else {
    table.options = mergedOptions
  }
  table_syncExternalStateToBaseAtoms(table)
}
