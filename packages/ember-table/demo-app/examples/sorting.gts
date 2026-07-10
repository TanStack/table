import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  FlexRenderFooter,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
  type SortFn,
} from '#src/index.ts';
import { makeData, type Person } from '../utils/make-data';

// --- Table setup ---

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
});

// Custom sorting function for the `status` column: orders statuses in a
// deliberate (non-alphabetical) sequence.
const sortStatusFn: SortFn<typeof features, Person> = (rowA, rowB) => {
  const statusOrder = ['single', 'complicated', 'relationship'];
  return (
    statusOrder.indexOf(rowA.original.status) -
    statusOrder.indexOf(rowB.original.status)
  );
};

const columnHelper = createColumnHelper<typeof features, Person>();

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
    footer: (info) => info.column.id,
    // undefined values sort to the bottom, and sort ascending first.
    sortUndefined: 'last',
    sortDescFirst: false,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
    footer: (info) => info.column.id,
    sortUndefined: 'last',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (info) => info.column.id,
    // Use the custom sorting function defined above.
    sortFn: sortStatusFn,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (info) => info.column.id,
    // Invert the sort direction for this column.
    invertSorting: true,
  }),
]);

// --- Template helpers ---
// TanStack Table v9 uses prototype-based methods that require `this` binding.
// Ember templates extract function references without binding, so we provide
// helpers that call methods on the correct object.

const getCanSort = (column: Column<typeof features, Person>): boolean =>
  column.getCanSort();
const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells();
const lookup = (obj: Record<string, string>, key: string): string =>
  obj[key] ?? '';

const toggleSort = (column: Column<typeof features, Person>) => {
  return (event: Event) => {
    column.getToggleSortingHandler()?.(event);
  };
};

// --- Component ---

export default class SortingTable extends Component {
  @tracked data: Array<Person> = makeData(1_000);

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
  }));

  get headerGroups() {
    return this.table.getHeaderGroups();
  }

  get rows() {
    return this.table.getRowModel().rows.slice(0, 10);
  }

  get footerGroups() {
    return this.table.getFooterGroups();
  }

  get rowCount() {
    return this.table.getRowModel().rows.length.toLocaleString();
  }

  get sortingState() {
    return JSON.stringify(this.table.store.state.sorting ?? [], null, 2);
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

  regenerateData = () => {
    this.data = makeData(1_000);
  };

  stressTest = () => {
    this.data = makeData(1_000_000);
  };

  <template>
    <div class="demo-root">
      <div>
        <button
          class="demo-button demo-button-spaced"
          {{on "click" this.regenerateData}}
        >
          Regenerate Data
        </button>
        <button
          class="demo-button demo-button-spaced"
          {{on "click" this.stressTest}}
        >
          Stress Test (1M rows)
        </button>
      </div>
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
        <tfoot>
          {{#each this.footerGroups as |footerGroup|}}
            <tr>
              {{#each footerGroup.headers as |header|}}
                <th colspan={{header.colSpan}}>
                  {{#unless header.isPlaceholder}}
                    <FlexRenderFooter @footer={{header}} />
                  {{/unless}}
                </th>
              {{/each}}
            </tr>
          {{/each}}
        </tfoot>
      </table>
      <div>{{this.rowCount}} Rows</div>
      <div class="spacer-sm"></div>
      <p>Tip: shift-click a header to sort by multiple columns.</p>
      <pre>{{this.sortingState}}</pre>
    </div>
  </template>
}
