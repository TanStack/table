import { RequiredKeys } from './utils';
import { Updater, PropGetterValue, Options, TableState, ColumnDef, Row, Column, Cell, Header, AccessorFn, TableProps, TableBodyProps, PropGetter, Getter, RowProps, CellProps, ReactTable, RowValues, Renderable } from './types';
import { RowModel } from '.';
export declare type CoreOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    data: TData[];
    columns: ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    debug?: boolean;
    defaultColumn?: Partial<ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>>;
    initialState?: Partial<TableState>;
    state?: Partial<TableState>;
    getSubRows?: (originalRow: TData, index: number) => TData[];
    getRowId?: (originalRow: TData, index: number, parent?: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>) => string;
    onStateChange?: (newState: TableState) => void;
};
export declare type TableCore<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    rerender: () => void;
    initialState: TableState;
    internalState: TableState;
    reset: () => void;
    options: RequiredKeys<Options<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, 'state'>;
    updateOptions: (newOptions: Options<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>) => void;
    getRowId: (_: TData, index: number, parent?: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>) => string;
    getState: () => TableState;
    setState: (updater: Updater<TableState>) => void;
    getDefaultColumn: () => Partial<ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>>;
    getColumnDefs: () => ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    createColumn: (columnDef: ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, depth: number, parent?: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>) => Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    getAllColumns: () => Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getAllFlatColumns: () => Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getAllFlatColumnsById: () => Record<string, Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>>;
    getAllLeafColumns: () => Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getColumn: (columnId: string) => Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    getColumnWidth: (columnId: string) => number;
    getTotalWidth: () => number;
    createCell: (row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, value: any) => Cell<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    createRow: (id: string, original: TData | undefined, rowIndex: number, depth: number, values: Record<string, any>) => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    getCoreRowModel: () => RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    getCoreRows: () => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getCoreFlatRows: () => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getCoreRowsById: () => Record<string, Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>>;
    getRowModel: () => RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    getRows: () => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getFlatRows: () => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getRowsById: () => Record<string, Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>>;
    getRow: (id: string) => Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    getCell: (rowId: string, columnId: string) => Cell<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    getTableProps: PropGetter<TableProps>;
    getTableBodyProps: PropGetter<TableBodyProps>;
    getRowProps: <TGetter extends Getter<RowProps>>(rowId: string, userProps?: TGetter) => undefined | PropGetterValue<RowProps, TGetter>;
    getCellProps: <TGetter extends Getter<CellProps>>(rowId: string, columnId: string, userProps?: TGetter) => undefined | PropGetterValue<CellProps, TGetter>;
};
export declare type CoreRow<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    id: string;
    index: number;
    original?: TData;
    depth: number;
    values: RowValues;
    leafRows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    subRows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getRowProps: PropGetter<RowProps>;
    originalSubRows?: TData[];
    getAllCells: () => Cell<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getAllCellsByColumnId: () => Record<string, Cell<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>>;
};
export declare type CoreColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = ({
    accessorFn: AccessorFn<TData>;
    id: string;
    accessorKey?: never;
    header?: string | Renderable<{
        header: Header<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
        column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    }>;
} | {
    accessorKey: string & keyof TData;
    id?: string;
    accessorFn?: never;
    header?: string | Renderable<{
        header: Header<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
        column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    }>;
} | {
    id: string;
    accessorKey?: never;
    accessorFn?: never;
    header?: string | Renderable<{
        header: Header<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
        column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    }>;
} | {
    header: string;
    id?: string;
    accessorKey?: never;
    accessorFn?: never;
}) & {
    __generated: true;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    columns?: ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    footer?: Renderable<{
        header: Header<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
        column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    }>;
    cell?: Renderable<{
        column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
        cell: Cell<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
        value: TValue;
    }>;
    defaultIsVisible?: boolean;
};
export declare type CoreColumn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
    id: string;
    depth: number;
    accessorFn?: AccessorFn<TData>;
    columnDef: ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    getWidth: () => number;
    columns: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    parent?: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
    getFlatColumns: () => Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
    getLeafColumns: () => Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
};
export declare function createTableInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(options: Options<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, rerender: () => void): ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>;
