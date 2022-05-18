import {
  TableGenerics,
  TableOptions,
  PartialKeys,
  Table,
  createTableInstance,
  TableFeature,
  createTableFactory,
} from '@tanstack/table-core'
import { h, watchEffect, ref, VNode } from 'vue'
import { mergeProxy } from './merge-proxy'

export * from '@tanstack/table-core'

function render<TProps extends {}>(Comp: any, props: TProps): VNode | string | number | boolean | null {
  if (!Comp) return null

  if (typeof Comp === 'function') {
    return h(Comp, props)
  }

  return Comp
}

export const createTable = createTableFactory({ render })

export function useTableInstance<TGenerics extends TableGenerics>(
  table: Table<TGenerics>,
  options: PartialKeys<
    Omit<TableOptions<TGenerics>, 'render'>,
    'state' | 'onStateChange'
  >
) {
  const resolvedOptions: TableOptions<TGenerics> = mergeProxy(
    {
      ...table.options,
      state: {}, // Dummy state
      onStateChange: () => {}, // noop
      render,
      mergeOptions(
        defaultOptions: TableFeature,
        options: TableOptions<TGenerics>
      ) {
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

  // onBeforeUpdate(() => {
  //   instance.willUpdate()
  // })

  return instance
}
