import {
  constructTable,
  coreFeatures,
  getInitialTableState,
  isFunction,
} from '@tanstack/table-core'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { ReactiveController, ReactiveControllerHost } from 'lit'

export class TableController<
  TFeatures extends TableFeatures,
  TData extends RowData,
> implements ReactiveController
{
  host: ReactiveControllerHost

  private tableInstance: Table<TFeatures, TData> | null = null

  private state: TableState<TFeatures> = {} as TableState<TFeatures>

  constructor(host: ReactiveControllerHost) {
    ;(this.host = host).addController(this)
  }

  public table(tableOptions: TableOptions<TFeatures, TData>) {
    if (!this.tableInstance) {
      const _features = { ...coreFeatures, ...tableOptions._features }

      this.state = {
        ...getInitialTableState(_features, tableOptions.initialState),
        ...tableOptions.state,
      }

      const statefulOptions: TableOptions<TFeatures, TData> = {
        ...tableOptions,
        state: { ...this.state, ...tableOptions.state },
        onStateChange: (updater) => {
          this.state = isFunction(updater) ? updater(this.state) : updater
          this.host.requestUpdate()
          tableOptions.onStateChange?.(updater)
        },
      }

      this.tableInstance = constructTable(statefulOptions)
    }

    // this.tableInstance.setOptions((prev) => ({
    //   ...prev,
    //   state: { ...this.state, ...tableOptions.state },
    // }))

    return this.tableInstance
  }

  hostDisconnected() {}
}
