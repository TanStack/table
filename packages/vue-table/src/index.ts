import { constructTable } from '@tanstack/table-core'
import {
  defineComponent,
  h,
  isRef,
  ref,
  shallowRef,
  unref,
  watch,
  watchEffect,
} from 'vue'
import { mergeProxy } from './merge-proxy'
import type { MaybeRef } from 'vue'
import type {
  RowData,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'

export * from '@tanstack/table-core'

export type TableOptionsWithReactiveData<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Omit<TableOptions<TFeatures, TData>, 'data'> & {
  data: MaybeRef<Array<TData>>
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

function getOptionsWithReactiveData<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(options: TableOptionsWithReactiveData<TFeatures, TData>) {
  return mergeProxy(options, {
    data: unref(options.data),
  })
}

export function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  initialOptions: TableOptionsWithReactiveData<
    TFeatures,
    TProcessingFns,
    TData
  >,
) {
  const IS_REACTIVE = isRef(initialOptions.data)

  const resolvedOptions = mergeProxy(
    {
      state: {}, // Dummy state
      onStateChange: () => {}, // noop
      renderFallbackValue: null,
      mergeOptions(
        defaultOptions: TableOptions<TFeatures, TData>,
        options: TableOptions<TFeatures, TData>,
      ) {
        return IS_REACTIVE
          ? {
              ...defaultOptions,
              ...options,
            }
          : mergeProxy(defaultOptions, options)
      },
    },
    IS_REACTIVE ? getOptionsWithReactiveData(initialOptions) : initialOptions,
  )

  const table = constructTable(
    resolvedOptions as TableOptions<TFeatures, TData>,
  )

  // Add reactivity support
  if (IS_REACTIVE) {
    const dataRef = shallowRef(initialOptions.data)
    watch(
      dataRef,
      () => {
        table.setState((prev) => ({
          ...(prev ?? {}),
          data: dataRef.value,
        }))
      },
      { immediate: true },
    )
  }

  // can't use `reactive` because update needs to be immutable
  const state = ref(table.initialState)

  watchEffect(() => {
    table.setOptions((prev) => {
      const stateProxy = new Proxy({} as typeof state.value, {
        get: (_, prop) => state.value[prop as keyof typeof state.value],
      })

      return mergeProxy(
        prev,
        IS_REACTIVE
          ? getOptionsWithReactiveData(initialOptions)
          : initialOptions,
        {
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
        },
      )
    })
  })

  return table
}
