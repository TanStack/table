// Authored in .tsrx because it renders context Providers and calls slot-keyed
// hooks (`useRef`, `useMemo`). Every type lives in `./types`, so the
// `.tsrx.d.ts` sidecar only restates this one signature.
import { createColumnHelper as coreCreateColumnHelper } from '@tanstack/table-core';
import { createContext, useContext, useMemo, useRef } from 'octane';
import { FlexRender } from './FlexRender';
import { splitSlot } from './internal';
import { useTable } from './useTable.tsrx';
import type {
	Cell,
	CellData,
	Header,
	RowData,
	TableFeatures,
	TableOptions,
	TableState,
} from '@tanstack/table-core';
import type { Context, OctaneNode } from 'octane';
import type {
	AppCellComponent,
	AppCellPropsWithSelector,
	AppCellPropsWithoutSelector,
	AppColumnHelper,
	AppHeaderComponent,
	AppHeaderPropsWithSelector,
	AppHeaderPropsWithoutSelector,
	AppOctaneTable,
	AppTableComponent,
	AppTablePropsWithSelector,
	AppTablePropsWithoutSelector,
	CreateTableHookOptions,
	CreateTableHookResult,
	OctaneTable,
	TableComponentType,
} from './types';

const sharedTableContext = createContext<OctaneTable<any, any> | null>(null);
const sharedCellContext = createContext<Cell<any, any, any> | null>(null);
const sharedHeaderContext = createContext<Header<any, any, any> | null>(null);

/**
 * Creates a custom table hook with pre-bound components for composition.
 *
 * This is the table equivalent of TanStack Form's `createFormHook`. It lets you:
 * - Define features, row models, and default options once, shared across tables
 * - Register reusable table, cell, and header components
 * - Access table/cell/header instances via context in those components
 * - Get a `useAppTable` hook returning a table with App wrapper components
 * - Get a `createAppColumnHelper` function pre-bound to your features
 *
 * @example
 * ```tsx
 * // hooks/table.ts
 * export const {
 *   useAppTable,
 *   createAppColumnHelper,
 *   useTableContext,
 *   useCellContext,
 *   useHeaderContext,
 * } = createTableHook({
 *   features: tableFeatures({
 *     rowPaginationFeature,
 *     rowSortingFeature,
 *     columnFilteringFeature,
 *     paginatedRowModel: createPaginatedRowModel(),
 *     sortedRowModel: createSortedRowModel(),
 *     filteredRowModel: createFilteredRowModel(),
 *     sortFns,
 *     filterFns,
 *   }),
 *   tableComponents: { PaginationControls, RowCount },
 *   cellComponents: { TextCell, NumberCell },
 *   headerComponents: { SortIndicator, ColumnFilter },
 * })
 *
 * // components/table-components.tsrx
 * function SortIndicator() @{
 *   const header = useHeaderContext()
 *   <span>{(header.column.getIsSorted() || '') as string}</span>
 * }
 *
 * // features/users.tsrx
 * function UsersTable({ data }: { data: Array<Person> }) @{
 *   const table = useAppTable({ columns, data })
 *
 *   <table.AppTable>
 *     <table>
 *       <tbody>
 *         @for (const row of table.getRowModel().rows; key row.id) {
 *           <tr>
 *             @for (const c of row.getAllCells(); key c.id) {
 *               <table.AppCell cell={c}>
 *                 {(cell) => <td><cell.TextCell /></td>}
 *               </table.AppCell>
 *             }
 *           </tr>
 *         }
 *       </tbody>
 *     </table>
 *     <table.PaginationControls />
 *   </table.AppTable>
 * }
 * ```
 */
export function createTableHook<
	TFeatures extends TableFeatures,
	TTableComponents extends Record<string, TableComponentType>,
	TCellComponents extends Record<string, TableComponentType>,
	THeaderComponents extends Record<string, TableComponentType>,
