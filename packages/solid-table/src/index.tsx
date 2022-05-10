// /** @jsxImportSource solid-js */
import {
  TableGenerics,
  TableOptions,
  PartialKeys,
  Table,
  createTableInstance as coreCreateTableInstance,
  TableFeature,
  createTableFactory,
} from '@tanstack/table-core'
import {
  createComputed,
  mergeProps,
  createComponent,
  createRenderEffect,
} from 'solid-js'
import { createStore } from 'solid-js/store'

export * from '@tanstack/table-core'

function render<TProps extends {}>(Comp: any, props: TProps) {
  if (!Comp) return null

  if (typeof Comp === 'function') {
    return createComponent(Comp, props)
  }

  return Comp
}

export const createTable = createTableFactory({ render })

export function createTableInstance<TGenerics extends TableGenerics>(
  table: Table<TGenerics>,
  options: PartialKeys<
    Omit<TableOptions<TGenerics>, 'render'>,
    'state' | 'onStateChange'
  >
) {
  const resolvedOptions: TableOptions<TGenerics> = mergeProps(
    {
      ...table.options,
      state: {}, // Dummy state
      onStateChange: () => {}, // noop
      render,
      mergeOptions(
        defaultOptions: TableFeature,
        options: TableOptions<TGenerics>
      ) {
        return mergeProps(defaultOptions, options)
      },
    },
    options
  )

  const instance = coreCreateTableInstance<TGenerics>(resolvedOptions)
  const [state, setState] = createStore(instance.initialState)

  createComputed(() => {
    instance.setOptions(prev => {
      return mergeProps(prev, options, {
        state: mergeProps(state, options.state || {}),
        // Similarly, we'll maintain both our internal state and any user-provided
        // state.
        onStateChange: (updater: any) => {
          // merging isn't required because stores shallow update
          setState(updater)

          options.onStateChange?.(updater)
        },
      })
    })
  })

  return instance
}
