import React, { MouseEvent, TouchEvent } from 'react';
import { RowModel } from '..';
import { BuiltInAggregationType } from '../aggregationTypes';
import { Cell, Column, Getter, OnChangeFn, PropGetterValue, ReactTable, Row, Updater } from '../types';
export declare type GroupingState = string[];
export declare type AggregationFn = (leafValues: any[], childValues: any[]) => any;
export declare type AggregationType<TAggregationFns> = 'auto' | BuiltInAggregationType | keyof TAggregationFns | AggregationFn;
export declare type GroupingTableState = {
    grouping: GroupingState;
};
export declare type GroupingColumnDef<TAggregationFns> = {
    aggregationType?: AggregationType<TAggregationFns>;
    aggregateValue?: (columnValue: unknown) => any;
    renderAggregatedCell?: () => React.ReactNode;
    enableGrouping?: boolean;
    defaultCanGroup?: boolean;
    getCanGroup?: unknown;
};
export declare type GroupingColumn<_TData, _TValue, _TFilterFns, _TSortingFns, TAggregationFns> = {
    aggregationType?: AggregationType<TAggregationFns>;
    getCanGroup: () => boolean;
    getIsGrouped: () => boolean;
    getGroupedIndex: () => number;
    toggleGrouping: () => void;
    getToggleGroupingProps: <TGetter extends Getter<ToggleGroupingProps>>(userProps?: TGetter) => undefined | PropGetterValue<ToggleGroupingProps, TGetter>;
};
export declare type GroupingRow = {
    groupingColumnId?: string;
    groupingValue?: any;
    getIsGrouped: () => boolean;
};
export declare type GroupingCell = {
    getIsGrouped: () => boolean;
    getIsPlaceholder: () => boolean;
    getIsAggregated: () => boolean;
};
export declare type ColumnDefaultOptions = {
    onGroupingChange: OnChangeFn<GroupingState>;
    autoResetGrouping: boolean;
    enableGrouping: boolean;
};
export declare type GroupingOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    aggregationTypes?: TAggregationFns;
    onGroupingChange?: OnChangeFn<GroupingState>;
    autoResetGrouping?: boolean;
    enableGrouping?: boolean;
    enableGroupingRemoval?: boolean;
    groupRowsFn?: (instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, groupingState: GroupingState, sortedRowsModel: RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>) => RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    groupedColumnMode?: false | 'reorder' | 'remove';
};
export declare type GroupingColumnMode = false | 'reorder' | 'remove';
export declare type ToggleGroupingProps = {
    title?: string;
    onClick?: (event: MouseEvent | TouchEvent) => void;
};
export declare type GroupingInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    getColumnAutoAggregationFn: (columnId: string) => AggregationFn | undefined;
    getColumnAggregationFn: (columnId: string) => AggregationFn | undefined;
    setGrouping: (updater: Updater<GroupingState>) => void;
    resetGrouping: () => void;
    toggleColumnGrouping: (columnId: string) => void;
    getColumnCanGroup: (columnId: string) => boolean;
    getColumnIsGrouped: (columnId: string) => boolean;
    getColumnGroupedIndex: (columnId: string) => number;
    getToggleGroupingProps: <TGetter extends Getter<ToggleGroupingProps>>(columnId: string, userProps?: TGetter) => undefined | PropGetterValue<ToggleGroupingProps, TGetter>;
    getRowIsGrouped: (rowId: string) => boolean;
    getGroupedRowModel: () => RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    getPreGroupedRows: () => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getPreGroupedFlatRows: () => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getPreGroupedRowsById: () => Record<string, Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>>;
    getGroupedRows: () => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getGroupedFlatRows: () => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getGroupedRowsById: () => Record<string, Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>>;
};
export declare function getDefaultColumn<TFilterFns>(): GroupingColumnDef<TFilterFns>;
export declare function getInitialState(): GroupingTableState;
export declare function getDefaultOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): GroupingOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
export declare function createColumn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): GroupingColumn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
export declare function getInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): GroupingInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
export declare function createRow<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): GroupingRow;
export declare function createCell<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(cell: Cell<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & GroupingCell, column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, _instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>): GroupingCell;
export declare function orderColumns<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(leafColumns: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[], grouping: string[], groupedColumnMode?: GroupingColumnMode): Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
