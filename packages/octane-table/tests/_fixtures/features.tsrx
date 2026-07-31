import {
	aggregationFns,
	columnFacetingFeature,
	columnFilteringFeature,
	columnGroupingFeature,
	columnVisibilityFeature,
	createExpandedRowModel,
	createFacetedRowModel,
	createFacetedUniqueValues,
	createFilteredRowModel,
	createGroupedRowModel,
	createPaginatedRowModel,
	filterFns,
	flexRender,
	globalFilteringFeature,
	rowAggregationFeature,
	rowExpandingFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	tableFeatures,
	useTable,
} from '@tanstack/octane-table';

// Feature-smoke fixtures — each table-core feature wired through the octane
// render path. Data is module-level and deterministic.
//
// v9 opts into features explicitly per table (they are tree-shakeable), so each
// fixture below declares only the features it exercises.

export const captured: { table?: any } = {};

const people = [
	{ firstName: 'tanner', lastName: 'linsley', age: 29, status: 'single' },
	{ firstName: 'derek', lastName: 'perkins', age: 45, status: 'complicated' },
	{ firstName: 'joe', lastName: 'bergevin', age: 42, status: 'single' },
	{ firstName: 'kevin', lastName: 'vandy', age: 27, status: 'single' },
	{ firstName: 'ryan', lastName: 'carniato', age: 38, status: 'complicated' },
];

const nameCols = [
	{ accessorKey: 'firstName', header: 'First' },
	{ accessorKey: 'age', header: 'Age' },
	{ accessorKey: 'status', header: 'Status' },
];

// ── Column + global filtering (+ faceting, which needs the filtered model). ──
const filterFeatures = tableFeatures({
	columnFilteringFeature,
	globalFilteringFeature,
	columnFacetingFeature,
	filteredRowModel: createFilteredRowModel(),
	facetedRowModel: createFacetedRowModel(),
	facetedUniqueValues: createFacetedUniqueValues(),
	filterFns,
});

export function FilterTable(props: { global?: boolean }) @{
	const table = useTable({
		features: filterFeatures,
		data: people,
		columns: nameCols,
	});
	captured.table = table;
	<div>
		@if (props.global) {
			<input
				id="gflt"
				value={table.state.globalFilter as string ?? ''}
				onInput={(e) => table.setGlobalFilter((e.target as HTMLInputElement).value)}
			/>
		} @else {
			<input
				id="flt"
				value={table.getColumn('firstName')!.getFilterValue() as string ?? ''}
				onInput={(e) => table.getColumn('firstName')!.setFilterValue(
					(e.target as HTMLInputElement).value,
				)}
			/>
		}
		<ul>
			@for (const row of table.getRowModel().rows; key row.id) {
				<li class="f-row">{row.original.firstName as string}</li>
			}
		</ul>
	</div>
}

// ── Pagination: 25 rows, pageSize 10, button-driven. ──
const manyRows = Array.from(
	{ length: 25 },
	(_, i) => ({
		firstName: 'p' + String(i).padStart(2, '0'),
		age: i,
	}),
);

const paginationFeatures = tableFeatures({
	rowPaginationFeature,
	paginatedRowModel: createPaginatedRowModel(),
});

export function PaginationTable() @{
	const table = useTable({
		features: paginationFeatures,
		data: manyRows,
		columns: [
			{ accessorKey: 'firstName', header: 'First' },
		],
	});
	captured.table = table;
	<div>
		<span id="pi">{table.state.pagination.pageIndex + '/' + table.getPageCount()}</span>
		<button id="prev" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
			prev
		</button>
		<button id="next" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
			next
		</button>
		<button id="ps-5" onClick={() => table.setPageSize(5)}>5</button>
		<ul>
			@for (const row of table.getRowModel().rows; key row.id) {
				<li class="p-row">{row.original.firstName as string}</li>
			}
		</ul>
	</div>
}

// ── Row selection: per-row checkbox + header select-all, optional predicate. ──
const selectionFeatures = tableFeatures({ rowSelectionFeature });

export function SelectionTable(props: { predicated?: boolean }) @{
	const table = useTable({
		features: selectionFeatures,
		data: people,
		columns: nameCols,
		enableRowSelection: props.predicated ? (row: any) => row.original.age > 40 : true,
	});
	captured.table = table;
	<div>
		<input
			id="cb-all"
			type="checkbox"
			checked={table.getIsAllRowsSelected()}
			onClick={table.getToggleAllRowsSelectedHandler()}
		/>
		<span id="sel-n">{String(table.getSelectedRowModel().rows.length)}</span>
		<ul>
			@for (const row of table.getRowModel().rows; key row.id) {
				<li class="sel-row" data-selected={row.getIsSelected() ? '1' : '0'}>
					<input
						id={'cb-' + row.id}
						type="checkbox"
						checked={row.getIsSelected()}
						disabled={!row.getCanSelect()}
						onClick={row.getToggleSelectedHandler()}
					/>
					{row.original.firstName as string}
				</li>
			}
		</ul>
	</div>
}

