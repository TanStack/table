import React from 'react';
import { CoreColumn, CoreColumnDef, CoreOptions, CoreRow, TableCore } from './core';
import { VisibilityInstance, VisibilityTableState, VisibilityColumn as ColumnVisibilityColumn, VisibilityOptions, VisibilityColumnDef, VisibilityRow } from './features/Visibility';
import { ColumnOrderInstance, ColumnOrderOptions, ColumnOrderTableState } from './features/Ordering';
import { ColumnPinningColumn, ColumnPinningColumnDef, ColumnPinningInstance, ColumnPinningOptions, ColumnPinningTableState } from './features/Pinning';
import { HeadersInstance, HeadersRow } from './features/Headers';
import { FiltersColumn, FiltersColumnDef, FiltersInstance, FiltersOptions, FiltersTableState } from './features/Filters';
import { SortingColumn, SortingColumnDef, SortingInstance, SortingOptions, SortingTableState } from './features/Sorting';
import { GroupingColumn, GroupingColumnDef, GroupingInstance, GroupingOptions, GroupingRow, GroupingTableState } from './features/Grouping';
import { ExpandedInstance, ExpandedOptions, ExpandedTableState } from './features/Expanding';
import { Overwrite } from './utils';
export declare type ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = TableCore<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & VisibilityInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & ColumnOrderInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & ColumnPinningInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & HeadersInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & FiltersInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & SortingInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & GroupingInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & ExpandedInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
export declare type Renderable<TProps> = React.ReactNode | React.FunctionComponent<TProps> | React.Component<TProps>;
export declare type Options<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = CoreOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & VisibilityOptions & ColumnOrderOptions & ColumnPinningOptions & FiltersOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & SortingOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & GroupingOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & ExpandedOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
export declare type Updater<T> = T | ((old?: T) => T);
export declare type OnChangeFn<T> = (updaterOrValue: Updater<T>, value: T) => void;
export declare type TableState = VisibilityTableState & ColumnOrderTableState & ColumnPinningTableState & FiltersTableState & SortingTableState & ExpandedTableState & GroupingTableState;
export declare type Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = CoreRow<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & VisibilityRow<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & HeadersRow<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & GroupingRow;
export declare type RowValues = {
    [key: string]: any;
};
export declare type RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    flatRows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    rowsById: Record<string, Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>>;
};
export declare type AccessorFn<TData> = (originalRow: TData, index: number) => any;
export declare type ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = CoreColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & VisibilityColumnDef & ColumnPinningColumnDef & FiltersColumnDef<TFilterFns> & SortingColumnDef<TSortingFns> & GroupingColumnDef<TAggregationFns>;
export declare type Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & CoreColumn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & ColumnVisibilityColumn & ColumnPinningColumn & FiltersColumn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & SortingColumn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> & GroupingColumn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
export declare type Cell<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    id: string;
    rowId: string;
    columnId: string;
    value: TValue;
    row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    getCellProps: PropGetter<CellProps>;
    renderCell: () => React.ReactNode;
};
export declare type Header<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    id: string;
    depth: number;
    column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    getWidth: () => number;
    subHeaders: Header<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    colSpan?: number;
    rowSpan?: number;
    getHeaderProps: PropGetter<HeaderProps>;
    getFooterProps: PropGetter<HeaderProps>;
    getLeafHeaders: () => Header<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    isPlaceholder?: boolean;
    placeholderId?: string;
    renderHeader: (options?: {
        renderPlaceholder?: boolean;
    }) => React.ReactNode;
    renderFooter: (options?: {
        renderPlaceholder?: boolean;
    }) => React.ReactNode;
};
export declare type HeaderGroup<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    id: string;
    depth: number;
    headers: Header<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getHeaderGroupProps: PropGetter<HeaderGroupProps>;
    getFooterGroupProps: PropGetter<FooterGroupProps>;
};
export declare type HeaderRenderProps<THeader> = {
    header: THeader;
};
export declare type FooterRenderProps<THeader> = {
    header: THeader;
};
export declare type CellRenderProps<TCell, TRow> = {
    cell: TCell;
    row: TRow;
};
export declare type TableProps = {
    role: string;
};
export declare type TableBodyProps = {
    role: string;
};
export declare type TableHeadProps = {
    key: string;
    role: string;
};
export declare type TableFooterProps = {
    key: string;
    role: string;
};
export declare type HeaderGroupProps = {
    key: string;
    role: string;
};
export declare type FooterGroupProps = {
    key: string;
    role: string;
};
export declare type HeaderProps = {
    key: string;
    role: string;
    colSpan?: number;
    rowSpan?: number;
};
export declare type FooterProps = {
    key: string;
    role: string;
    colSpan?: number;
    rowSpan?: number;
};
export declare type RowProps = {
    key: string;
    role: string;
};
export declare type CellProps = {
    key: string;
    role: string;
};
export declare type PropGetter<TBase> = <TGetter extends Getter<TBase>>(userProps?: TGetter) => PropGetterValue<TBase, TGetter>;
export declare type Getter<TInitial> = ((initial: TInitial) => object) | object | undefined;
export declare type PropGetterValue<TBase, TGetter> = TGetter extends undefined ? TBase : TGetter extends (...args: any[]) => infer TReturn ? Overwrite<TBase, TReturn> : TGetter extends object ? Overwrite<TBase, TGetter> : never;
export declare type NoInfer<A extends any> = [A][A extends any ? 0 : never];
