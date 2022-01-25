import { MouseEvent, TouchEvent } from 'react';
import { RowModel } from '..';
import { Getter, OnChangeFn, PropGetterValue, ReactTable, Row, Updater } from '../types';
export declare type ExpandedStateList = Record<string, boolean>;
export declare type ExpandedState = true | Record<string, boolean>;
export declare type ExpandedTableState = {
    expanded: ExpandedState;
};
export declare type ExpandedRow = {
    toggleExpanded: (expanded?: boolean) => void;
    getIsExpanded: () => boolean;
    getCanExpand: () => boolean;
    getToggleExpandedProps: <TGetter extends Getter<ToggleExpandedProps>>(userProps?: TGetter) => undefined | PropGetterValue<ToggleExpandedProps, TGetter>;
};
export declare type ExpandedOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    onExpandedChange?: OnChangeFn<ExpandedState>;
    autoResetExpanded?: boolean;
    enableExpanded?: boolean;
    expandRowsFn?: (instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, expandedState: ExpandedState, groupedRowModel: RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>) => RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    expandSubRows?: boolean;
    defaultCanExpand?: boolean;
    getIsRowExpanded?: (row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>) => boolean;
    getRowCanExpand?: (row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>) => boolean;
    paginateExpandedRows?: boolean;
};
export declare type ToggleExpandedProps = {
    title?: string;
    onClick?: (event: MouseEvent | TouchEvent) => void;
};
export declare type ExpandedInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    setExpanded: (updater: Updater<ExpandedState>) => void;
    toggleRowExpanded: (rowId: string, expanded?: boolean) => void;
    toggleAllRowsExpanded: (expanded?: boolean) => void;
    resetExpanded: () => void;
    getRowCanExpand: (rowId: string) => boolean;
    getIsRowExpanded: (rowId: string) => boolean;
    getToggleExpandedProps: <TGetter extends Getter<ToggleExpandedProps>>(rowId: string, userProps?: TGetter) => undefined | PropGetterValue<ToggleExpandedProps, TGetter>;
    getToggleAllRowsExpandedProps: <TGetter extends Getter<ToggleExpandedProps>>(userProps?: TGetter) => undefined | PropGetterValue<ToggleExpandedProps, TGetter>;
    getIsAllRowsExpanded: () => boolean;
    getExpandedDepth: () => number;
    getExpandedRowModel: () => RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    getPreExpandedRows: () => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getPreExpandedFlatRows: () => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getPreExpandedRowsById: () => Record<string, Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>>;
    getExpandedRows: () => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getExpandedFlatRows: () => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getExpandedRowsById: () => Record<string, Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>>;
};
export declare function getInitialState(): ExpandedTableState;
export declare function getDefaultOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): ExpandedOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
export declare function getInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): ExpandedInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
export declare function createRow<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): ExpandedRow;
