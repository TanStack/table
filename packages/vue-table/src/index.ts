import {
  TableOptions,
  createTable,
  TableOptionsResolved,
  RowData,
} from '@tanstack/table-core'
import { h, watchEffect, ref, defineComponent } from 'vue'
import { mergeProxy } from './merge-proxy'

export * from '@tanstack/table-core'

export const FlexRender = defineComponent({
  props: ['render', 'props'],
  setup: (props: { render: any; props: any }) => {
    return () => {
      if (
        typeof props.render === 'function' ||
        typeof props.render === 'object'
      ) {
        return h(props.render, props.props)
      }

      return props.render
    }
  },
})

export function useVueTable<TData extends RowData>(
  options: TableOptions<TData>
) {
  const resolvedOptions: TableOptionsResolved<TData> = mergeProxy(
    {
      state: {}, // Dummy state
      onStateChange: () => {}, // noop
      renderFallbackValue: null,
      mergeOptions(
        defaultOptions: TableOptions<TData>,
        options: TableOptions<TData>
      ) {
        return mergeProxy(defaultOptions, options)
      },
    },
    options
  )

  const table = createTable<TData>(resolvedOptions)
  // can't use `reactive` because update needs to be immutable
  const state = ref(table.initialState)

  watchEffect(() => {
    table.setOptions(prev => {
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

  return table
}
