import { ReactTable, OnChangeFn, Updater, Column } from '../types';
export declare type ColumnOrderState = string[];
export declare type ColumnOrderTableState = {
    columnOrder: string[];
};
export declare type ColumnOrderOptions = {
    onColumnOrderChange?: OnChangeFn<ColumnOrderState>;
};
export declare type ColumnOrderDefaultOptions = {
    onColumnOrderChange: OnChangeFn<ColumnOrderState>;
};
export declare type ColumnOrderInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    setColumnOrder: (updater: Updater<ColumnOrderState>) => void;
    resetColumnOrder: () => void;
    getOrderColumnsFn: () => (columns: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[]) => Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
};
export declare function getInitialState(): ColumnOrderTableState;
export declare function getDefaultOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): ColumnOrderDefaultOptions;
export declare function getInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): ColumnOrderInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
