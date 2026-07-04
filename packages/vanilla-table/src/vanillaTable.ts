import {
  constructTable,
  Table,
  TableOptions,
  TableState,
  stockFeatures,
  filterFns,
  sortFns,
  aggregationFns
} from '@tanstack/table-core';
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings';

export * from '@tanstack/table-core';

export interface VanillaTable<TData> extends Table<any, TData> {
  subscribe: (listener: (state: TableState<any>) => void) => () => void;
  getState: () => TableState<any>;
}

export function createVanillaTable<TData>(options: TableOptions<any, TData>): VanillaTable<TData> {
  const listeners = new Set<(state: TableState<any>) => void>();

  const defaultInitialState = {
    sorting: [],
    columnFilters: [],
    globalFilter: '',
    rowSelection: {},
    pagination: { pageIndex: 0, pageSize: 10 },
    grouping: [],
    columnVisibility: {},
    expanded: {},
    rowPinning: { top: [], bottom: [] },
    columnPinning: { left: [], right: [] },
    columnOrder: [],
    columnSizing: {},
  };

  const tableOptions = {
    ...options,
    initialState: {
      ...defaultInitialState,
      ...options.initialState,
    },
    features: {
      ...stockFeatures,
      filterFns,
      sortFns,
      aggregationFns,
      coreReactivityFeature: storeReactivityBindings(),
      ...options.features,
    },
    mergeOptions: (defaultOptions: any, newOptions: any) => {
      return {
        ...defaultOptions,
        ...newOptions,
      };
    },
  };

  const table = constructTable(tableOptions as any) as unknown as VanillaTable<TData>;

  table.getState = () => table.store.state;

  table.store.subscribe((state) => {
    listeners.forEach((listener) => listener(state as any));
  });

  table.subscribe = (listener) => {
    listeners.add(listener);
    listener(table.store.state);
    return () => {
      listeners.delete(listener);
    };
  };

  return table;
}
