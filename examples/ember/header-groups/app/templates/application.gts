import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  FlexRenderFooter,
  tableFeatures,
  createColumnHelper,
  type Row,
  type Cell,
  type Header,
  type HeaderGroup,
} from '@tanstack/ember-table'
import { makeData, type Person } from '../utils/make-data'

const features = tableFeatures({})

const columnHelper = createColumnHelper<typeof features, Person>()

// A traditional header group setup: every leaf column sits under a top-level
// group, so the tree is even (2 header rows) and no placeholder headers are
// created.
const basicColumns = columnHelper.columns([
  columnHelper.group({
    id: 'basicName',
    header: 'Name',
    columns: columnHelper.columns([
      columnHelper.accessor('firstName', {
        header: () => 'First Name',
        footer: () => 'First Name',
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        header: () => 'Last Name',
        footer: () => 'Last Name',
      }),
    ]),
  }),
  columnHelper.group({
    id: 'basicStats',
    header: 'Stats',
    columns: columnHelper.columns([
      columnHelper.accessor('age', {
        header: () => 'Age',
        footer: () => 'Age',
      }),
      columnHelper.accessor('visits', {
        header: () => 'Visits',
        footer: () => 'Visits',
      }),
    ]),
  }),
  columnHelper.group({
    id: 'basicProfile',
    header: 'Profile',
    columns: columnHelper.columns([
      columnHelper.accessor('status', {
        header: () => 'Status',
        footer: () => 'Status',
      }),
      columnHelper.accessor('progress', {
        header: () => 'Profile Progress',
        footer: () => 'Profile Progress',
      }),
    ]),
  }),
])

// Groups nested inside groups, with every leaf column at the same depth. The
// tree stays even, so there are three header rows and still no placeholders,
// and each group's colSpan is the sum of its descendants.
const nestedColumns = columnHelper.columns([
  columnHelper.group({
    id: 'person',
    header: 'Person',
    columns: columnHelper.columns([
      columnHelper.group({
        id: 'nestedName',
        header: 'Name',
        columns: columnHelper.columns([
          columnHelper.accessor('firstName', {
            header: () => 'First Name',
          }),
          columnHelper.accessor((row) => row.lastName, {
            id: 'lastName',
            header: () => 'Last Name',
          }),
        ]),
      }),
      columnHelper.group({
        id: 'demographics',
        header: 'Demographics',
        columns: columnHelper.columns([
          columnHelper.accessor('age', {
            header: () => 'Age',
          }),
        ]),
      }),
    ]),
  }),
  columnHelper.group({
    id: 'activity',
    header: 'Activity',
    columns: columnHelper.columns([
      columnHelper.group({
        id: 'engagement',
        header: 'Engagement',
        columns: columnHelper.columns([
          columnHelper.accessor('visits', {
            header: () => 'Visits',
          }),
          columnHelper.accessor('status', {
            header: () => 'Status',
          }),
        ]),
      }),
      columnHelper.group({
        id: 'progressGroup',
        header: 'Progress',
        columns: columnHelper.columns([
          columnHelper.accessor('progress', {
            header: () => 'Profile Progress',
          }),
        ]),
      }),
    ]),
  }),
])

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
])

// An uneven column tree: `fullName` and `progress` are top-level leaf columns
// while their siblings nest two and three levels deep. The placeholder at the
// top of each column's placeholder chain carries the chain's full
// `header.rowSpan`, and the headers it covers report a rowSpan of 0 so the
// renderer can skip them.
const unevenColumns = columnHelper.columns([
  columnHelper.accessor(
    (row) => [row.firstName, row.lastName].filter(Boolean).join(' '),
    {
      id: 'fullName',
      header: () => 'Full Name',
      cell: (info) => info.getValue(),
    },
  ),
  columnHelper.group({
    id: 'unevenInfo',
    header: 'Info',
    columns: columnHelper.columns([
      columnHelper.accessor('age', {
        header: () => 'Age',
      }),
      columnHelper.group({
        id: 'unevenMoreInfo',
        header: 'More Info',
        columns: columnHelper.columns([
          columnHelper.accessor('visits', {
            header: () => 'Visits',
          }),
          columnHelper.accessor('status', {
            header: () => 'Status',
          }),
        ]),
      }),
    ]),
  }),
  columnHelper.accessor('progress', {
    header: () => 'Profile Progress',
  }),
])

// TanStack Table v9 uses prototype-based methods that require `this` binding.
// Ember templates extract function references without binding, so we provide
// helpers that call methods on the correct object.
const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells()

// Glimmer templates have no inline operators, so the rowSpan check that skips
// covered headers lives in a helper.
const isNotCovered = (header: Header<typeof features, Person, unknown>) =>
  header.rowSpan !== 0

