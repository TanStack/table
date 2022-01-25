import { MouseEvent, TouchEvent } from 'react';
import { RowModel } from '..';
import { BuiltInSortType } from '../sortTypes';
import { Column, Getter, OnChangeFn, PropGetterValue, ReactTable, Row, Updater } from '../types';
export declare type ColumnSort = {
    id: string;
    desc: boolean;
};
export declare type SortingState = ColumnSort[];
export declare type SortingFn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    (rowA: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, rowB: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, columnId: string): number;
};
export declare type SortingTableState = {
    sorting: SortingState;
};
export declare type SortType<TSortingFns> = 'auto' | BuiltInSortType | keyof TSortingFns | SortingFn<any, any, any, TSortingFns, any>;
export declare type SortingColumnDef<TFilterFns> = {
    sortType?: SortType<TFilterFns>;
    sortDescFirst?: boolean;
    enableSorting?: boolean;
    enableMultiSort?: boolean;
    defaultCanSort?: boolean;
    invertSorting?: boolean;
    sortUndefined?: false | -1 | 1;
};
export declare type SortingColumn<_TData, _TValue, TFilterFns, _TSortingFns, _TAggregationFns> = {
    sortType: SortType<TFilterFns>;
    getCanSort: () => boolean;
    getCanMultiSort: () => boolean;
    getSortIndex: () => number;
    getIsSorted: () => false | 'asc' | 'desc';
    toggleSorting: (desc?: boolean, isMulti?: boolean) => void;
    getToggleSortingProps: <TGetter extends Getter<ToggleSortingProps>>(userProps?: TGetter) => undefined | PropGetterValue<ToggleSortingProps, TGetter>;
};
export declare type SortingOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    sortTypes?: TSortingFns;
    onSortingChange?: OnChangeFn<SortingState>;
    autoResetSorting?: boolean;
    enableSorting?: boolean;
    enableSortingRemoval?: boolean;
    enableMultiRemove?: boolean;
    enableMultiSort?: boolean;
    sortDescFirst?: boolean;
    sortRowsFn?: (instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, sortingState: SortingState, globalFilteredRowModel: RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>) => RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    maxMultiSortColCount?: number;
    isMultiSortEvent?: (e: MouseEvent | TouchEvent) => boolean;
};
export declare type ToggleSortingProps = {
    title?: string;
    onClick?: (event: MouseEvent | TouchEvent) => void;
};
export declare type SortingInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    getColumnAutoSortingFn: (columnId: string) => SortingFn<any, any, any, any, any> | undefined;
    getColumnSortingFn: (columnId: string) => SortingFn<any, any, any, any, any> | undefined;
    setSorting: (updater: Updater<SortingState>) => void;
    toggleColumnSorting: (columnId: string, desc?: boolean, multi?: boolean) => void;
    resetSorting: () => void;
    getColumnCanSort: (columnId: string) => boolean;
    getColumnCanMultiSort: (columnId: string) => boolean;
    getColumnIsSorted: (columnId: string) => false | 'asc' | 'desc';
    getColumnSortIndex: (columnId: string) => number;
    getToggleSortingProps: <TGetter extends Getter<ToggleSortingProps>>(columnId: string, userProps?: TGetter) => undefined | PropGetterValue<ToggleSortingProps, TGetter>;
    getSortedRowModel: () => RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    getPreSortedRows: () => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getPreSortedFlatRows: () => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getPreSortedRowsById: () => Record<string, Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>>;
    getSortedRows: () => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getSortedFlatRows: () => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getSortedRowsById: () => Record<string, Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>>;
};
export declare function getDefaultColumn<TFilterFns>(): SortingColumnDef<TFilterFns>;
export declare function getInitialState(): SortingTableState;
export declare function getDefaultOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): SortingOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
export declare function createColumn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): SortingColumn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
export declare function getInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): SortingInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
