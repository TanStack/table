import { TableOptions, createTable, RowData } from '@tanstack/table-core'
import {
  h,
  watchEffect,
  ref,
  defineComponent,
  isRef,
  unref,
  MaybeRef,
  watch,
} from 'vue'
import { mergeProxy } from './merge-proxy'

export * from '@tanstack/table-core'

type TableOptionsWithReactiveData<TData extends RowData> = Omit<
  TableOptions<TData>,
  'data'
> & {
  data: MaybeRef<TData[]>
}

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

function getOptionsWithReactiveData<TData extends RowData>(
  options: TableOptionsWithReactiveData<TData>
) {
  return mergeProxy(options, {
    data: unref(options.data),
  })
}

export function useVueTable<TData extends RowData>(
  initialOptions: TableOptionsWithReactiveData<TData>
) {
  const resolvedOptions = mergeProxy(
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
    getOptionsWithReactiveData(initialOptions)
  )

  const table = createTable<TData>(resolvedOptions)

  // Add reactivity support
  if (isRef(initialOptions.data)) {
    watch(
      initialOptions.data,
      () => {
        table.setState(prev => ({
          ...prev,
          data: unref(initialOptions.data),
        }))
      },
      { immediate: true, deep: true }
    )
  }

  // can't use `reactive` because update needs to be immutable
  const state = ref(table.initialState)

  watchEffect(() => {
    table.setOptions(prev => {
      const stateProxy = new Proxy({} as typeof state.value, {
        get: (_, prop) => state.value[prop as keyof typeof state.value],
      })

      return mergeProxy(prev, getOptionsWithReactiveData(initialOptions), {
        // merge the initialState and `options.state`
        // create a new proxy on each `setOptions` call
        // and get the value from state on each property access
        state: mergeProxy(stateProxy, initialOptions.state ?? {}),
        // Similarly, we'll maintain both our internal state and any user-provided
        // state.
        onStateChange: (updater: any) => {
          if (updater instanceof Function) {
            state.value = updater(state.value)
          } else {
            state.value = updater
          }

          initialOptions.onStateChange?.(updater)
        },
      })
    })
  })

  return table
}
