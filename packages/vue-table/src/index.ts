import {
  AnyGenerics,
  CreateTableFactoryOptions,
  Options,
  PartialKeys,
  Table,
  createTableInstance,
  init,
  TableFeature,
} from '@tanstack/table-core'
import { h, watchEffect, ref } from 'vue'
import { mergeProxy } from './merge-proxy'

export * from '@tanstack/table-core'

function render<TProps extends {}>(Comp: any, props: TProps) {
  if (!Comp) return null

  if (typeof Comp === 'function') {
    return h(Comp, props)
  }

  return Comp
}

const { createTable, createTableFactory } = init({ render })

export { createTable, createTableFactory }

export function useTableInstance<TGenerics extends AnyGenerics>(
  table: Table<TGenerics>,
  options: PartialKeys<
    Omit<
      Options<TGenerics>,
      keyof CreateTableFactoryOptions<any, any, any, any>
    >,
    'state' | 'onStateChange'
  >
) {
  const resolvedOptions: Options<TGenerics> = mergeProxy(
    {
      ...(table.__options ?? {}),
      state: {}, // Dummy state
      onStateChange: () => {}, // noop
      render,
      mergeOptions(defaultOptions: TableFeature, options: Options<TGenerics>) {
        return mergeProxy(defaultOptions, options)
      },
    },
    options
  )

  const instance = createTableInstance<TGenerics>(resolvedOptions)
  // can't use `reactive` because update needs to be immutable
  const state = ref(instance.initialState)

  watchEffect(() => {
    instance.setOptions(prev => {
      const stateProxy = new Proxy({} as typeof state.value, {
        get: (_, prop) => state.value[prop as keyof typeof state.value],
      })

      return mergeProxy(prev, options, {
        // merge the initialState and `options.state`
        // create a new proxy on each `setOptions` call
        // and get the value from state on each property access
        state: mergeProxy(stateProxy, options.state ?? {}),
        // Similarly, we'll maintain both our internal state and any user-provided
        // state.
        onStateChange: (updater: any) => {
          if (updater instanceof Function) {
            state.value = updater(state.value)
          } else {
            state.value = updater
          }

          options.onStateChange?.(updater)
        },
      })
    })
  })

  return instance
}