// ── Column visibility: grouped header (colSpan shrinks) + per-leaf toggles. ──
const groupedCols = [
	{
		id: 'name',
		header: 'Name',
		columns: [
			{ accessorKey: 'firstName', header: 'First' },
			{ accessorKey: 'lastName', header: 'Last' },
		],
	},
	{ accessorKey: 'age', header: 'Age' },
];

const visibilityFeatures = tableFeatures({ columnVisibilityFeature });

export function VisibilityTable() @{
	const table = useTable({
		features: visibilityFeatures,
		data: people,
		columns: groupedCols,
	});
	captured.table = table;
	<div>
		@for (const col of table.getAllLeafColumns(); key col.id) {
			<button
				id={'vis-' + col.id}
				onClick={() => col.toggleVisibility()}
			>{col.id as string}</button>
		}
		<table>
			<thead>
				@for (const hg of table.getHeaderGroups(); key hg.id) {
					<tr>
						@for (const header of hg.headers; key header.id) {
							<th id={'v-th-' + header.id} colSpan={header.colSpan}>
								{header.isPlaceholder
									? null
									: flexRender(header.column.columnDef.header, header.getContext())}
							</th>
						}
					</tr>
				}
			</thead>
			<tbody>
				@for (const row of table.getRowModel().rows; key row.id) {
					<tr class="v-row">
						@for (const cell of row.getVisibleCells(); key cell.id) {
							<td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
						}
					</tr>
				}
			</tbody>
		</table>
	</div>
}

// ── Expanding: nested subRows, expander per row, depth surfaced as data attr. ──
const tree = [
	{
		name: 'root-a',
		subRows: [{ name: 'a-1' }, { name: 'a-2', subRows: [{ name: 'a-2-x' }] }],
	},
	{ name: 'root-b' },
];

const expandFeatures = tableFeatures({
	rowExpandingFeature,
	expandedRowModel: createExpandedRowModel(),
});

export function ExpandTable() @{
	const table = useTable({
		features: expandFeatures,
		data: tree,
		columns: [
			{ accessorKey: 'name', header: 'Name' },
		],
		getSubRows: (row: any) => row.subRows,
	});
	captured.table = table;
	<ul>
		@for (const row of table.getRowModel().rows; key row.id) {
			<li class="e-row" data-rid={row.id} data-depth={String(row.depth)}>
				@if (row.getCanExpand()) {
					<button class="expander" data-for={row.id} onClick={row.getToggleExpandedHandler()}>
						{row.getIsExpanded() ? '-' : '+'}
					</button>
				}
				{row.original.name as string}
			</li>
		}
	</ul>
}

// ── Grouping + aggregation: grouped by status, age SUM in the aggregated row. ──
// v9 splits v8's single grouping concern: `columnGroupingFeature` groups rows and
// `rowAggregationFeature` aggregates their values, so both are opted into here.
const groupFeatures = tableFeatures({
	columnGroupingFeature,
	rowAggregationFeature,
	rowExpandingFeature,
	groupedRowModel: createGroupedRowModel(),
	expandedRowModel: createExpandedRowModel(),
	aggregationFns,
});

export function GroupTable() @{
	const table = useTable({
		features: groupFeatures,
		data: people,
		columns: [
			{ accessorKey: 'status', header: 'Status' },
			{
				accessorKey: 'age',
				header: 'Age',
				aggregationFn: 'sum',
				aggregatedCell: (info: any) => 'sum:' + info.getValue(),
			},
		],
		initialState: { grouping: ['status'], expanded: true },
	});
	captured.table = table;
	<ul>
		@for (const row of table.getRowModel().rows; key row.id) {
			<li class="g-row" data-grouped={row.getIsGrouped() ? '1' : '0'}>
				@for (const cell of row.getAllCells(); key cell.id) {
					<span class="g-cell">
						{cell.getIsAggregated()
							? flexRender(
									cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
									cell.getContext(),
								)
							: cell.getIsPlaceholder()
								? null
								: flexRender(cell.column.columnDef.cell, cell.getContext())}
					</span>
				}
			</li>
		}
	</ul>
}

