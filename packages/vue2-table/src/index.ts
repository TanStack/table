import Vue, { CreateElement } from 'vue'
import VueCompositionAPI, { ref, watchEffect } from '@vue/composition-api'

Vue.use(VueCompositionAPI)

import {
  TableOptions,
  createTable,
  TableOptionsResolved,
  RowData,
} from '@tanstack/table-core'
import { mergeProxy } from './merge-proxy'

export * from '@tanstack/table-core'

export const FlexRender = Vue.component('FlexRender', {
  props: ['render', 'props'],
  render: function (createElement: CreateElement) {
    if (typeof this.render === 'function' || typeof this.render === 'object') {
      return createElement('div', undefined, this.render(this.props))
    }

    return createElement('span', this.render)
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
