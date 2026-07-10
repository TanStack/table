import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  FlexRenderFooter,
  tableFeatures,
  columnVisibilityFeature,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
} from '#src/index.ts';
import { makeData, type Person } from '../utils/make-data';

const features = tableFeatures({
  columnVisibilityFeature,
});

const columnHelper = createColumnHelper<typeof features, Person>();

const columns = columnHelper.columns([
  columnHelper.group({
    id: 'name',
    header: 'Name',
    footer: (props) => props.column.id,
    columns: columnHelper.columns([
      columnHelper.accessor('firstName', {
        cell: (info) => info.getValue(),
        header: () => 'First Name',
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => 'Last Name',
        footer: (props) => props.column.id,
      }),
    ]),
  }),
  columnHelper.group({
    id: 'info',
    header: 'Info',
    footer: (props) => props.column.id,
    columns: columnHelper.columns([
      columnHelper.accessor('age', {
        header: () => 'Age',
        footer: (props) => props.column.id,
      }),
      columnHelper.group({
        id: 'moreInfo',
        header: 'More Info',
        columns: columnHelper.columns([
          columnHelper.accessor('visits', {
            header: () => 'Visits',
            footer: (props) => props.column.id,
          }),
          columnHelper.accessor('status', {
            header: 'Status',
            footer: (props) => props.column.id,
          }),
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            footer: (props) => props.column.id,
          }),
        ]),
      }),
    ]),
  }),
]);

// TanStack Table v9 uses prototype-based methods that require `this` binding.
// Ember templates extract function references without binding, so we provide
// helpers that call methods on the correct object.
const getVisibleCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getVisibleCells();

const getIsVisible = (column: Column<typeof features, Person>): boolean =>
  column.getIsVisible();

const toggleColumnVisibility = (column: Column<typeof features, Person>) => {
  return (event: Event) => {
    column.getToggleVisibilityHandler()(event);
  };
};

export default class ColumnVisibilityTable extends Component {
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

  get leafColumns() {
    return this.table.getAllLeafColumns();
  }

  get isAllColumnsVisible() {
    return this.table.getIsAllColumnsVisible();
  }

  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2);
  }

  refreshData = () => {
    this.data = makeData(20);
  };

  stressTest = () => {
    this.data = makeData(1_000);
  };

  toggleAllColumnsVisibility = (event: Event) => {
    this.table.getToggleAllColumnsVisibilityHandler()(event);
  };

  <template>
    <div class="demo-root">
      <button class="demo-button" {{on "click" this.refreshData}}>Regenerate
        Data</button>
      <button class="demo-button" {{on "click" this.stressTest}}>Stress Test (1k
        rows)</button>
      <div class="spacer-md"></div>
      <div class="column-toggle-panel">
        <div class="column-toggle-panel-header">
          <label>
            <input
              type="checkbox"
              checked={{this.isAllColumnsVisible}}
              {{on "change" this.toggleAllColumnsVisibility}}
            />
            Toggle All
          </label>
        </div>

        {{#each this.leafColumns as |column|}}
          <div class="column-toggle-row">
            <label>
              <input
                type="checkbox"
                checked={{getIsVisible column}}
                {{on "change" (toggleColumnVisibility column)}}
              />
              {{column.id}}
            </label>
          </div>
        {{/each}}
      </div>

      <div class="spacer-md"></div>

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
              {{#each (getVisibleCells row) as |cell|}}
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

      <div class="spacer-md"></div>
      <pre>{{this.tableState}}</pre>
    </div>
  </template>
}
