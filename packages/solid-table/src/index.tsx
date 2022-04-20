// /** @jsxImportSource solid-js */
import {
  AnyGenerics,
  CreateTableFactoryOptions,
  Options,
  PartialKeys,
  Table,
  createTableInstance as coreCreateTableInstance,
  init,
  TableFeature,
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

const { createTable, createTableFactory } = init({ render })

export { createTable, createTableFactory }

export function createTableInstance<TGenerics extends AnyGenerics>(
  table: Table<TGenerics>,
  options: PartialKeys<
    Omit<
      Options<TGenerics>,
      keyof CreateTableFactoryOptions<any, any, any, any>
    >,
    'state' | 'onStateChange'
  >
) {
  const resolvedOptions: Options<TGenerics> = mergeProps(
    {
      ...(table.__options ?? {}),
      state: {}, // Dummy state
      onStateChange: () => {}, // noop
      render,
      mergeOptions(defaultOptions: TableFeature, options: Options<TGenerics>) {
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

  createRenderEffect(() => {
    instance.willUpdate()
  })

  return instance
}
