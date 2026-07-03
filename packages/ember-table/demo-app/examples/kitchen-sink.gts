import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  tableFeatures,
  stockFeatures,
  createExpandedRowModel,
  createFilteredRowModel,
  createFacetedRowModel,
  createFacetedMinMaxValues,
  createFacetedUniqueValues,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  sortFns,
  aggregationFns,
  metaHelper,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
  type FilterFn,
  type SortFn,
  type TableFeatures,
} from '#src/index.ts';
import { compareItems, rankItem } from '@tanstack/match-sorter-utils';
import { makeData, type Person } from '../utils/make-data';
import type { RankingInfo } from '@tanstack/match-sorter-utils';

// --- Custom column meta: drives the per-column filter variant ---

interface MyColumnMeta {
  filterVariant?: 'text' | 'range' | 'select';
}

interface FuzzyFilterMeta {
  itemRank?: RankingInfo;
}

type KitchenSinkFeatures = TableFeatures & {
  filterMeta: FuzzyFilterMeta;
  columnMeta: MyColumnMeta;
};

// --- Fuzzy filter + sort (see filters-fuzzy example) ---

const fuzzyFilter: FilterFn<KitchenSinkFeatures, Person> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value as string);
  addMeta?.({ itemRank });
  return itemRank.passed;
};

const fuzzySort: SortFn<KitchenSinkFeatures, Person> = (
  rowA,
  rowB,
  columnId,
) => {
  let dir = 0;
  const rankA = rowA.columnFiltersMeta[columnId]?.itemRank;
  const rankB = rowB.columnFiltersMeta[columnId]?.itemRank;
  if (rankA && rankB) {
    dir = compareItems(rankA, rankB);
  }
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir;
};

const sortStatusFn: SortFn<KitchenSinkFeatures, Person> = (rowA, rowB) => {
  const statusOrder = ['single', 'complicated', 'relationship'];
  return (
    statusOrder.indexOf(rowA.original.status) -
    statusOrder.indexOf(rowB.original.status)
  );
};

const features = tableFeatures({
  ...stockFeatures,
  columnMeta: metaHelper<MyColumnMeta>(),
  filterMeta: metaHelper<FuzzyFilterMeta>(),
  expandedRowModel: createExpandedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedUniqueValues: createFacetedUniqueValues(),
  groupedRowModel: createGroupedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  sortFns: { ...sortFns, fuzzy: fuzzySort, sortStatus: sortStatusFn },
  aggregationFns,
});

type Feats = typeof features;

const columnHelper = createColumnHelper<Feats, Person>();

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    size: 80,
    enableSorting: false,
    enableGrouping: false,
    enableHiding: false,
    header: 'Select',
    cell: '',
  }),
  columnHelper.accessor('firstName', {
    id: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
    filterFn: 'fuzzy',
    sortFn: 'fuzzy',
    meta: { filterVariant: 'text' },
    getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: () => 'Last Name',
    cell: (info) => info.getValue(),
    meta: { filterVariant: 'text' },
  }),
  columnHelper.accessor('age', {
    id: 'age',
    header: () => 'Age',
    meta: { filterVariant: 'range' },
    aggregationFn: 'median',
    aggregatedCell: ({ getValue }) => Math.round(getValue<number>() * 100) / 100,
  }),
  columnHelper.accessor('visits', {
    id: 'visits',
    header: () => 'Visits',
    meta: { filterVariant: 'range' },
    aggregationFn: 'sum',
    aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString(),
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    sortFn: 'sortStatus',
    meta: { filterVariant: 'select' },
  }),
  columnHelper.accessor('progress', {
    id: 'progress',
    header: 'Profile Progress',
    meta: { filterVariant: 'range' },
    aggregationFn: 'mean',
    cell: ({ getValue }) => `${Math.round(getValue<number>() * 100) / 100}%`,
    aggregatedCell: ({ getValue }) =>
      `${Math.round(getValue<number>() * 100) / 100}%`,
  }),
]);

const PAGE_SIZES = [10, 20, 30, 50, 100];

// --- Template helpers (v9 methods need explicit `this` binding) ---

type Col = Column<Feats, Person>;
type Rw = Row<Feats, Person>;
type Cl = Cell<Feats, Person>;

const getVisibleCells = (row: Rw): Array<Cl> => row.getVisibleCells();
const getCanSort = (column: Col): boolean => column.getCanSort();
const getCanFilter = (column: Col): boolean => column.getCanFilter();
const getCanPin = (column: Col): boolean => column.getCanPin();
const getCanGroup = (column: Col): boolean => column.getCanGroup();
const getCanHide = (column: Col): boolean => column.getCanHide();
const getIsVisible = (column: Col): boolean => column.getIsVisible();
const getIsPinned = (column: Col): false | 'left' | 'right' =>
  column.getIsPinned();
