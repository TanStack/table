import {
	createSortedRowModel,
	createTableHook,
	rowSortingFeature,
	sortFns,
	tableFeatures,
} from '@tanstack/octane-table';

// createTableHook fixtures — the composition layer: registered table/cell/header
// components read their instance from context, and the App* wrappers provide it.

export const captured: { table?: any; cellCtx: unknown[] } = { cellCtx: [] };

const features = tableFeatures({
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
	sortFns,
});

const data = [
	{ firstName: 'tanner', age: 29 },
	{ firstName: 'derek', age: 45 },
	{ firstName: 'joe', age: 42 },
];

// Registered components resolve their instance through the scoped contexts that
// createTableHook wires into the App* providers.
function TextCell() @{
	const cell = useCellContext();
	captured.cellCtx.push(cell);
	<span class="txt">{'t:' + cell.getValue()}</span>
}

function SortIndicator() @{
	const header = useHeaderContext();
	<i class="sort">{(header.column.getIsSorted() || 'none') as string}</i>
}

function RowCount() @{
	const table = useTableContext();
	<span id="row-count">{'rows=' + table.getRowModel().rows.length}</span>
}

export const {
	useAppTable,
	createAppColumnHelper,
	useTableContext,
	useCellContext,
	useHeaderContext,
} = createTableHook({
	features,
	tableComponents: { RowCount },
	cellComponents: { TextCell },
	headerComponents: { SortIndicator },
});

const columnHelper = createAppColumnHelper<(typeof data)[number]>();

const columns = [
	columnHelper.accessor('firstName', { header: 'First', footer: 'f-first' }),
	columnHelper.accessor('age', { header: 'Age', footer: 'f-age' }),
];

export function AppTableFixture() @{
	const table = useAppTable({ data, columns: columns as any });
	captured.table = table;
	<table.AppTable>
		<div>
			<table.RowCount />
			<table.Subscribe selector={(state) => state.sorting}>
				{(sorting: Array<unknown>) => <span id="sort-n">{'n=' + (sorting?.length ?? 0)}</span>}
			</table.Subscribe>
			<table>
				<thead>
					@for (const hg of table.getHeaderGroups(); key hg.id) {
						<tr>
							@for (const h of hg.headers; key h.id) {
								<table.AppHeader header={h}>
									{(header) => <th
										id={'a-th-' + header.id}
										onClick={header.column.getToggleSortingHandler()}
									>
										<header.FlexRender />
										<header.SortIndicator />
									</th>}
								</table.AppHeader>
							}
						</tr>
					}
				</thead>
				<tbody>
					@for (const row of table.getRowModel().rows; key row.id) {
						<tr>
							@for (const c of row.getAllCells(); key c.id) {
								<table.AppCell cell={c}>
									{(cell) => <td id={'a-td-' + cell.id}>
										<cell.TextCell />
									</td>}
								</table.AppCell>
							}
						</tr>
					}
				</tbody>
				<tfoot>
					@for (const fg of table.getFooterGroups(); key fg.id) {
						<tr>
							@for (const f of fg.headers; key f.id) {
								<table.AppFooter header={f}>
									{(footer) => <td class="a-foot">
										<footer.FlexRender />
									</td>}
								</table.AppFooter>
							}
						</tr>
					}
				</tfoot>
			</table>
		</div>
	</table.AppTable>
}

// AppTable with a selector: children become a render prop over selected state.
export function AppTableWithSelector() @{
	const table = useAppTable({ data, columns: columns as any });
	<table.AppTable selector={(state) => state.sorting}>
		{(sorting) => <div id="sel-out">{'sorted=' + (sorting?.length ?? 0)}</div>}
	</table.AppTable>
}

// Reading table context OUTSIDE an AppTable provider must throw a helpful error.
export function OrphanTableConsumer() @{
	<div>
		<RowCount />
	</div>
}
