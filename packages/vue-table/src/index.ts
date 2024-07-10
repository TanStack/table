import { _createTable } from '@tanstack/table-core'
import { defineComponent, h, ref, watchEffect } from 'vue'
import { mergeProxy } from './merge-proxy'
import type { RowData, TableFeatures, TableOptions } from '@tanstack/table-core'

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

export function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(options: TableOptions<TFeatures, TData>) {
  const resolvedOptions: TableOptions<TFeatures, TData> = mergeProxy(
    {
      state: {}, // Dummy state
      onStateChange: () => {}, // noop
      renderFallbackValue: null,
      mergeOptions(
        defaultOptions: TableOptions<TFeatures, TData>,
        newOptions: TableOptions<TFeatures, TData>,
      ) {
        return mergeProxy(defaultOptions, newOptions)
      },
    },
    options,
  )

  const table = _createTable<TFeatures, TData>(resolvedOptions)
  // can't use `reactive` because update needs to be immutable
  const state = ref(table.initialState)

  watchEffect(() => {
    table.setOptions((prev) => {
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
