import { tracked } from '@glimmer/tracking'
import {
  associateDestroyableChild,
  registerDestructor,
} from '@ember/destroyable'
import { constructTable } from '@tanstack/table-core'
import { emberReactivity } from './reactivity.ts'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
} from '@tanstack/table-core'
import type { TableReactivityBindings } from '@tanstack/table-core/reactivity'

class EmberTableManager<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  @tracked _revision = 0

  _table: Table<TFeatures, TData>
  _getOptions: () => TableOptions<TFeatures, TData>
  _reactivity: TableReactivityBindings

  constructor(
    parent: object,
    getOptions: () => TableOptions<TFeatures, TData>,
  ) {
    this._getOptions = getOptions
    this._reactivity = emberReactivity()

    const options = getOptions()

    this._table = constructTable<TFeatures, TData>({
      ...options,
      features: {
        coreReactivityFeature: this._reactivity,
        ...options.features,
      },
      mergeOptions: (
        defaultOptions: TableOptions<TFeatures, TData>,
        newOptions: Partial<TableOptions<TFeatures, TData>>,
      ) => ({
        ...defaultOptions,
        ...newOptions,
      }),
    })

    let pendingUpdate = false
    const storeSub = this._table.store.subscribe(() => {
      if (!pendingUpdate) {
        pendingUpdate = true
        queueMicrotask(() => {
          pendingUpdate = false
          this._revision++
        })
      }
    })

    associateDestroyableChild(parent, this)
    registerDestructor(this, () => {
      storeSub.unsubscribe()
      this._reactivity.unmount?.()
    })
  }

  get table(): Table<TFeatures, TData> {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this._revision

    const options = this._getOptions()
    this._table.setOptions((prev) => ({
      ...prev,
      ...options,
    }))

    return this._table
  }
}

export function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  parent: object,
  getOptions: () => TableOptions<TFeatures, TData>,
): EmberTableManager<TFeatures, TData> {
  return new EmberTableManager(parent, getOptions)
}
