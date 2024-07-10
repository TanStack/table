import { _createTable } from '@tanstack/table-core'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableOptionsResolved,
  TableState,
} from '@tanstack/table-core'
import type {
  ReactiveController,
  ReactiveControllerHost,
  TemplateResult,
} from 'lit'

export * from '@tanstack/table-core'

export function flexRender<TProps>(
  Comp: ((_props: TProps) => string) | string | TemplateResult | undefined,
  props: TProps,
): TemplateResult | string | null {
  if (!Comp) return null

  if (typeof Comp === 'function') {
    return Comp(props)
  }

  return Comp
}

export class TableController<
  TFeatures extends TableFeatures,
  TData extends RowData,
> implements ReactiveController
{
  host: ReactiveControllerHost

  private tableInstance: Table<TFeatures, TData> | null = null

  private _tableState: TableState | null = null

  constructor(host: ReactiveControllerHost) {
    ;(this.host = host).addController(this)
  }

  public table(options: TableOptions<TFeatures, TData>) {
    if (!this.tableInstance) {
      const resolvedOptions: TableOptionsResolved<TFeatures, TData> = {
        state: {},
        onStateChange: () => {}, // noop
        renderFallbackValue: null,
        ...options,
      }

      this.tableInstance = _createTable(resolvedOptions)
      this._tableState = {
        ...this.tableInstance.initialState,
        ...options.state,
      }
    }

    this.tableInstance.setOptions((prev) => ({
      ...prev,
      state: { ...this._tableState, ...options.state },
      onStateChange: (updater: any) => {
        this._tableState = updater(this._tableState)
        this.host.requestUpdate()
        options.onStateChange?.(updater)
      },
    }))

    return this.tableInstance
  }

  hostDisconnected() {}
}
