import { constructTable } from '@tanstack/table-core'
import { createRenderPhaseSource } from '@tanstack/table-core/reactivity'
import {
  table_publishExternalState,
  table_setOptions,
} from '@tanstack/table-core/static-functions'
import { shallow } from '@tanstack/lit-store'
import { litReactivity } from './reactivity'
import { FlexRender } from './flexRender'

import { subscribe } from './subscribe-directive'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { ReactiveController, ReactiveControllerHost } from 'lit'

/**
 * The extended table type returned by the Lit adapter.
 * Includes a `Subscribe` method for fine-grained state subscriptions
 * and a `state` property with the selected state.
 */
export type LitTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = TableState<TFeatures>,
> = Omit<Table<TFeatures, TData>, 'store'> & {
  /**
   * @deprecated Prefer `table.state` for render reads,
   * `table.atoms.<slice>.get()` for slice snapshots, or `table.subscribe` for
   * explicit subscriptions. `table.store.state` is a current-value snapshot and
   * is easy to misuse in render code.
   */
  readonly store: Table<TFeatures, TData>['store']
  /**
   * Subscribes to the table's underlying state store within a Lit template.
   * Re-renders only the targeted template slice when the observed state changes.
   *
   * @example
   * ```ts
   * // 1. Subscribe to a specific state slice (re-renders ONLY when rowSelection changes)
   * html`
   * <div>
   * ${table.subscribe(
   * table.store,
   * (state) => state.rowSelection,
   * (rowSelection) => html`<span>Selected: ${JSON.stringify(rowSelection)}</span>`
   * )}
   * </div>
   * `
   *
   * // 2. Subscribe to the full state (re-renders on any state mutation)
   * html`
   * <div>
   * ${table.subscribe(
   * table.store,
   * (state) => html`<span>Total rows: ${state.rowModel.rows.length}</span>`
   * )}
   * </div>
   * `
   * ```
   */
  subscribe: typeof subscribe
  /**
   * The selected state of the table. This state may not match the structure of
   * the full table state because it is selected by the selector function that
   * you pass as the 2nd argument to `controller.table()`.
   *
   * @example
   * ```ts
   * const table = this.tableController.table(options, (state) => ({
   *   globalFilter: state.globalFilter,
   * }))
   *
   * console.log(table.state.globalFilter)
   * ```
   */
  readonly state: Readonly<TSelected>
  /**
   * Convenience FlexRender function attached to the table instance.
   * Renders cell, header, or footer content from column definitions.
   *
   * @example
   * ```ts
   * ${table.FlexRender({ header })}
   * ${table.FlexRender({ cell })}
   * ${table.FlexRender({ footer: header })}
   * ```
   */
  FlexRender: typeof FlexRender
}

/**
 * A Lit ReactiveController for TanStack Table integration.
 *
 * Uses `constructReactivityFeature` from table-core to properly integrate
 * with the TanStack Store reactivity system, matching the pattern used by
 * all other framework adapters (React, Vue, Solid, Svelte, Angular).
 *
 * @example
 * ```ts
 * @customElement('my-table')
 * class MyTable extends LitElement {
 *   private tableController = new TableController<typeof features, Person>(this)
 *
 *   protected render() {
 *     const table = this.tableController.table(
 *       {
 *         features,
 *         columns,
 *         data,
 *       },
 *       (state) => ({ sorting: state.sorting }),
 *     )
 *     // use table in your template...
 *   }
 * }
 * ```
 */
export class TableController<
  TFeatures extends TableFeatures,
  TData extends RowData,
