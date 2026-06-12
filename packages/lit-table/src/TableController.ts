import { constructTable } from '@tanstack/table-core'
import { litReactivity } from './reactivity'
import { FlexRender } from './flexRender'
import type { Atom, ReadonlyAtom, ReadonlyStore, Store } from '@tanstack/store'
import type {
  NoInfer,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type {
  ReactiveController,
  ReactiveControllerHost,
  TemplateResult,
} from 'lit'

export type SubscribeSource<TValue> =
  | Atom<TValue>
  | ReadonlyAtom<TValue>
  | Store<TValue>
  | ReadonlyStore<TValue>

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
   * `table.atoms.<slice>.get()` for slice snapshots, or `table.Subscribe` for
   * explicit subscriptions. `table.store.state` is a current-value snapshot and
   * is easy to misuse in render code.
   */
  readonly store: Table<TFeatures, TData>['store']
  /**
   * Subscribe to a selected slice of table state, or to a single source (atom or store).
   *
   * **Lit note:** `TableController` still wires host updates via the full `table.store`
   * subscription — source mode matches the React API and reads `source.get()` at render
   * time. True source-only invalidation can be added later via `source.subscribe`.
   *
   * @example
   * ```ts
   * table.Subscribe({
   *   selector: (state) => ({ rowSelection: state.rowSelection }),
   *   children: (state) => html`<div>${JSON.stringify(state)}</div>`,
   * })
   * ```
   */
  Subscribe: {
    <TSourceValue>(props: {
      source: SubscribeSource<TSourceValue>
      selector?: undefined
      children:
        | ((state: Readonly<TSourceValue>) => TemplateResult | string)
        | TemplateResult
        | string
    }): TemplateResult | string
    <TSourceValue, TSubscribeSelected>(props: {
      source: SubscribeSource<TSourceValue>
      selector: (state: TSourceValue) => TSubscribeSelected
      children:
        | ((state: Readonly<TSubscribeSelected>) => TemplateResult | string)
        | TemplateResult
        | string
    }): TemplateResult | string
    <TSubscribeSelected>(props: {
      selector: (state: NoInfer<TableState<TFeatures>>) => TSubscribeSelected
      children:
        | ((state: Readonly<TSubscribeSelected>) => TemplateResult | string)
        | TemplateResult
        | string
    }): TemplateResult | string
  }
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
  private _storeSubscription?: { unsubscribe: () => void }
  private _optionsSubscription?: { unsubscribe: () => void }
  private _notifier = 0

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

      // Set up subscriptions immediately when table is created
      this._setupSubscriptions()
    }

    // Update options when they change
    this._table.setOptions((prev) => ({
      ...prev,
      ...tableOptions,
    }))

    // Capture for closure
    const tableInstance = this._table

    // Attach Subscribe function
    const Subscribe = function Subscribe(props: {
      source?: SubscribeSource<unknown>
      selector?: (state: unknown) => unknown
      children:
        | ((state: Readonly<unknown>) => TemplateResult | string)
        | TemplateResult
        | string
    }): TemplateResult | string {
      const source = props.source ?? tableInstance.store
      const value = source.get()
      const selectedState =
        props.selector !== undefined ? props.selector(value) : value
      if (typeof props.children === 'function') {
        return props.children(selectedState as Readonly<unknown>)
      }
      return props.children
    } as LitTable<TFeatures, TData, TSelected>['Subscribe']

    return {
      ...this._table,
      Subscribe,
      FlexRender,
      get state() {
        return (selector?.(tableInstance.store.state) ??
          tableInstance.store.state) as TSelected
      },
    } as unknown as LitTable<TFeatures, TData, TSelected>
  }

  private _setupSubscriptions() {
    if (this._table && !this._storeSubscription) {
      this._storeSubscription = this._table.store.subscribe(() => {
        this._notifier++
        this.host.requestUpdate()
      })

      this._optionsSubscription = this._table.optionsStore!.subscribe(() => {
        this._notifier++
        this.host.requestUpdate()
      })
    }
  }

  hostConnected() {
    this._setupSubscriptions()
  }

  hostDisconnected() {
    this._storeSubscription?.unsubscribe()
    this._storeSubscription = undefined
    this._optionsSubscription?.unsubscribe()
    this._optionsSubscription = undefined
  }
}
