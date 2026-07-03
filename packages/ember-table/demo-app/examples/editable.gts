import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  FlexRenderFooter,
  flexRenderComponent,
  tableFeatures,
  rowPaginationFeature,
  createPaginatedRowModel,
  metaHelper,
  createColumnHelper,
  type Row,
  type Cell,
  type CellContext,
  type ColumnDef,
} from '#src/index.ts';
import { makeData, type Person } from '../utils/make-data';
import type { CellRenderableSignature } from '#src/flex-render.ts';

// Provide our `updateData` meta function to the table via the feature-set
// `tableMeta` slot so `table.options.meta.updateData` types cleanly.
interface MyTableMeta {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  tableMeta: metaHelper<MyTableMeta>(),
});

const columnHelper = createColumnHelper<typeof features, Person>();

// --- Editable cell component ---
// Renders an <input> bound to the cell value. On blur it calls the table's
// `meta.updateData(rowIndex, columnId, value)` (mirrors the Angular EditableCell).

class EditableCell extends Component<
  CellRenderableSignature<typeof features, Person>
> {
  get ctx(): CellContext<typeof features, Person, unknown> {
    return this.args.ctx;
  }

  get value(): string {
    const value = this.ctx.getValue() as string | number | null | undefined;
    return value == null ? '' : String(value);
  }

  onBlur = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    const ctx = this.ctx;
    ctx.table.options.meta?.updateData(
      ctx.row.index,
      ctx.column.id,
      target.value,
    );
  };

  <template>
    <input value={{this.value}} {{on "blur" this.onBlur}} />
  </template>
}

const defaultColumn: Partial<ColumnDef<typeof features, Person>> = {
  cell: () => flexRenderComponent(EditableCell),
};

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: () => 'Last Name',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (info) => info.column.id,
  }),
]);

const PAGE_SIZES = [10, 20, 30, 40, 50];

// --- Template helpers (v9 methods need explicit `this`) ---

const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells();
const not = (value: unknown): boolean => !value;
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b);

export default class EditableTable extends Component {
  @tracked data: Array<Person> = makeData(20);
  @tracked pageIndex = 0;
  @tracked pageSize = 10;

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    defaultColumn,
    state: {
      pagination: { pageIndex: this.pageIndex, pageSize: this.pageSize },
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({ pageIndex: this.pageIndex, pageSize: this.pageSize })
          : updater;
      this.pageIndex = next.pageIndex;
      this.pageSize = next.pageSize;
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        this.data = this.data.map((row, index) =>
          index === rowIndex ? { ...row, [columnId]: value } : row,
        );
      },
    },
  }));

  get headerGroups() {
    return this.table.getHeaderGroups();
  }

  get rows() {
    return this.table.getRowModel().rows;
  }

  get footerGroups() {
    return this.table.getFooterGroups();
  }

  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2);
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
    return (this.pageIndex + 1).toLocaleString();
  }

  get pageCountDisplay() {
    return this.table.getPageCount().toLocaleString();
  }

  get currentPageInputValue() {
    return String(this.pageIndex + 1);
  }

  get pageSizes() {
    return PAGE_SIZES;
  }

  regenerateData = () => {
    this.data = makeData(20);
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

  handleGoToPage = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    const page = target.value ? Number(target.value) - 1 : 0;
    this.table.setPageIndex(page);
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
                    <FlexRenderHeader @header={{header}} />
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
        <tfoot>
          {{#each this.footerGroups as |footerGroup|}}
            <tr>
              {{#each footerGroup.headers as |header|}}
                <th>
                  {{#unless header.isPlaceholder}}
                    <FlexRenderFooter @footer={{header}} />
                  {{/unless}}
                </th>
              {{/each}}
            </tr>
          {{/each}}
        </tfoot>
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
        <span class="inline-controls">
          <div>Page</div>
          <strong>
            {{this.currentPage}} of {{this.pageCountDisplay}}
          </strong>
        </span>
        <span class="inline-controls">
          | Go to page:
          <input
            type="number"
            min="1"
            max={{this.pageCount}}
            value={{this.currentPageInputValue}}
            class="page-size-input"
            {{on "input" this.handleGoToPage}}
          />
        </span>
        <select {{on "change" this.handlePageSizeChange}}>
          {{#each this.pageSizes as |size|}}
            <option value={{size}} selected={{eq size this.pageSize}}>
              Show {{size}}
            </option>
          {{/each}}
        </select>
      </div>
      <div class="spacer-md"></div>
      <pre>{{this.tableState}}</pre>
    </div>
  </template>
}
