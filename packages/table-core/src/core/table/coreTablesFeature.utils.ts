import { cloneState, functionalUpdate } from '../../utils'
import type { Atom } from '@tanstack/store'
import type { BaseAtoms } from './coreTablesFeature.types'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { TableOptions } from '../../types/TableOptions'
import type { TableState } from '../../types/TableState'

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

  // set external state to internal base atoms
  for (const key of Object.keys(newOptions.state ?? {}) as Array<
    keyof typeof newOptions.state
  >) {
    const baseAtom: Atom<TableState<any>> =
      table.baseAtoms[key as keyof BaseAtoms<TFeatures>]
    const externalState = newOptions.state?.[key]
    const internalState = baseAtom.get()
    if (externalState !== internalState) {
      baseAtom.set(() => externalState)
    }
  }
}