const getIsGrouped = (column: Col): boolean => column.getIsGrouped();
const getGroupedIndex = (column: Col): number => column.getGroupedIndex();
const getColumnId = (column: Col): string => column.id;

const cellIsSelect = (cell: Cl): boolean => cell.column.id === 'select';
const cellIsFirstName = (cell: Cl): boolean => cell.column.id === 'firstName';
const cellIsGrouped = (cell: Cl): boolean => cell.getIsGrouped();
const rowGetCanExpand = (row: Rw): boolean => row.getCanExpand();
const rowGetIsExpanded = (row: Rw): boolean => row.getIsExpanded();
const rowGetIsSelected = (row: Rw): boolean => row.getIsSelected();
const rowSubRowCount = (row: Rw): number => row.subRows.length;
const rowDepthPad = (row: Rw): string => `padding-left: ${row.depth * 1.5}rem`;

const lookup = (obj: Record<string, string>, key: string): string =>
  obj[key] ?? '';
const not = (value: unknown): boolean => !value;
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b);

const toggleSort = (column: Col) => (event: Event) => {
  column.getToggleSortingHandler()?.(event);
};
const toggleGroup = (column: Col) => () => {
  column.getToggleGroupingHandler()?.();
};
const pinColumn = (column: Col, side: false | 'left' | 'right') => () => {
  column.pin(side);
};
const toggleVisibility = (column: Col) => (event: Event) => {
  column.getToggleVisibilityHandler()(event);
};
const toggleRowSelected = (row: Rw) => (event: Event) => {
  row.getToggleSelectedHandler()(event);
};
const toggleRowExpanded = (row: Rw) => () => {
  row.getToggleExpandedHandler()();
};

// --- Per-column filter sub-component (text / range / select via facets) ---

interface TableFilterSignature {
  Args: { column: Col };
  Element: null;
}

class TableFilter extends Component<TableFilterSignature> {
  get variant(): string {
    return this.args.column.columnDef.meta?.filterVariant ?? 'text';
  }

  get filterValue(): unknown {
    return this.args.column.getFilterValue();
  }

  get range(): [
    string | number | undefined,
    string | number | undefined,
  ] {
    const value = this.filterValue as
      | [string | number | undefined, string | number | undefined]
      | undefined;
    return value ?? [undefined, undefined];
  }

  get rangeMin(): string {
    const min = this.range[0];
    return min == null ? '' : String(min);
  }

  get rangeMax(): string {
    const max = this.range[1];
    return max == null ? '' : String(max);
  }

  get textValue(): string {
    return (this.filterValue as string | undefined) ?? '';
  }

  get selectValue(): string {
    const value = this.filterValue as string | number | undefined;
    return value == null ? '' : String(value);
  }

  get facetedUniqueCount(): number {
    return this.args.column.getFacetedUniqueValues().size;
  }

  get sortedUniqueValues(): Array<string> {
    if (this.variant === 'range') return [];
    return Array.from(this.args.column.getFacetedUniqueValues().keys())
      .map((v) => String(v))
      .sort()
      .slice(0, 5000);
  }

  handleText = (event: Event) => {
    this.args.column.setFilterValue((event.target as HTMLInputElement).value);
  };

  handleSelect = (event: Event) => {
    const value = (event.target as HTMLSelectElement).value;
    this.args.column.setFilterValue(value === '' ? undefined : value);
  };

