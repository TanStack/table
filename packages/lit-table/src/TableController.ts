import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import { constructTable, coreFeatures } from '@tanstack/table-core'
import type { ReactiveController, ReactiveControllerHost } from 'lit'

export class TableController<
  TFeatures extends TableFeatures,
  TData extends RowData,
> implements ReactiveController {
  host: ReactiveControllerHost

  private _table: Table<TFeatures, TData> | null = null
  private _subscription?: () => void
  private _allState: TableState<TFeatures> | null = null

  constructor(host: ReactiveControllerHost) {
    ;(this.host = host).addController(this)
  }

  public table(
    tableOptions: TableOptions<TFeatures, TData>,
    selector: (state: TableState<TFeatures>) => any = () => ({}),
  ): Table<TFeatures, TData> & { state: any } {
    if (!this._table) {
      const _features = { ...coreFeatures, ...tableOptions._features }

      const statefulOptions: TableOptions<TFeatures, TData> = {
        ...tableOptions,
        _features,
        // Remove state and onStateChange - store handles it internally
        mergeOptions: (
          defaultOptions: TableOptions<TFeatures, TData>,
          newOptions: Partial<TableOptions<TFeatures, TData>>,
        ) => {
          return {
            ...defaultOptions,
            ...newOptions,
          }
        },
      }

      this._table = constructTable(statefulOptions) as Table<TFeatures, TData>
      this._allState = this._table.store.state

      // Wrap all "get*" methods to make them reactive
      Object.keys(this._table).forEach((key) => {
        const value = (this._table as any)[key]
        if (typeof value === 'function' && key.startsWith('get')) {
          const originalMethod = value.bind(this._table)
          ;(this._table as any)[key] = (...args: any[]) => {
            // Access state to create reactive dependency
            this._allState
            return originalMethod(...args)
          }
        }
      })

      // Set up subscription immediately when table is created
      // This ensures reactivity works even if hostConnected() was called before table creation
      this._setupSubscription()

      // Add Subscribe function
      // For Lit, this could be used with a directive or component
      // This is a basic implementation that can be enhanced
      ;(this._table as any).Subscribe = function Subscribe<TSelected>(props: {
        selector: (state: TableState<TFeatures>) => TSelected
        children: ((state: Readonly<TSelected>) => any) | any
      }) {
        // This is a simplified version - in practice, you'd want to use
        // a Lit directive or component to handle the subscription and rendering
        const selectedState = props.selector(this.store.state)

        if (typeof props.children === 'function') {
          return props.children(selectedState)
        }
        return props.children
      }
    }

    // Update options when they change
    this._table.setOptions((prev) => ({
      ...prev,
      ...tableOptions,
    }))

    // Capture selector and table for the state getter
    const selectorFn = selector
    const tableInstance = this._table

    return {
      ...this._table,
      get state() {
        return selectorFn(tableInstance.store.state)
      },
    } as Table<TFeatures, TData> & { state: any }
  }

  private _setupSubscription() {
    // Only set up if not already subscribed
    if (this._table && !this._subscription) {
      this._subscription = this._table.store.subscribe(({ currentVal }) => {
        this._allState = currentVal as TableState<TFeatures>
        // Request update to trigger re-render
        this.host.requestUpdate()
      })
    }
  }

  hostConnected() {
    // Set up subscription if table exists but subscription wasn't set up yet
    // (This handles the case where hostConnected() is called before table creation)
    this._setupSubscription()
  }

  hostDisconnected() {
    this._subscription?.()
    this._subscription = undefined
  }
}
