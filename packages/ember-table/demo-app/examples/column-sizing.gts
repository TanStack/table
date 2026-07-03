import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  FlexRenderFooter,
  tableFeatures,
  columnSizingFeature,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
  type Header,
} from '#src/index.ts';
import { makeData, type Person } from '../utils/make-data';

// This is not the Column Resizing Example, this is a simplified version that
// just sets static column sizes via `size` on the column definitions.

const features = tableFeatures({ columnSizingFeature });

const columnHelper = createColumnHelper<typeof features, Person>();

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 120,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
    footer: (props) => props.column.id,
    size: 120,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    footer: (props) => props.column.id,
    size: 100,
    minSize: 60,
    maxSize: 200,
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
    footer: (props) => props.column.id,
    size: 80,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (props) => props.column.id,
    size: 200,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (props) => props.column.id,
    size: 200,
  }),
]);

// --- Template helpers ---
// TanStack Table v9 uses prototype-based methods that require `this` binding.
// Ember templates extract function references without binding, so we provide
// module-scope helpers that call methods on the correct object.

const getHeaderSize = (header: Header<typeof features, Person>): number =>
  header.getSize();
const getColumnSize = (column: Column<typeof features, Person>): number =>
  column.getSize();
const getCellColumnSize = (cell: Cell<typeof features, Person>): number =>
  cell.column.getSize();
const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells();

export default class ColumnSizingTable extends Component {
  @tracked data: Array<Person> = makeData(20);

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
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

  get allColumns() {
    return this.table.getAllColumns();
  }

  get centerTotalSize() {
    return this.table.getCenterTotalSize();
  }

  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2);
  }

  regenerateData = () => {
    this.data = makeData(20);
  };

  stressTest = () => {
    this.data = makeData(1_000);
  };

  setColumnSize = (columnId: string) => {
    // Don't actually do this to resize columns. This is just for demonstration
    // purposes. See the Column Resizing Example for how to do this with
    // dedicated resizing APIs efficiently.
    return (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.table.setColumnSizing({
        ...this.table.store.state.columnSizing,
        [columnId]: Number(target.value),
      });
    };
  };

  <template>
    <div class="demo-root">
      <div>
        <button class="demo-button" {{on "click" this.regenerateData}}>
          Regenerate Data
        </button>
        <button class="demo-button" {{on "click" this.stressTest}}>
          Stress Test (1k rows)
        </button>
      </div>
      <div class="spacer-md"></div>
      <div class="button-row">
        <div class="section-title">Initial Column Sizes</div>
        <br />
        {{#each this.allColumns as |column|}}
          <div>
            <label>
              {{column.id}}
              <input
                type="number"
                class="column-size-input"
                value={{getColumnSize column}}
                {{on "change" (this.setColumnSize column.id)}}
              />
            </label>
          </div>
        {{/each}}
      </div>
      <div class="spacer-md"></div>
      <div class="scroll-container">
        <table style="width:{{this.centerTotalSize}}px">
          <thead>
            {{#each this.headerGroups as |headerGroup|}}
              <tr>
                {{#each headerGroup.headers as |header|}}
                  <th colspan={{header.colSpan}} style="width:{{getHeaderSize header}}px">
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
                  <td style="width:{{getCellColumnSize cell}}px">
                    <FlexRenderCell @cell={{cell}} />
                  </td>
                {{/each}}
              </tr>
            {{/each}}
          </tbody>
          <tfoot>
            {{#each this.footerGroups as |footerGroup|}}
              <tr>
                {{#each footerGroup.headers as |header|}}
                  <th colspan={{header.colSpan}} style="width:{{getHeaderSize header}}px">
                    {{#unless header.isPlaceholder}}
                      <FlexRenderFooter @footer={{header}} />
                    {{/unless}}
                  </th>
                {{/each}}
              </tr>
            {{/each}}
          </tfoot>
        </table>
      </div>
      <div class="spacer-md"></div>
      <pre>{{this.tableState}}</pre>
    </div>
  </template>
}