export default class HeaderGroupsTable extends Component {
  @tracked data: Array<Person> = makeData(5)

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
  }))

  basicTable = useTable(() => ({
    features,
    columns: basicColumns,
    data: this.data,
  }))

  nestedTable = useTable(() => ({
    features,
    columns: nestedColumns,
    data: this.data,
  }))

  unevenTable = useTable(() => ({
    features,
    columns: unevenColumns,
    data: this.data,
  }))

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
  }

  get footerGroups() {
    return this.table.getFooterGroups()
  }

  get basicHeaderGroups() {
    return this.basicTable.getHeaderGroups()
  }

  get basicRows() {
    return this.basicTable.getRowModel().rows
  }

  // Only the leaf columns declare footers, so skip the group row instead of
  // rendering a blank one.
  get basicFooterGroups(): Array<HeaderGroup<typeof features, Person>> {
    return this.basicTable
      .getFooterGroups()
      .filter((footerGroup) =>
        footerGroup.headers.some(
          (header) => !header.isPlaceholder && header.column.columnDef.footer,
        ),
      )
  }

  get nestedHeaderGroups() {
    return this.nestedTable.getHeaderGroups()
  }

  get nestedRows() {
    return this.nestedTable.getRowModel().rows
  }

  get unevenHeaderGroups() {
    return this.unevenTable.getHeaderGroups()
  }

  get unevenRows() {
    return this.unevenTable.getRowModel().rows
  }

  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2)
  }

  refreshData = () => {
    this.data = makeData(5)
  }

  stressTest = () => {
    this.data = makeData(1_000)
  }

  <template>
    <div>
      <button class='demo-button' {{on 'click' this.refreshData}}>Regenerate
        Data</button>
      <button class='demo-button' {{on 'click' this.stressTest}}>Stress Test (1k
        rows)</button>
    </div>
    <div class='spacer-md'></div>
    {{! The panels wrap into a grid whenever the viewport is wide enough. }}
    <div class='example-grid'>
      <section class='example-panel'>
        <h2 class='section-title'>Basic Header Groups</h2>
        <table>
          <thead>
            {{#each this.basicHeaderGroups as |headerGroup|}}
              <tr>
                {{#each headerGroup.headers as |header|}}
                  <th colspan={{header.colSpan}}>
                    <FlexRenderHeader @header={{header}} />
                  </th>
                {{/each}}
              </tr>
            {{/each}}
          </thead>
          <tbody>
            {{#each this.basicRows as |row|}}
              <tr>
                {{#each (getAllCells row) as |cell|}}
                  <td><FlexRenderCell @cell={{cell}} /></td>
                {{/each}}
              </tr>
            {{/each}}
          </tbody>
          <tfoot>
            {{#each this.basicFooterGroups as |footerGroup|}}
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
      </section>

      <section class='example-panel'>
        <h2 class='section-title'>Nested Header Groups</h2>
        <table>
          <thead>
            {{#each this.nestedHeaderGroups as |headerGroup|}}
              <tr>
                {{#each headerGroup.headers as |header|}}
                  <th colspan={{header.colSpan}}>
                    <FlexRenderHeader @header={{header}} />
                  </th>
                {{/each}}
              </tr>
            {{/each}}
          </thead>
          <tbody>
            {{#each this.nestedRows as |row|}}
              <tr>
                {{#each (getAllCells row) as |cell|}}
                  <td><FlexRenderCell @cell={{cell}} /></td>
                {{/each}}
              </tr>
            {{/each}}
          </tbody>
        </table>
      </section>

      <section class='example-panel'>
        <h2 class='section-title'>Placeholder Headers</h2>
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
      </section>

      <section class='example-panel'>
        <h2 class='section-title'>Header Row Spanning</h2>
        <table>
          <thead>
            {{#each this.unevenHeaderGroups as |headerGroup|}}
              <tr>
                {{#each headerGroup.headers as |header|}}
                  {{#if (isNotCovered header)}}
                    <th colspan={{header.colSpan}} rowspan={{header.rowSpan}}>
                      <FlexRenderHeader @header={{header}} />
                    </th>
                  {{/if}}
                {{/each}}
              </tr>
            {{/each}}
          </thead>
          <tbody>
            {{#each this.unevenRows as |row|}}
              <tr>
                {{#each (getAllCells row) as |cell|}}
                  <td><FlexRenderCell @cell={{cell}} /></td>
                {{/each}}
              </tr>
            {{/each}}
          </tbody>
        </table>
      </section>
    </div>
    <div class='spacer-md'></div>
    <pre data-testid='table-state'>{{this.tableState}}</pre>
  </template>
}
