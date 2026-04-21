import { createAtom, createStore } from '@tanstack/store'
import { coreFeatures } from '../coreFeatures'
import type { Atom } from '@tanstack/store'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table, Table_Internal } from '../../types/Table'
import type { TableOptions } from '../../types/TableOptions'
import type { TableState } from '../../types/TableState'

export function getInitialTableState<TFeatures extends TableFeatures>(
  features: TFeatures,
  initialState: Partial<TableState<TFeatures>> | undefined = {},
): TableState<TFeatures> {
  Object.values(features).forEach((feature) => {
    initialState =
      feature.getInitialState?.(initialState as TableState<TFeatures>) ??
      initialState
  })
  return structuredClone(initialState) as TableState<TFeatures>
}

export function constructTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(tableOptions: TableOptions<TFeatures, TData>): Table<TFeatures, TData> {
  const table = {
    _features: { ...coreFeatures, ...tableOptions._features },
    _rowModels: {},
    _rowModelFns: {},
    get options() {
      return this.optionsStore.state
    },
    set options(value) {
      this.optionsStore.setState(() => value)
    },
  } as Table_Internal<TFeatures, TData>

  const featuresList: Array<TableFeature<{}>> = Object.values(table._features)

  const defaultOptions = featuresList.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultTableOptions?.(table))
  }, {}) as TableOptions<TFeatures, TData>

  table.optionsStore = createStore({
    ...defaultOptions,
    ...tableOptions,
  })

  table.initialState = getInitialTableState(
    table._features,
    table.options.initialState,
  )

  const stateKeys = Object.keys(table.initialState) as Array<
    keyof TableState<TFeatures>
  >

  const baseAtomsMap: Record<string, Atom<any>> = {}
  const atomsMap: Record<string, Atom<any>> = {}

  const makeDerivedAtom = (key: string) =>
    createAtom(() => {
      // Reading optionsStore.state keeps precedence reactive to setOptions.
      const opts = table.optionsStore.state
      const externalAtom = (
        opts.atoms as Record<string, Atom<any>> | undefined
      )?.[key]
      if (externalAtom) {
        return externalAtom.get()
      }
      const externalState = (
        opts.state as Record<string, unknown> | undefined
      )?.[key]
      if (externalState !== undefined) {
        return externalState
      }
      // Accessing through the proxy lazily creates the base atom if missing.
      return baseAtomsProxy[key]!.get()
    }) as unknown as Atom<any>

  for (const key of stateKeys) {
    baseAtomsMap[key as string] = createAtom(
      table.initialState[key],
    ) as unknown as Atom<any>
  }

  const baseAtomsProxy = new Proxy(baseAtomsMap, {
    get(target, prop) {
      if (typeof prop !== 'string') return (target as any)[prop]
      if (!(prop in target)) {
        target[prop] = createAtom(undefined) as unknown as Atom<any>
      }
      return target[prop]
    },
  })

  // Pre-build derived atoms for known keys so the initial store snapshot is
  // stable and subscriptions wire up eagerly. Unknown keys get a derived atom
  // lazily via the proxy below.
  for (const key of stateKeys) {
    atomsMap[key as string] = makeDerivedAtom(key as string)
  }

  const atomsProxy = new Proxy(atomsMap, {
    get(target, prop) {
      if (typeof prop !== 'string') return (target as any)[prop]
      if (!(prop in target)) {
        target[prop] = makeDerivedAtom(prop)
      }
      return target[prop]
    },
  })

  table.baseAtoms = baseAtomsProxy as unknown as typeof table.baseAtoms
  table.atoms = atomsProxy as unknown as typeof table.atoms

  table.store = createStore(() => {
    const snapshot = {} as TableState<TFeatures>
    for (const key of stateKeys) {
      ;(snapshot as any)[key] = atomsProxy[key as string]!.get()
    }
    return snapshot
  }) as typeof table.store

  if (
    process.env.NODE_ENV === 'development' &&
    (tableOptions.debugAll || tableOptions.debugTable)
  ) {
    const features = Object.keys(table._features)
    const rowModels = Object.keys(table.options._rowModels || {})
    const states = Object.keys(table.initialState)

    console.log(
      `Constructing Table Instance

  Features:   ${features.join('\n              ')}

  Row Models: ${rowModels.length ? rowModels.join('\n              ') : '(none)'}

  States:     ${states.join('\n              ')}`,
    )
  }

  for (const feature of featuresList) {
    feature.constructTableAPIs?.(table)
  }

  return table
}
