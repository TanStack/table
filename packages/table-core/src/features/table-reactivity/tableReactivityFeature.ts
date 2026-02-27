import type { RowData, TableFeature, TableFeatures } from '@tanstack/table-core'
import type { ReadonlyStore, Store } from '@tanstack/store'

interface TableReactivityFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {}

export function constructReactivityFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(bindings: {
  stateNotifier: () => unknown
}): TableFeature<TableReactivityFeatureConstructors<TFeatures, TData>> {
  return {
    constructTableAPIs: (table) => {
      table.store = bindStore(table.store, bindings.stateNotifier)
      // table.baseOptionsStore = bindStore(
      //   table.baseOptionsStore,
      //   bindings.optionsNotifier,
      // )
    },
  }
}

const bindStore = <T extends Store<any> | ReadonlyStore<any>>(
  store: T,
  notifier: () => unknown,
): T => {
  const stateDescriptor = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(store),
    'state',
  )!

  Object.defineProperties(store, {
    state: {
      get: () => {
        notifier()
        return stateDescriptor.get!.call(store)
      },
    },
  })
  return store
}