>({
	tableComponents,
	cellComponents,
	headerComponents,
	tableContext = sharedTableContext as Context<OctaneTable<any, any>>,
	cellContext = sharedCellContext as Context<Cell<any, any, any>>,
	headerContext = sharedHeaderContext as Context<Header<any, any, any>>,
	...defaultTableOptions
}: CreateTableHookOptions<
	TFeatures,
	TTableComponents,
	TCellComponents,
	THeaderComponents
>): CreateTableHookResult<TFeatures, TTableComponents, TCellComponents, THeaderComponents> {
	const TableContext = tableContext as unknown as Context<OctaneTable<TFeatures, any, any>>;
	const CellContext = cellContext as unknown as Context<Cell<TFeatures, any, any>>;
	const HeaderContext = headerContext as unknown as Context<Header<TFeatures, any, any>>;

	/**
 * Create a column helper pre-bound to the features and components configured
 * in this table hook. The cell, header, and footer contexts include pre-bound
 * components (e.g. `cell.TextCell`).
 *
 * @example
 * ```tsx
 * const columnHelper = createAppColumnHelper<Person>()
 *
 * const columns = [
 *   columnHelper.accessor('firstName', {
 *     header: 'First Name',
 *     cell: ({ cell }) => <cell.TextCell />, // cell has pre-bound components
 *   }),
 * ]
 * ```
 */
	function createAppColumnHelper<TData extends RowData>(): AppColumnHelper<
		TFeatures,
		TData,
		TCellComponents,
		THeaderComponents
	> {
		// The runtime implementation is the same — components are attached at
		// render time. This cast provides the enhanced column-def types.
		return coreCreateColumnHelper<TFeatures, TData>() as unknown as AppColumnHelper<
			TFeatures,
			TData,
			TCellComponents,
			THeaderComponents
		>;
	}

	/**
 * Access the table instance from within an `AppTable` wrapper. Use this in
 * custom `tableComponents` passed to `createTableHook`. `TFeatures` is already
 * known from the `createTableHook` call.
 *
 * @example
 * ```tsx
 * function PaginationControls() @{
 *   const table = useTableContext()
 *   <table.Subscribe selector={(s) => s.pagination}>
 *     {(pagination) => (
 *       <button onClick={() => table.nextPage()}>{(pagination.pageIndex + 1) as unknown as string}</button>
 *     )}
 *   </table.Subscribe>
 * }
 * ```
 */
	function useTableContext<
		TData extends RowData = RowData,
		TSelected = TableState<TFeatures>,
	>(): AppOctaneTable<
		TFeatures,
		TData,
		TSelected,
		TTableComponents,
		TCellComponents,
		THeaderComponents
	> {
		const table = useContext(TableContext);

		if (!table) {
			throw new Error('`useTableContext` must be used within an `AppTable` component. ' +
				'Make sure your component is wrapped with `<table.AppTable>...</table.AppTable>`.');
		}

		// The value provided by `<table.AppTable>` is the extended table (the App*
		// wrapper components and `tableComponents` are Object.assign-ed onto the
		// same instance `useAppTable` returns), so this asserts the runtime shape.
		return table as unknown as AppOctaneTable<
			TFeatures,
			TData,
			TSelected,
			TTableComponents,
			TCellComponents,
			THeaderComponents
		>;
	}

	/**
 * Access the cell instance from within an `AppCell` wrapper. Use this in
 * custom `cellComponents` passed to `createTableHook`.
 *
 * @example
 * ```tsx
 * function TextCell() @{
 *   const cell = useCellContext<string>()
 *   <span>{cell.getValue()}</span>
 * }
 * ```
 */
	function useCellContext<TValue extends CellData = CellData>() {
		const cell = useContext(CellContext);

		if (!cell) {
			throw new Error('`useCellContext` must be used within an `AppCell` component. ' +
				'Make sure your component is wrapped with `<table.AppCell cell={cell}>...</table.AppCell>`.');
		}

		// `<table.AppCell>` Object.assign-es `cellComponents` and `FlexRender` onto
		// the same cell instance it provides, so this asserts the runtime shape.
		return cell as unknown as
			Cell<TFeatures, any, TValue> & TCellComponents & {
				FlexRender: () => OctaneNode;
			};
	}

	/**
 * Access the header instance from within an `AppHeader` or `AppFooter`
 * wrapper. Use this in custom `headerComponents` passed to `createTableHook`.
 *
 * @example
 * ```tsx
 * function SortIndicator() @{
 *   const header = useHeaderContext()
 *   <span>{(header.column.getIsSorted() || '') as string}</span>
 * }
 * ```
 */
	function useHeaderContext<TValue extends CellData = CellData>() {
		const header = useContext(HeaderContext);

		if (!header) {
			throw new Error('`useHeaderContext` must be used within an `AppHeader` or `AppFooter` component.');
		}

		// `<table.AppHeader>` / `<table.AppFooter>` Object.assign `headerComponents`
		// and `FlexRender` onto the same header instance they provide.
		return header as unknown as
			Header<TFeatures, any, TValue> & THeaderComponents & {
				FlexRender: () => OctaneNode;
			};
	}

	/** Context-aware FlexRender for cells — reads the cell from context. */
	function CellFlexRender() {
		const cell = useCellContext();
		return <FlexRender cell={cell} />;
	}

	/** Context-aware FlexRender for headers — reads the header from context. */
	function HeaderFlexRender() {
		const header = useHeaderContext();
		return <FlexRender header={header} />;
	}

	/** Context-aware FlexRender for footers — reads the header from context. */
	function FooterFlexRender() {
		const header = useHeaderContext();
		return <FlexRender footer={header} />;
	}

	/**
 * Enhanced `useTable` that returns a table with App wrapper components and
 * pre-bound `tableComponents` attached directly to the table object.
 *
 * Default options from `createTableHook` are merged with the options passed
 * here; options passed here take precedence.
 */
	function useAppTable<TData extends RowData, TSelected = TableState<TFeatures>>(
		tableOptions: Omit<TableOptions<TFeatures, TData>, 'features'>,
		// `selector` is optional, so the compiler-injected call-site slot would
		// land in it. Split it off before reading the selector — see ./internal.
		...rest: [selector?: (state: TableState<TFeatures>) => TSelected, slot?: symbol]
	): AppOctaneTable<
		TFeatures,
		TData,
		TSelected,
		TTableComponents,
		TCellComponents,
		THeaderComponents
	> {
		const [user] = splitSlot(rest);
		const selector = user[0] as ((state: TableState<TFeatures>) => TSelected) | undefined;

		// Merge default options with provided options (provided takes precedence).
		const table = useTable<TFeatures, TData, TSelected>(
			{ ...defaultTableOptions, ...tableOptions } as TableOptions<TFeatures, TData>,
			selector,
		);

		// `useTable` returns a fresh `table` reference every render. The App wrapper
		// components below must NOT close over that reference, or they would be
		// recreated each render and octane would remount their entire subtree on
		// every state update (e.g. a controlled input in a toolbar would lose focus
		// on each keystroke). Instead the components stay stable (created once) and
		// read the current table from a ref refreshed every render.
		const tableRef = useRef(table);
		tableRef.current = table;

		// AppTable — root wrapper providing table context, with optional Subscribe.
		const AppTable = useMemo(() => {
			function AppTableImpl<TAppTableSelected>(
				props: | AppTablePropsWithoutSelector
				| AppTablePropsWithSelector<TFeatures, TAppTableSelected>,
			) {
				const { children, selector: appTableSelector } = props as any;
				const currentTable = tableRef.current;
				const TableSubscribe = currentTable.Subscribe as any;

				const body =
					appTableSelector
						? <TableSubscribe selector={appTableSelector}>
								{(state: TAppTableSelected) => children(state)}
							</TableSubscribe>
						: children;

				return <TableContext.Provider value={currentTable}>{body}</TableContext.Provider>;
			}
			return AppTableImpl as AppTableComponent<TFeatures>;
		}, []);

		// AppCell — cell context, pre-bound cellComponents, optional Subscribe.
		const AppCell = useMemo(() => {
			function AppCellImpl<TValue extends CellData = CellData, TAppCellSelected = unknown>(
				props: | AppCellPropsWithoutSelector<TFeatures, TData, TValue, TCellComponents>
				| AppCellPropsWithSelector<TFeatures, TData, TValue, TCellComponents, TAppCellSelected>,
			) {
				const { cell, children, selector: appCellSelector } = props as any;
				const currentTable = tableRef.current;
				const TableSubscribe = currentTable.Subscribe as any;
				const extendedCell = Object.assign(cell, {
					FlexRender: CellFlexRender,
					...cellComponents,
				});

				const body =
					appCellSelector
						? <TableSubscribe selector={appCellSelector}>
								{(state: TAppCellSelected) => children(extendedCell, state)}
							</TableSubscribe>
						: children(extendedCell);

				return <CellContext.Provider value={cell}>{body}</CellContext.Provider>;
			}
			return AppCellImpl as AppCellComponent<TFeatures, TData, TCellComponents>;
		}, []);

		// AppHeader — header context, pre-bound headerComponents, optional Subscribe.
		const AppHeader = useMemo(() => {
			function AppHeaderImpl<TValue extends CellData = CellData, TAppHeaderSelected = unknown>(
				props: | AppHeaderPropsWithoutSelector<TFeatures, TData, TValue, THeaderComponents>
				| AppHeaderPropsWithSelector<
						TFeatures,
						TData,
						TValue,
						THeaderComponents,
						TAppHeaderSelected
				  >,
			) {
				const { header, children, selector: appHeaderSelector } = props as any;
				const currentTable = tableRef.current;
				const TableSubscribe = currentTable.Subscribe as any;
				const extendedHeader = Object.assign(header, {
					FlexRender: HeaderFlexRender,
					...headerComponents,
				});

				const body =
					appHeaderSelector
						? <TableSubscribe selector={appHeaderSelector}>
								{(state: TAppHeaderSelected) => children(extendedHeader, state)}
							</TableSubscribe>
						: children(extendedHeader);

				return <HeaderContext.Provider value={header}>{body}</HeaderContext.Provider>;
			}
			return AppHeaderImpl as AppHeaderComponent<TFeatures, TData, THeaderComponents>;
		}, []);

		// AppFooter — same as AppHeader (footers use the Header type), but its
		// context-bound FlexRender renders `columnDef.footer`.
		const AppFooter = useMemo(() => {
			function AppFooterImpl<TValue extends CellData = CellData, TAppFooterSelected = unknown>(
				props: | AppHeaderPropsWithoutSelector<TFeatures, TData, TValue, THeaderComponents>
				| AppHeaderPropsWithSelector<
						TFeatures,
						TData,
						TValue,
						THeaderComponents,
						TAppFooterSelected
				  >,
			) {
				const { header, children, selector: appFooterSelector } = props as any;
				const currentTable = tableRef.current;
				const TableSubscribe = currentTable.Subscribe as any;
				const extendedHeader = Object.assign(header, {
					FlexRender: FooterFlexRender,
					...headerComponents,
				});

				const body =
					appFooterSelector
						? <TableSubscribe selector={appFooterSelector}>
								{(state: TAppFooterSelected) => children(extendedHeader, state)}
							</TableSubscribe>
						: children(extendedHeader);

				return <HeaderContext.Provider value={header}>{body}</HeaderContext.Provider>;
			}
			return AppFooterImpl as AppHeaderComponent<TFeatures, TData, THeaderComponents>;
		}, []);

		// Combine everything into the extended table API.
		const extendedTable = useMemo(() => {
			return Object.assign(table, {
				AppTable,
				AppCell,
				AppHeader,
				AppFooter,
				...tableComponents,
			}) as AppOctaneTable<
				TFeatures,
				TData,
				TSelected,
				TTableComponents,
				TCellComponents,
				THeaderComponents
			>;
		}, [table, AppTable, AppCell, AppHeader, AppFooter]);

		return extendedTable;
	}

	return {
		appFeatures: defaultTableOptions.features as TFeatures,
		createAppColumnHelper,
		useAppTable,
		useTableContext,
		useCellContext,
		useHeaderContext,
	};
}


