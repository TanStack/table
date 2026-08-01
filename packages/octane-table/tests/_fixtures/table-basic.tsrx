import { useState } from 'octane';
import {
	createSortedRowModel,
	flexRender,
	rowSortingFeature,
	sortFns,
	tableFeatures,
	useTable,
} from '@tanstack/octane-table';

// Core-wiring fixtures. Data/columns are module-level (referentially stable)
// so table-core's row-model memoization isn't perturbed and render-count
// probes measure only the state wiring.

export const renders = { basic: 0, sorting: 0, controlled: 0, selected: 0 };
export const captured: {
	table?: unknown;
	tables: unknown[];
	sortingStates: unknown[];
	selectedStates: unknown[];
} = { tables: [], sortingStates: [], selectedStates: [] };

export const defaultData = [
	{ firstName: 'tanner', lastName: 'linsley', age: 29 },
	{ firstName: 'derek', lastName: 'perkins', age: 40 },
	{ firstName: 'joe', lastName: 'bergevin', age: 45 },
];
export const altData = [
	{ firstName: 'kevin', lastName: 'vandy', age: 27 },
	{ firstName: 'tanner', lastName: 'linsley', age: 29 },
];

const defaultColumns = [
	{
		accessorKey: 'firstName',
		header: 'First Name',
		footer: 'fn-footer',
		cell: (info: any) => info.getValue(),
	},
	{ accessorKey: 'lastName', header: () => 'Last Name', cell: (info: any) => info.getValue() },
	{ accessorKey: 'age', header: 'Age' },
];
const altColumns = [
	{ accessorKey: 'age', header: 'Only Age' },
];

// v9 always builds the core row model, so a plain table opts into no features.
const coreFeatures = tableFeatures({});

const sortingFeatures = tableFeatures({
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
	sortFns,
});

// Full-markup table (thead/tbody/tfoot, all through flexRender), used both
// standalone and by the swap harness below.
export function BasicTable(props: { data?: any; columns?: any }) @{
	renders.basic++;
	const table = useTable({
		features: coreFeatures,
		data: props.data ?? defaultData,
		columns: props.columns ?? defaultColumns,
	});
	captured.table = table;
	captured.tables.push(table);
	<table>
		<thead>
			@for (const hg of table.getHeaderGroups(); key hg.id) {
				<tr>
					@for (const header of hg.headers; key header.id) {
						<th id={'th-' + header.id}>
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
				<tr>
					@for (const cell of row.getAllCells(); key cell.id) {
						<td id={'td-' + cell.id}>{flexRender(
							cell.column.columnDef.cell,
							cell.getContext(),
						)}</td>
					}
				</tr>
			}
		</tbody>
		<tfoot>
			@for (const fg of table.getFooterGroups(); key fg.id) {
				<tr>
					@for (const header of fg.headers; key header.id) {
						<th>
							{header.isPlaceholder
								? null
								: flexRender(header.column.columnDef.footer, header.getContext())}
						</th>
					}
				</tr>
			}
		</tfoot>
	</table>
}

// Parent-driven data/columns swaps (props propagate through the render-phase
// setOptions) + an unrelated-state bump for the instance-identity probe.
export function SwapApp() @{
	const [alt, setAlt] = useState(false);
	const [altCols, setAltCols] = useState(false);
	const [bump, setBump] = useState(0);
	<div>
		<BasicTable
			data={alt ? altData : defaultData}
			columns={altCols ? altColumns : defaultColumns}
		/>
		<button id="swap-data" onClick={() => setAlt(!alt)}>data</button>
		<button id="swap-cols" onClick={() => setAltCols(!altCols)}>cols</button>
		<button id="bump" onClick={() => setBump(bump + 1)}>{'bump=' + bump}</button>
	</div>
}

// Uncontrolled sorting + render-count probe + double-toggle (functional
// updater) button. Deliberately NO `onSortingChange`: in v9 the feature's
// DEFAULT handler is `makeStateUpdater('sorting', table)`, which writes the
// sorting atom, so supplying one REPLACES that writer and makes the slice
// controlled (see ControlledSortingTable).
export function SortingTable() @{
	renders.sorting++;
	const table = useTable({
		features: sortingFeatures,
		data: defaultData,
		columns: defaultColumns,
	});
	captured.table = table;
	<div>
		<table>
			<thead>
				@for (const hg of table.getHeaderGroups(); key hg.id) {
					<tr>
						@for (const header of hg.headers; key header.id) {
							<th id={'s-th-' + header.id} onClick={header.column.getToggleSortingHandler()}>
								{flexRender(header.column.columnDef.header, header.getContext())}
								{{ asc: ' A', desc: ' D' }[header.column.getIsSorted() as string] ?? ''}
							</th>
						}
					</tr>
				}
			</thead>
			<tbody>
				@for (const row of table.getRowModel().rows; key row.id) {
					<tr>
						@for (const cell of row.getAllCells(); key cell.id) {
							<td class="s-cell">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
						}
					</tr>
				}
			</tbody>
		</table>
	</div>
}

// Partially-controlled sorting: the parent owns `sorting` (state + feature
// handler), everything else stays uncontrolled.
export function ControlledSortingTable() @{
	renders.controlled++;
	const [sorting, setSorting] = useState([] as any);
	captured.sortingStates.push(sorting);
	const table = useTable({
		features: sortingFeatures,
		data: defaultData,
		columns: defaultColumns,
		state: { sorting },
		onSortingChange: setSorting,
	});
	<table>
		<thead>
			@for (const hg of table.getHeaderGroups(); key hg.id) {
				<tr>
					@for (const header of hg.headers; key header.id) {
						<th
							id={'c-th-' + header.id}
							onClick={header.column.getToggleSortingHandler()}
						>{flexRender(header.column.columnDef.header, header.getContext())}</th>
					}
				</tr>
			}
		</thead>
		<tbody>
			@for (const row of table.getRowModel().rows; key row.id) {
				<tr>
					@for (const cell of row.getAllCells(); key cell.id) {
						<td class="c-cell">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
					}
				</tr>
			}
		</tbody>
	</table>
}

// v9-only adapter surface: the second `useTable` argument projects from
// `table.store`, and that projection — not the whole table state — is what
// lands on `table.state`.
export function SelectorTable() @{
	renders.selected++;
	const table = useTable(
		{
			features: sortingFeatures,
			data: defaultData,
			columns: defaultColumns,
		},
		(state) => ({ sortCount: state.sorting?.length ?? 0 }),
	);
	captured.table = table;
	captured.selectedStates.push(table.state);
	<div>
		<span id="sel-state">{'n=' + table.state.sortCount}</span>
		<button id="sel-sort" onClick={() => table.getColumn('firstName')!.toggleSorting()}>
			sort
		</button>
	</div>
}

