import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  createFilteredRowModel,
  createSortedRowModel,
  createPaginatedRowModel,
  filterFns,
  sortFns,
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

// --- Fuzzy filter/sort meta ---
// The `filterMeta` slot on the feature set stores the `RankingInfo` produced by
// `rankItem` so the fuzzy sort can compare rows by relevance.

interface FuzzyFilterMeta {
  itemRank?: RankingInfo;
}

type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta };

// The fuzzy filter ranks the cell value against the search term and stores the
// ranking on the row's filter meta (so the sort can reuse it). It tolerates
// typos because `rankItem` does approximate matching.
const fuzzyFilter: FilterFn<FuzzyFeatures, Person> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value as string);
  addMeta?.({ itemRank });
  return itemRank.passed;
};

// When a global filter is active, sort by the stored rank so the best matches
// float to the top. Falls back to alphanumeric when ranks tie.
const fuzzySort: SortFn<FuzzyFeatures, Person> = (rowA, rowB, columnId) => {
  let dir = 0;
  const rankA = rowA.columnFiltersMeta[columnId]?.itemRank;
  const rankB = rowB.columnFiltersMeta[columnId]?.itemRank;
  if (rankA && rankB) {
    dir = compareItems(rankA, rankB);
  }
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir;
};

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  sortFns: { ...sortFns, fuzzy: fuzzySort },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
});

const columnHelper = createColumnHelper<typeof features, Person>();

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
    filterFn: 'fuzzy',
    sortFn: 'fuzzy',
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: () => 'Last Name',
    cell: (info) => info.getValue(),
    filterFn: 'fuzzy',
    sortFn: 'fuzzy',
  }),
  columnHelper.accessor('age', { header: () => 'Age' }),
  columnHelper.accessor('visits', { header: () => 'Visits' }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('progress', { header: 'Profile Progress' }),
]);

const PAGE_SIZES = [10, 20, 30, 40, 50];

// --- Template helpers (v9 methods need explicit `this` binding) ---

const getCanSort = (column: Column<typeof features, Person>): boolean =>
  column.getCanSort();
const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells();
const lookup = (obj: Record<string, string>, key: string): string =>
  obj[key] ?? '';
const not = (value: unknown): boolean => !value;
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b);

const toggleSort = (column: Column<typeof features, Person>) => {
  return (event: Event) => {
    column.getToggleSortingHandler()?.(event);
  };
};

export default class FiltersFuzzyTable extends Component {
  @tracked data: Array<Person> = makeData(2_000);

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    globalFilterFn: 'fuzzy',
  }));

  get headerGroups() {
    return this.table.getHeaderGroups();
  }

  get rows() {
    return this.table.getRowModel().rows;
  }

  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2);
  }

  get globalFilterValue(): string {
    return (this.table.store.state.globalFilter as string | undefined) ?? '';
  }

  get sortIndicators(): Record<string, string> {
    const indicators: Record<string, string> = {};
    for (const hg of this.table.getHeaderGroups()) {
      for (const h of hg.headers) {
        const sorted = h.column.getIsSorted();
        indicators[h.column.id] =
          sorted === 'asc' ? ' 🔼' : sorted === 'desc' ? ' 🔽' : '';
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
    this.data = makeData(2_000);
  };

  stressTest = () => {
    this.data = makeData(50_000);
  };

  handleGlobalFilter = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    this.table.setGlobalFilter(target.value);
  };

  goToPreviousPage = () => {
    this.table.previousPage();
  };

  goToNextPage = () => {
    this.table.nextPage();
  };

  handlePageSizeChange = (event: Event) => {
    const target = event.currentTarget as HTMLSelectElement;
    this.table.setPageSize(Number(target.value));
  };

  <template>
    <div class="demo-root">
      <div>
        <button {{on "click" this.regenerateData}}>Regenerate Data</button>
        <button {{on "click" this.stressTest}}>Stress Test (50k rows)</button>
      </div>
      <div class="spacer-sm"></div>
      <input
        type="text"
        value={{this.globalFilterValue}}
        placeholder="Fuzzy search all columns (typos ok)..."
        {{on "input" this.handleGlobalFilter}}
      />
      <div class="spacer-sm"></div>
      <table>
        <thead>
          {{#each this.headerGroups as |headerGroup|}}
            <tr>
              {{#each headerGroup.headers as |header|}}
                <th colspan={{header.colSpan}}>
                  {{#unless header.isPlaceholder}}
                    <div
                      class="{{if
                          (getCanSort header.column)
                          'sortable-header'
                        }}"
                      {{on "click" (toggleSort header.column)}}
                    >
                      <FlexRenderHeader @header={{header}} />{{lookup
                        this.sortIndicators
                        header.column.id
                      }}
                    </div>
                  {{/unless}}
                </th>
              {{/each}}
            </tr>
          {{/each}}
        </thead>
        <tbody>
          {{#each this.rows as |row|}}
            <tr>
              {{#each (getAllCells row) as |cell|}}
                <td><FlexRenderCell @cell={{cell}} /></td>
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
          {{on "click" this.goToPreviousPage}}
        >
          &lt;
        </button>
        <button
          class="demo-button demo-button-sm"
          disabled={{not this.canNextPage}}
          {{on "click" this.goToNextPage}}
        >
          &gt;
        </button>
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
      <div class="spacer-md"></div>
      <pre>{{this.tableState}}</pre>
    </div>
  </template>
}
