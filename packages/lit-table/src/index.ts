import { ReactiveController, ReactiveControllerHost } from 'lit'
import {
  RowData,
  Table,
  TableOptions,
  TableOptionsResolved,
  TableState,
  createTable,
} from '@tanstack/table-core'

export * from '@tanstack/table-core'

export function flexRender<TProps>(
  Comp: ((props: TProps) => string) | string | undefined,
  props: TProps
): string | null {
  if (!Comp) return null

  if (typeof Comp === 'function') {
    return Comp(props)
  }

  return Comp
}

export class TableController<TData extends RowData>
  implements ReactiveController
{
  host: ReactiveControllerHost

  private table: Table<TData> | null = null

  private _tableState: TableState | null = null

  constructor(host: ReactiveControllerHost) {
    ;(this.host = host).addController(this)
  }

  public getTable(options: TableOptions<TData>) {
    const resolvedOptions: TableOptionsResolved<TData> = {
      state: {},
      onStateChange: () => {}, // noop
      renderFallbackValue: null,
      ...options,
    }

    if (!this.table) {
      this.table = createTable(resolvedOptions)
      this._tableState = this.table.initialState
    }

    this.table.setOptions({
      ...resolvedOptions,
      state: { ...this._tableState, ...(options.state || {}) },
      onStateChange: (updater: any) => {
        this._tableState = updater
        this.host.requestUpdate()

        options.onStateChange?.(updater)
      },
    })

    return this.table
  }

  hostConnected() {}
}
