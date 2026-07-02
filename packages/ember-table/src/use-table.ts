
import { constructTable } from '@tanstack/table-core'
import { emberReactivity } from './reactivity.ts'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
} from '@tanstack/table-core';

export function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  getOptions: () => TableOptions<TFeatures, TData>,
): Table<TFeatures, TData> {
    const reactivity = emberReactivity()

    const options = getOptions()

    const table = constructTable<TFeatures, TData>({
      ...options,
      features: {
        coreReactivityFeature: reactivity,
        ...options.features,
      },
      mergeOptions: (
        defaultOptions: TableOptions<TFeatures, TData>,
        newOptions: Partial<TableOptions<TFeatures, TData>>,
      ) => ({
        ...defaultOptions,
        ...newOptions,
      }),
    });

    return table
}
