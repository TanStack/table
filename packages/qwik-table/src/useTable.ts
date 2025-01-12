import { noSerialize, useSignal, useStore } from '@builder.io/qwik'
import {
  constructTable,
  coreFeatures,
  getInitialTableState,
  isFunction,
} from '@tanstack/table-core'
import type { NoSerialize } from '@builder.io/qwik'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
} from '@tanstack/table-core'

export function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  tableOptions: TableOptions<TFeatures & { Data: TData }, TData>,
): Table<TFeatures & { Data: TData }, TData> {
  const _features = { ...coreFeatures, ...tableOptions._features }

  const state = useSignal(
    getInitialTableState(_features, tableOptions.initialState),
  )

  const statefulOptions: TableOptions<TFeatures & { Data: TData }, TData> = {
    ...tableOptions,
    _features,
    state: {
      ...state.value,
      ...tableOptions.state,
    },
    onStateChange: (updater) => {
      state.value = isFunction(updater) ? updater(state.value) : updater
      tableOptions.onStateChange?.(updater)
    },
  }

  const table = useStore<{
    instance: NoSerialize<Table<TFeatures & { Data: TData }, TData>>
  }>({
    instance: noSerialize(constructTable(statefulOptions)),
  })

  return table.instance!
}
