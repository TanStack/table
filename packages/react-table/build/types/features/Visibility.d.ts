import { Cell, Column, Getter, OnChangeFn, PropGetterValue, ReactTable, Updater } from '../types';
export declare type VisibilityOptions = {
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
    enableHiding?: boolean;
};
export declare type VisibilityDefaultOptions = {
    onColumnVisibilityChange: OnChangeFn<VisibilityState>;
};
export declare type VisibilityState = Record<string, boolean>;
export declare type VisibilityTableState = {
    columnVisibility: VisibilityState;
};
export declare type VisibilityInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    getVisibleFlatColumns: () => Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getVisibleLeafColumns: () => Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    setColumnVisibility: (updater: Updater<VisibilityState>) => void;
    toggleColumnVisibility: (columnId: string, value?: boolean) => void;
    toggleAllColumnsVisible: (value?: boolean) => void;
    getColumnIsVisible: (columId: string) => boolean;
    getColumnCanHide: (columnId: string) => boolean;
    getIsAllColumnsVisible: () => boolean;
    getIsSomeColumnsVisible: () => boolean;
    getToggleAllColumnsVisibilityProps: <TGetter extends Getter<ToggleAllColumnsVisibilityProps>>(userProps?: TGetter) => undefined | PropGetterValue<ToggleAllColumnsVisibilityProps, TGetter>;
};
declare type ToggleVisibilityProps = {};
declare type ToggleAllColumnsVisibilityProps = {};
export declare type VisibilityColumnDef = {
    enableHiding?: boolean;
    defaultCanHide?: boolean;
};
export declare type VisibilityRow<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    getVisibleCells: () => Cell<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
};
export declare type VisibilityColumn = {
    getCanHide: () => boolean;
    getIsVisible: () => boolean;
    toggleVisibility: (value?: boolean) => void;
    getToggleVisibilityProps: <TGetter extends Getter<ToggleVisibilityProps>>(userProps?: TGetter) => PropGetterValue<ToggleVisibilityProps, TGetter>;
};
export declare function getInitialState(): VisibilityTableState;
export declare function getDefaultOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): VisibilityDefaultOptions;
export declare function getDefaultColumn(): {
    defaultIsVisible: boolean;
};
export declare function createColumn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): VisibilityColumn;
export declare function getInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): VisibilityInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
export {};
