import { computed, effect, inject, Injector, signal } from '@angular/core'
import {
  createTable,
  RowData,
  TableOptions,
  TableOptionsResolved,
  TableState,
  type Table,
} from '@tanstack/table-core'
import { lazyInit } from './lazy-signal-initializer'
import { proxifyTable } from './proxy'

export * from '@tanstack/table-core'

export {
  FlexRenderComponent,
  FlexRenderDirective,
  injectFlexRenderContext,
} from './flex-render'

export function createAngularTable<TData extends RowData>(
  options: () => TableOptions<TData>,
  injector?: Injector
): Table<TData> {
  if (!injector) injector = inject(Injector)

  return lazyInit(() => {
    // Compose table resolved options as computed.
    // This will allow the effect to be triggered when options are updated.
    const resolvedOptionsSignal = computed<TableOptionsResolved<TData>>(() => ({
      state: {},
      onStateChange: () => {},
      renderFallbackValue: null,
      ...options(),
    }))

    const table = createTable(resolvedOptionsSignal())

    // By default, manage table state here using the table's initial state
    const state = signal<TableState>(table.initialState)

    function updateOptions() {
      const tableState = state()
      const resolvedOptions = resolvedOptionsSignal()
      table.setOptions(prev => ({
        ...prev,
        ...resolvedOptions,
        state: { ...tableState, ...resolvedOptions.state },
        onStateChange: updater => {
          const value =
            updater instanceof Function ? updater(tableState) : updater
          state.set(value)
          resolvedOptions.onStateChange?.(updater)
        },
      }))
    }

    // notifier for tableSignal whenever `updateOptions` is invoked
    // this to make sure that table options is set first before table
    // instance change is propagated to consumer
    const tableChangeNotifier = signal([], { equal: () => false })
    // set table options again when options are updated
    effect(
      () => {
        updateOptions()
        tableChangeNotifier.set([])
      },
      { injector }
    )

    // set table options for the first time
    updateOptions()

    // convert table instance to signal for proxify to listen to any table state and options changes
    const tableSignal = computed(
      () => {
        tableChangeNotifier()
        return table
      },
      {
        equal: () => false,
      }
    )

    // proxify Table instance to provide ability for consumer to listen to any table state changes
    return proxifyTable(tableSignal)
  })
}
