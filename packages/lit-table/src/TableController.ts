import {
  constructReactivityFeature,
  constructTable,
} from '@tanstack/table-core'
import { FlexRender } from './flexRender'
import type { Atom, ReadonlyAtom } from '@tanstack/store'
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

/**
 * The extended table type returned by the Lit adapter.
 * Includes a `Subscribe` method for fine-grained state subscriptions
 * and a `state` property with the selected state.
 */
export type LitTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
> = Table<TFeatures, TData> & {
  /**
   * Subscribe to a selected slice of table state, or to a single atom.
   *
   * **Lit note:** `TableController` still wires host updates via the full `table.store`
   * subscription — atom mode matches the React API and reads `atom.get()` at render time.
   * True atom-only invalidation can be added later via `atom.subscribe`.
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
    <TSubscribeSelected, TAtomValue>(props: {
      atom: Atom<TAtomValue> | ReadonlyAtom<TAtomValue>
      selector?: (state: TAtomValue) => TSubscribeSelected
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
   * `table.store.state` because it is selected by the `selector` function that
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
 *   private tableController = new TableController<typeof _features, Person>(this)
 *
 *   protected render() {
 *     const table = this.tableController.table(
 *       {
 *         _features,
 *         _rowModels: {},
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

  public table<TSelected = {}>(
    tableOptions: TableOptions<TFeatures, TData>,
    selector: (state: TableState<TFeatures>) => TSelected = () =>
      ({}) as TSelected,
  ): LitTable<TFeatures, TData, TSelected> {
    if (!this._table) {
      const litReactivityFeature = constructReactivityFeature<TFeatures, TData>(
        {
          stateNotifier: () => this._notifier,
          optionsNotifier: () => this._notifier,
        },
      )

      const mergedOptions: TableOptions<TFeatures, TData> = {
        ...tableOptions,
        _features: {
          ...tableOptions._features,
          litReactivityFeature,
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
      atom?: Atom<unknown> | ReadonlyAtom<unknown>
      selector?: (state: unknown) => unknown
      children:
        | ((state: Readonly<unknown>) => TemplateResult | string)
        | TemplateResult
        | string
    }): TemplateResult | string {
      let selectedState: unknown
      if (props.atom !== undefined) {
        const v = props.atom.get()
        selectedState = props.selector !== undefined ? props.selector(v) : v
      } else {
        selectedState = props.selector!(tableInstance.store.state)
      }
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
        return selector(tableInstance.store.state)
      },
    } as LitTable<TFeatures, TData, TSelected>
  }

  private _setupSubscriptions() {
    if (this._table && !this._storeSubscription) {
      this._storeSubscription = this._table.store.subscribe(() => {
        this._notifier++
        this.host.requestUpdate()
      })

      this._optionsSubscription = this._table.optionsStore.subscribe(() => {
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