> implements ReactiveController {
  host: ReactiveControllerHost

  private _table: Table<TFeatures, TData> | null = null
  private _rootSource?: {
    get: () => TableState<TFeatures>
    markCommitted: (snapshot: TableState<TFeatures>) => void
    subscribe: (listener: (value: TableState<TFeatures>) => void) => {
      unsubscribe: () => void
    }
  }
  private _storeSubscription?: { unsubscribe: () => void }
  private _capturedState?: Partial<TableState<TFeatures>>
  private _capturedSnapshot?: TableState<TFeatures>
  private _hasSelector = false
  private _latestSelector?: (state: TableState<TFeatures>) => unknown
  private _lastSelected: unknown

  constructor(host: ReactiveControllerHost) {
    ;(this.host = host).addController(this)
  }

  /**
   * Returns the Lit-backed table instance for the current render pass.
   *
   * The first call constructs the table with Lit reactivity bindings and
   * subscribes the host to table state/options changes. Later calls merge new
   * options into the same table instance and expose selected state through
   * `table.state`.
   *
   * @example
   * ```ts
   * const table = this.tableController.table(
   *   { features, columns, data },
   *   (state) => ({ sorting: state.sorting }),
   * )
   * ```
   */
  public table<TSelected = TableState<TFeatures>>(
    tableOptions: TableOptions<TFeatures, TData>,
    selector?: (state: TableState<TFeatures>) => TSelected,
  ): LitTable<TFeatures, TData, TSelected> {
    if (!this._table) {
      const mergedOptions: TableOptions<TFeatures, TData> = {
        ...tableOptions,
        features: {
          coreReactivityFeature: litReactivity(),
          ...tableOptions.features,
        },
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

      this._table = constructTable(mergedOptions)

      this._rootSource = createRenderPhaseSource<TableState<TFeatures>>(
        this._table.store,
        shallow,
      )

      // Set up subscriptions immediately when table is created
      this._setupSubscriptions()
    }

    // Stage current options for same-render table reads. Publication happens
    // in hostUpdated() after Lit commits this render.
    table_setOptions(
      this._table,
      (prev) => ({
        ...prev,
        ...tableOptions,
      }),
      { syncExternalState: false },
    )

    this._capturedState = this._table.options.state
    const renderSnapshot = this._rootSource!.get()
    this._capturedSnapshot = renderSnapshot

    // Record the latest selector each render pass and re-baseline what the
    // store-subscription gate compares against, so renders triggered by
    // anything else (e.g. a @state change) reset the gate too. The gate lets
    // a selector like `() => ({})` opt the host out of state-driven updates
    // entirely, pushing granular reactivity into `table.subscribe` islands.
    this._hasSelector = selector !== undefined
    this._latestSelector = selector as
      | ((state: TableState<TFeatures>) => unknown)
      | undefined
    this._lastSelected = selector ? selector(renderSnapshot) : renderSnapshot

    return {
      ...this._table,
      subscribe,
      FlexRender,
      get state() {
        return (selector?.(renderSnapshot) ?? renderSnapshot) as TSelected
      },
    } as unknown as LitTable<TFeatures, TData, TSelected>
  }

  private _setupSubscriptions() {
    if (this._table && !this._storeSubscription) {
      this._storeSubscription = this._rootSource!.subscribe((state) => {
        // With a selector, only update the host when the selected state
        // actually changes (shallow compare). No selector keeps the previous
        // behavior of updating on every state change.
        if (this._hasSelector) {
          const nextSelected = this._latestSelector!(state)
          if (shallow(this._lastSelected as any, nextSelected as any)) {
            return
          }
          this._lastSelected = nextSelected
        }
        this.host.requestUpdate()
      })
    }
  }

  hostConnected() {
    this._setupSubscriptions()
    if (this._table) {
      this.host.requestUpdate()
    }
  }

  hostUpdated() {
    if (!this._table) {
      return
    }
    this._rootSource!.markCommitted(this._capturedSnapshot!)
    table_publishExternalState(
      this._table,
      this._capturedState ?? null,
      shallow,
    )
  }

  hostDisconnected() {
    this._storeSubscription?.unsubscribe()
    this._storeSubscription = undefined
  }
}
