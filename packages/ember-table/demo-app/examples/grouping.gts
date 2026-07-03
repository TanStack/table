import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  flexRender,
  FlexRenderComponentConfig,
  tableFeatures,
  columnGroupingFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  createGroupedRowModel,
  createExpandedRowModel,
  createPaginatedRowModel,
  createFilteredRowModel,
  aggregationFns,
  filterFns,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
  type CellContext,
  type GroupingState,
} from '#src/index.ts';
import type { ComponentLike, ContentValue } from '@glint/template';
import { makeData, type Person } from '../utils/make-data';

const features = tableFeatures({
  columnGroupingFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  aggregationFns,
  filterFns,
});

const columnHelper = createColumnHelper<typeof features, Person>();

const columns = columnHelper.columns([
  columnHelper.group({
    header: 'Name',
    columns: columnHelper.columns([
      columnHelper.accessor('firstName', {
        header: () => 'First Name',
        cell: (info) => info.getValue(),
        getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        header: () => 'Last Name',
        cell: (info) => info.getValue(),
      }),
    ]),
  }),
  columnHelper.group({
    header: 'Info',
    columns: columnHelper.columns([
      columnHelper.accessor('age', {
        header: () => 'Age',
        aggregationFn: 'median',
        aggregatedCell: ({ getValue }) =>
          Math.round(getValue<number>() * 100) / 100,
      }),
      columnHelper.group({
        header: 'More Info',
        columns: columnHelper.columns([
          columnHelper.accessor('visits', {
            header: () => 'Visits',
            aggregationFn: 'sum',
            aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString(),
          }),
          columnHelper.accessor('status', {
            header: 'Status',
          }),
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            cell: ({ getValue }) =>
              `${Math.round(getValue<number>() * 100) / 100}%`,
            aggregationFn: 'mean',
            aggregatedCell: ({ getValue }) =>
              `${Math.round(getValue<number>() * 100) / 100}%`,
          }),
        ]),
      }),
    ]),
  }),
]);

const PAGE_SIZES = [10, 20, 30, 40, 50];

// --- Aggregated cell renderer (renders aggregatedCell ?? cell) ---

type RenderArgs = Record<string, unknown> | undefined;

interface AggregatedCellSignature {
  Args: { cell: Cell<typeof features, Person> };
  Element: null;
}

class FlexRenderAggregatedCell extends Component<AggregatedCellSignature> {
  get result():
    | string
    | number
    | null
    | FlexRenderComponentConfig<typeof features, Person> {
    const cell = this.args.cell;
    const def = cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell;
    return flexRender(def, cell.getContext()) as
      | string
      | number
      | null
      | FlexRenderComponentConfig<typeof features, Person>;
  }

  get resolvedContext(): CellContext<typeof features, Person, unknown> {
    return this.args.cell.getContext();
  }

  get isComponent(): boolean {
    return this.result instanceof FlexRenderComponentConfig;
  }

  get componentToRender():
    | ComponentLike<{
        Args: {
          ctx: CellContext<typeof features, Person, unknown>;
          args?: RenderArgs;
        };
      }>
    | undefined {
    const result = this.result;
    if (result instanceof FlexRenderComponentConfig) {
      return result.component as ComponentLike<{
        Args: {
          ctx: CellContext<typeof features, Person, unknown>;
          args?: RenderArgs;
        };
      }>;
    }
    return undefined;
  }

  get componentArgs(): RenderArgs {
    const result = this.result;
    if (result instanceof FlexRenderComponentConfig) {
      return result.args;
    }
    return undefined;
  }

  get content(): ContentValue {
    return this.result as ContentValue;
  }

