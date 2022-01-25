import { Cell, Column, Row } from '.';
import { ReactTable, ColumnDef, AccessorFn, Options } from './types';
import { Overwrite } from './utils';
declare type TableHelper<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    RowType: <TTData>() => TableHelper<TTData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    FilterFns: <TTFilterFns>(filterFns: TTFilterFns) => TableHelper<TData, TValue, TTFilterFns, TSortingFns, TAggregationFns>;
    SortingFns: <TTSortingFns>(sortingFns: TTSortingFns) => TableHelper<TData, TValue, TFilterFns, TTSortingFns, TAggregationFns>;
    AggregationFns: <TTAggregationFns>(aggregationFns: TTAggregationFns) => TableHelper<TData, TValue, TFilterFns, TSortingFns, TTAggregationFns>;
    createColumns: (columns: ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[]) => ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    createGroup: (column: Overwrite<ColumnDef<TData, unknown, TFilterFns, TSortingFns, TAggregationFns>, {
        __generated?: never;
        accessorFn?: never;
        accessorKey?: never;
    }>) => ColumnDef<TData, unknown, TFilterFns, TSortingFns, TAggregationFns>;
    createColumn: <TAccessor extends AccessorFn<TData> | keyof TData>(accessor: TAccessor, column: TAccessor extends (...args: any[]) => any ? Overwrite<ColumnDef<TData, ReturnType<TAccessor>, TFilterFns, TSortingFns, TAggregationFns>, {
        __generated?: never;
        accessorFn?: never;
        accessorKey?: never;
        id: string;
    }> : TAccessor extends keyof TData ? Overwrite<ColumnDef<TData, TData[TAccessor], TFilterFns, TSortingFns, TAggregationFns>, {
        __generated?: never;
        accessorFn?: never;
        accessorKey?: never;
    }> : never) => ColumnDef<TData, TAccessor extends (...args: any[]) => any ? ReturnType<TAccessor> : TAccessor extends keyof TData ? TData[TAccessor] : never, TFilterFns, TSortingFns, TAggregationFns>;
    useTable: <TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(options: Options<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>) => ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    types: {
        instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
        columnDef: ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
        column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
        row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
        cell: Cell<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    };
};
export declare function createTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(): TableHelper<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
export {};