  handleMin = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    this.args.column.setFilterValue((old?: [unknown, unknown]) => [
      value,
      old?.[1],
    ]);
  };

  handleMax = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    this.args.column.setFilterValue((old?: [unknown, unknown]) => [
      old?.[0],
      value,
    ]);
  };

  <template>
    {{#if (eq this.variant "range")}}
      <div>
        <input
          type="number"
          placeholder="Min"
          value={{this.rangeMin}}
          {{on "input" this.handleMin}}
        />
        <input
          type="number"
          placeholder="Max"
          value={{this.rangeMax}}
          {{on "input" this.handleMax}}
        />
      </div>
    {{else if (eq this.variant "select")}}
      <select {{on "change" this.handleSelect}}>
        <option value="" selected={{eq this.selectValue ""}}>All</option>
        {{#each this.sortedUniqueValues as |value|}}
          <option value={{value}} selected={{eq value this.selectValue}}>
            {{value}}
          </option>
        {{/each}}
      </select>
    {{else}}
      <input
        type="text"
        placeholder="Search ({{this.facetedUniqueCount}})"
        value={{this.textValue}}
        {{on "input" this.handleText}}
      />
    {{/if}}
  </template>
}

export default class KitchenSinkTable extends Component {
  @tracked data: Array<Person> = makeData(1_000);

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    getSubRows: (row: Person) => row.subRows,
    globalFilterFn: 'fuzzy',
    initialState: {
      columnPinning: { left: ['select'], right: [] },
      pagination: { pageIndex: 0, pageSize: 20 },
    },
    enableRowSelection: true,
  }));

  get headerGroups() {
    return this.table.getHeaderGroups();
  }

  get rows() {
    return this.table.getRowModel().rows;
  }

  get leafColumns() {
    return this.table.getAllLeafColumns();
  }

  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2);
  }

  get globalFilterValue(): string {
    return (this.table.store.state.globalFilter as string | undefined) ?? '';
  }

  get isAllColumnsVisible() {
    return this.table.getIsAllColumnsVisible();
  }

  get isAllPageRowsSelected() {
    return this.table.getIsAllPageRowsSelected();
  }

  get selectedCount() {
    return this.table.getSelectedRowModel().flatRows.length.toLocaleString();
  }

  get totalCount() {
    return this.table.getCoreRowModel().flatRows.length.toLocaleString();
  }

  get filteredCount() {
    return this.table.getFilteredRowModel().rows.length.toLocaleString();
  }

  get sortIndicators(): Record<string, string> {
    const indicators: Record<string, string> = {};
    for (const hg of this.table.getHeaderGroups()) {
      for (const h of hg.headers) {
        const sorted = h.column.getIsSorted();
        indicators[h.column.id] =
          sorted === 'asc' ? ' ▲' : sorted === 'desc' ? ' ▼' : '';
      }
    }
    return indicators;
  }

  get canPreviousPage() {
    return this.table.getCanPreviousPage();
  }

  get canNextPage() {
    return this.table.getCanNextPage();
  }

  get pageCount() {
    return this.table.getPageCount();
  }

  get currentPage() {
    return (this.table.store.state.pagination.pageIndex + 1).toLocaleString();
  }

  get pageCountDisplay() {
    return this.table.getPageCount().toLocaleString();
  }

  get pageSize() {
    return this.table.store.state.pagination.pageSize;
  }

  get pageSizes() {
    return PAGE_SIZES;
  }

  regenerateData = () => {
    this.data = makeData(1_000);
  };

  nestedData = () => {
    this.data = makeData(100, 5, 3);
  };

  stressTest = () => {
    this.data = makeData(10_000);
  };

  resetTable = () => {
    this.table.reset();
  };

  handleGlobalFilter = (event: Event) => {
    this.table.setGlobalFilter((event.currentTarget as HTMLInputElement).value);
  };

  toggleAllColumns = (event: Event) => {
    this.table.getToggleAllColumnsVisibilityHandler()(event);
  };

  toggleAllPageRows = (event: Event) => {
    this.table.getToggleAllPageRowsSelectedHandler()(event);
  };

  goToFirstPage = () => {
    this.table.setPageIndex(0);
  };

  goToPreviousPage = () => {
    this.table.previousPage();
  };

  goToNextPage = () => {
    this.table.nextPage();
  };

  goToLastPage = () => {
    this.table.setPageIndex(this.table.getPageCount() - 1);
  };

  handlePageSizeChange = (event: Event) => {
    this.table.setPageSize(
      Number((event.currentTarget as HTMLSelectElement).value),
    );
  };

  <template>
    <div class="demo-root">
      <h1>Kitchen Sink - All Features</h1>

      <div>
        <input
          type="text"
          placeholder="Fuzzy search all columns..."
          value={{this.globalFilterValue}}
          {{on "input" this.handleGlobalFilter}}
        />
      </div>
      <div class="spacer-sm"></div>
      <div>
        <button
          class="demo-button demo-button-sm"
          {{on "click" this.regenerateData}}
        >Flat 1k</button>
        <button
          class="demo-button demo-button-sm"
          {{on "click" this.nestedData}}
        >Nested 100x5x3</button>
        <button
          class="demo-button demo-button-sm"
          {{on "click" this.stressTest}}
        >Stress 10k</button>
        <button
          class="demo-button demo-button-sm"
          {{on "click" this.resetTable}}
        >Reset Table</button>
        <span>{{this.selectedCount}} of {{this.totalCount}} selected</span>
      </div>

      <div class="spacer-sm"></div>
      <details>
        <summary>Column visibility</summary>
        <div>
          <label>
            <input
              type="checkbox"
              checked={{this.isAllColumnsVisible}}
              {{on "change" this.toggleAllColumns}}
            />
            Toggle All
          </label>
        </div>
        {{#each this.leafColumns as |column|}}
          <div>
            <label>
              <input
                type="checkbox"
                checked={{getIsVisible column}}
                disabled={{not (getCanHide column)}}
                {{on "change" (toggleVisibility column)}}
              />
              {{getColumnId column}}
            </label>
          </div>
        {{/each}}
      </details>

      <div class="spacer-sm"></div>
      <table>
        <thead>
          {{#each this.headerGroups as |headerGroup|}}
            <tr>
              {{#each headerGroup.headers as |header|}}
                <th colspan={{header.colSpan}}>
                  {{#unless header.isPlaceholder}}
                    <div class="header-controls">
                      {{#if (getCanPin header.column)}}
                        {{#unless (eq (getIsPinned header.column) "left")}}
                          <button
                            {{on "click" (pinColumn header.column "left")}}
                          >&lt;</button>
                        {{/unless}}
                        {{#if (getIsPinned header.column)}}
                          <button
                            {{on "click" (pinColumn header.column false)}}
                          >x</button>
                        {{/if}}
                        {{#unless (eq (getIsPinned header.column) "right")}}
                          <button
                            {{on "click" (pinColumn header.column "right")}}
                          >&gt;</button>
                        {{/unless}}
                      {{/if}}
                      {{#if (getCanGroup header.column)}}
                        <button {{on "click" (toggleGroup header.column)}}>
                          {{#if (getIsGrouped header.column)}}
                            Stop ({{getGroupedIndex header.column}})
                          {{else}}
                            Group
                          {{/if}}
                        </button>
                      {{/if}}
                    </div>

                    {{#if (eq (getColumnId header.column) "select")}}
                      <input
                        type="checkbox"
                        checked={{this.isAllPageRowsSelected}}
                        {{on "change" this.toggleAllPageRows}}
                      />
                    {{else if (getCanSort header.column)}}
                      <div
                        class="sortable-header"
                        {{on "click" (toggleSort header.column)}}
                      >
                        <FlexRenderHeader
                          @header={{header}}
                        />{{lookup this.sortIndicators header.column.id}}
                      </div>
                    {{else}}
                      <FlexRenderHeader @header={{header}} />
                    {{/if}}

                    {{#if (getCanFilter header.column)}}
                      <div>
                        <TableFilter @column={{header.column}} />
                      </div>
                    {{/if}}
                  {{/unless}}
                </th>
              {{/each}}
            </tr>
          {{/each}}
        </thead>
        <tbody>
          {{#each this.rows as |row|}}
            <tr>
              {{#each (getVisibleCells row) as |cell|}}
                <td>
                  {{#if (cellIsSelect cell)}}
                    <input
                      type="checkbox"
                      checked={{rowGetIsSelected cell.row}}
                      {{on "change" (toggleRowSelected cell.row)}}
                    />
                  {{else if (cellIsFirstName cell)}}
                    <span style={{rowDepthPad cell.row}}>
                      {{#if (rowGetCanExpand cell.row)}}
                        <button {{on "click" (toggleRowExpanded cell.row)}}>
                          {{if (rowGetIsExpanded cell.row) "v" ">"}}
                        </button>
                      {{/if}}
                      <FlexRenderCell @cell={{cell}} />
                    </span>
                  {{else if (cellIsGrouped cell)}}
                    <button {{on "click" (toggleRowExpanded cell.row)}}>
                      {{if (rowGetIsExpanded cell.row) "v" ">"}}
                      <FlexRenderCell @cell={{cell}} />
                      ({{rowSubRowCount cell.row}})
                    </button>
                  {{else}}
                    <FlexRenderCell @cell={{cell}} />
                  {{/if}}
                </td>
              {{/each}}
            </tr>
          {{/each}}
        </tbody>
      </table>

      <div class="spacer-sm"></div>
      <div class="controls">
        <button
          class="demo-button demo-button-sm"
          disabled={{not this.canPreviousPage}}
          {{on "click" this.goToFirstPage}}
        >&lt;&lt;</button>
        <button
          class="demo-button demo-button-sm"
          disabled={{not this.canPreviousPage}}
          {{on "click" this.goToPreviousPage}}
        >&lt;</button>
        <button
          class="demo-button demo-button-sm"
          disabled={{not this.canNextPage}}
          {{on "click" this.goToNextPage}}
        >&gt;</button>
        <button
          class="demo-button demo-button-sm"
          disabled={{not this.canNextPage}}
          {{on "click" this.goToLastPage}}
        >&gt;&gt;</button>
        <span class="inline-controls">
          <div>Page</div>
          <strong>{{this.currentPage}} of {{this.pageCountDisplay}}</strong>
        </span>
        <select {{on "change" this.handlePageSizeChange}}>
          {{#each this.pageSizes as |size|}}
            <option value={{size}} selected={{eq size this.pageSize}}>
              Show
              {{size}}
            </option>
          {{/each}}
        </select>
      </div>

      <div class="spacer-sm"></div>
      <div>{{this.filteredCount}} filtered of {{this.totalCount}} total</div>

      <div class="spacer-md"></div>
      <details>
        <summary>Table state (live)</summary>
        <pre>{{this.tableState}}</pre>
      </details>
    </div>
  </template>
}