  <template>
    {{#if this.isComponent}}
      <this.componentToRender
        @ctx={{this.resolvedContext}}
        @args={{this.componentArgs}}
      />
    {{else}}
      {{this.content}}
    {{/if}}
  </template>
}

// --- Template helpers (v9 methods need explicit `this` binding) ---

const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells();
const getCanGroup = (column: Column<typeof features, Person>): boolean =>
  column.getCanGroup();
const getIsGrouped = (column: Column<typeof features, Person>): boolean =>
  column.getIsGrouped();
const getGroupedIndex = (column: Column<typeof features, Person>): number =>
  column.getGroupedIndex();
const cellIsGrouped = (cell: Cell<typeof features, Person>): boolean =>
  cell.getIsGrouped();
const cellIsAggregated = (cell: Cell<typeof features, Person>): boolean =>
  cell.getIsAggregated();
const cellIsPlaceholder = (cell: Cell<typeof features, Person>): boolean =>
  cell.getIsPlaceholder();
const rowIsExpanded = (row: Row<typeof features, Person>): boolean =>
  row.getIsExpanded();
const rowCanExpand = (row: Row<typeof features, Person>): boolean =>
  row.getCanExpand();
const subRowCount = (row: Row<typeof features, Person>): string =>
  row.subRows.length.toLocaleString();

const toggleGrouping = (column: Column<typeof features, Person>) => () =>
  column.toggleGrouping();
const toggleExpanded = (row: Row<typeof features, Person>) => () =>
  row.toggleExpanded();

const not = (value: unknown): boolean => !value;
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b);

export default class GroupingTable extends Component {
  @tracked data: Array<Person> = makeData(1_000);
  @tracked grouping: GroupingState = [];

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    initialState: { pagination: { pageSize: 20, pageIndex: 0 } },
    state: {
      grouping: this.grouping,
    },
    onGroupingChange: (updater) => {
      this.grouping =
        typeof updater === 'function' ? updater(this.grouping) : updater;
    },
  }));

  get headerGroups() {
    return this.table.getHeaderGroups();
  }

  get rows() {
    return this.table.getRowModel().rows;
  }

  get canPreviousPage() {
    return this.table.getCanPreviousPage();
  }

  get canNextPage() {
    return this.table.getCanNextPage();
  }

  get pagination() {
    return this.table.store.state.pagination;
  }

  get pageSizes() {
    return PAGE_SIZES;
  }

  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2);
  }

  regenerateData = () => {
    this.data = makeData(1_000);
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
    const target = event.currentTarget as HTMLSelectElement;
    this.table.setPageSize(Number(target.value));
  };

  <template>
    <div class="demo-root">
      <div>
        <button {{on "click" this.regenerateData}}>Regenerate Data</button>
      </div>
      <div class="spacer-sm"></div>
      <table>
        <thead>
          {{#each this.headerGroups as |headerGroup|}}
            <tr>
              {{#each headerGroup.headers as |header|}}
                <th colspan={{header.colSpan}}>
                  {{#unless header.isPlaceholder}}
                    <div>
                      {{#if (getCanGroup header.column)}}
                        <button {{on "click" (toggleGrouping header.column)}}>
                          {{#if (getIsGrouped header.column)}}
                            🛑({{getGroupedIndex header.column}})
                          {{else}}
                            👊
                          {{/if}}
                        </button>
                      {{/if}}
                      <FlexRenderHeader @header={{header}} />
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
                <td
                  class="{{if (cellIsGrouped cell) 'cell-grouped'}}
                    {{if (cellIsAggregated cell) 'cell-aggregated'}}
                    {{if (cellIsPlaceholder cell) 'cell-placeholder'}}"
                >
                  {{#if (cellIsGrouped cell)}}
                    <button
                      style="cursor: {{if
                          (rowCanExpand row)
                          'pointer'
                          'normal'
                        }}"
                      {{on "click" (toggleExpanded row)}}
                    >
                      {{if (rowIsExpanded row) "👇" "👉"}}
                    </button>
                    <FlexRenderCell @cell={{cell}} />
                    ({{subRowCount row}})
                  {{else if (cellIsAggregated cell)}}
                    <FlexRenderAggregatedCell @cell={{cell}} />
                  {{else if (cellIsPlaceholder cell)}}
                    {{! placeholder cell - render nothing }}
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
        >
          &lt;&lt;
        </button>
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
        <button
          class="demo-button demo-button-sm"
          disabled={{not this.canNextPage}}
          {{on "click" this.goToLastPage}}
        >
          &gt;&gt;
        </button>
        <select {{on "change" this.handlePageSizeChange}}>
          {{#each this.pageSizes as |pageSize|}}
            <option
              value={{pageSize}}
              selected={{eq pageSize this.pagination.pageSize}}
            >
              Show {{pageSize}}
            </option>
          {{/each}}
        </select>
      </div>
      <div class="spacer-md"></div>
      <pre>{{this.tableState}}</pre>
    </div>
  </template>
}
