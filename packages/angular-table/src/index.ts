import {
  computed,
  effect,
  inject,
  Injector,
  runInInjectionContext,
  type Signal,
  signal,
  untracked,
} from '@angular/core'
import {
  createTable,
  RowData,
  type Table,
  TableOptions,
  TableOptionsResolved,
} from '@tanstack/table-core'
import { proxifyTable } from './proxy'
import { lazyInit } from './lazy-signal-initializer'

export * from '@tanstack/table-core'

export {
  FlexRenderDirective,
  FlexRenderComponent,
  injectFlexRenderContext,
} from './flex-render'

export function createAngularTable<TData extends RowData>(
  options: () => TableOptions<TData>
): Table<TData> & Signal<Table<TData>> {
  const injector = inject(Injector)

  return lazyInit(() =>
    runInInjectionContext(injector, () => {
      const resolvedOptionsSignal = computed<TableOptionsResolved<TData>>(
        () => {
          return {
            state: {},
            onStateChange: () => {},
            renderFallbackValue: null,
            ...options(),
          }
        }
      )

      const notifier = signal([], { equal: () => false })
      const table = createTable(untracked(resolvedOptionsSignal))
      const state = signal(table.initialState)

      function updateOptions() {
        const tableState = untracked(state)
        const resolvedOptions = untracked(resolvedOptionsSignal)
        untracked(() => {
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
        })
      }

      updateOptions()

      let firstRender = true
      effect(() => {
        void [state(), resolvedOptionsSignal()]
        if (firstRender) {
          return (firstRender = false)
        }
        untracked(() => {
          updateOptions()
          notifier.set([])
        })
      })

      const tableSignal = computed(
        () => {
          notifier()
          return table
        },
        {
          equal: () => false,
        }
      )

      return proxifyTable(tableSignal)
    })
  )
}
