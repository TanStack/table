import { OnChangeFn, Updater, ReactTable, Column } from '../types';
declare type ColumnPinningPosition = 'left' | 'right' | 'both';
export declare type ColumnPinningState = {
    left?: string[];
    right?: string[];
};
export declare type ColumnPinningTableState = {
    columnPinning: ColumnPinningState;
};
export declare type ColumnPinningOptions = {
    onColumnPinningChange?: OnChangeFn<ColumnPinningState>;
    enablePinning?: boolean;
};
export declare type ColumnPinningDefaultOptions = {
    onColumnPinningChange: OnChangeFn<ColumnPinningState>;
};
export declare type ColumnPinningColumnDef = {
    enablePinning?: boolean;
    defaultCanPin?: boolean;
};
export declare type ColumnPinningColumn = {
    getCanPin: () => boolean;
    getPinnedIndex: () => number;
    getIsPinned: () => false | ColumnPinningPosition;
    pin: (position: ColumnPinningPosition) => void;
};
export declare type ColumnPinningInstance<_TData, _TValue, _TFilterFns, _TSortingFns, _TAggregationFns> = {
    setColumnPinning: (updater: Updater<ColumnPinningState>) => void;
    resetColumnPinning: () => void;
    pinColumn: (columnId: string, position: ColumnPinningPosition) => void;
    getColumnCanPin: (columnId: string) => boolean;
    getColumnIsPinned: (columnId: string) => false | ColumnPinningPosition;
    getColumnPinnedIndex: (columnId: string) => number;
};
export declare function getInitialState(): ColumnPinningTableState;
export declare function getDefaultOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): ColumnPinningDefaultOptions;
export declare function createColumn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): ColumnPinningColumn;
export declare function getInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): ColumnPinningInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
export {};
