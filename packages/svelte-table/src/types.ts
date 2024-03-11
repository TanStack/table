import type { CellContext, HeaderContext, RowData } from '@tanstack/table-core';

export type HeaderOrCellContext<TData extends RowData, TValue> =
	| HeaderContext<TData, TValue>
	| CellContext<TData, TValue>;
