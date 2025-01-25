import { isRef, ref, shallowRef, unref, watch, watchEffect } from 'vue'
import {
  constructTable,
  coreFeatures,
  getInitialTableState,
  isFunction,
} from '@tanstack/table-core'
import { mergeProxy } from './merge-proxy'
import type { RowData, TableFeatures, TableOptions } from '@tanstack/table-core'
import type { MaybeRef } from 'vue'

export type TableOptionsWithReactiveData<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Omit<TableOptions<TFeatures, TData>, 'data'> & {
  data: MaybeRef<Array<TData>>
}

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
>(tableOptions: TableOptionsWithReactiveData<TFeatures, TData>) {
  const _features = { ...coreFeatures, ...tableOptions._features }

  const IS_REACTIVE = isRef(tableOptions.data)

  // can't use `reactive` because update needs to be immutable
  const state = ref(getInitialTableState(_features, tableOptions.initialState))

  const statefulOptions = mergeProxy(
    IS_REACTIVE ? getOptionsWithReactiveData(tableOptions) : tableOptions,
    {
      _features,
      state,
      mergeOptions(
        defaultOptions: TableOptions<TFeatures, TData>,
        newOptions: TableOptions<TFeatures, TData>,
      ) {
        return IS_REACTIVE
          ? {
              ...defaultOptions,
              ...newOptions,
            }
          : mergeProxy(defaultOptions, newOptions)
      },
    },
  )

  const table = constructTable(
    statefulOptions as TableOptions<TFeatures, TData>,
  )

  // Add reactivity support
  if (IS_REACTIVE) {
    const dataRef = shallowRef(tableOptions.data)
    watch(
      dataRef,
      () => {
        table.setState((prev) => ({
          ...prev,
          data: dataRef.value,
        }))
      },
      { immediate: true },
    )
  }

  watchEffect(() => {
    table.setOptions((prev: any) => {
      const stateProxy = new Proxy({} as typeof state.value, {
        get: (_, prop) => state.value[prop as keyof typeof state.value],
      })

      return mergeProxy(
        prev,
        IS_REACTIVE ? getOptionsWithReactiveData(tableOptions) : tableOptions,
        {
          // merge the initialState and `options.state`
          // create a new proxy on each `setOptions` call
          // and get the value from state on each property access
          state: mergeProxy(stateProxy, tableOptions.state ?? {}),
          // Similarly, we'll maintain both our internal state and any user-provided
          // state.
          onStateChange: (updater: any) => {
            if (isFunction(updater)) {
              state.value = updater(state.value)
            } else {
              state.value = updater
            }

            tableOptions.onStateChange?.(updater)
          },
        },
      )
    })
  })

  return table
}
