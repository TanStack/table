import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  FlexRenderFooter,
  tableFeatures,
  columnPinningFeature,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
  type ColumnPinningPosition,
} from '@tanstack/ember-table'
import { makeData, type Person } from '../utils/make-data'

const features = tableFeatures({
  columnPinningFeature,
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: () => 'Last Name',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    footer: (props) => props.column.id,
  }),
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
])

// --- Template helpers (v9 methods need explicit `this` binding) ---

const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells()

const getCanPin = (column: Column<typeof features, Person>): boolean =>
  column.getCanPin()

const getIsPinned = (
  column: Column<typeof features, Person>,
): ColumnPinningPosition => column.getIsPinned()

const isPinnedStart = (column: Column<typeof features, Person>): boolean =>
  column.getIsPinned() === 'start'

const isPinnedEnd = (column: Column<typeof features, Person>): boolean =>
  column.getIsPinned() === 'end'

const pin = (
  column: Column<typeof features, Person>,
  side: ColumnPinningPosition,
) => {
  return () => column.pin(side)
}

export default class ColumnPinningTable extends Component {
  @tracked data: Array<Person> = makeData(20)

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    initialState: {
      columnPinning: {
        start: ['firstName'],
        end: ['progress'],
      },
    },
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

  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2)
  }

  regenerateData = () => {
    this.data = makeData(20)
  }

  stressTest = () => {
    this.data = makeData(1_000)
  }

  resetPinning = () => {
    this.table.resetColumnPinning()
  }

  <template>
    <div class='button-row'>
      <button
        class='demo-button demo-button-sm'
        {{on 'click' this.regenerateData}}
      >Regenerate Data</button>
      <button
        class='demo-button demo-button-sm'
        {{on 'click' this.stressTest}}
      >Stress Test (1k rows)</button>
      <button
        class='demo-button demo-button-sm'
        {{on 'click' this.resetPinning}}
      >Reset Pinning</button>
    </div>
    <div class='spacer-md'></div>
    <table>
      <thead>
        {{#each this.headerGroups as |headerGroup|}}
          <tr>
            {{#each headerGroup.headers as |header|}}
              <th colspan={{header.colSpan}}>
                {{#unless header.isPlaceholder}}
                  <div class='nowrap'>
                    <FlexRenderHeader @header={{header}} />
                  </div>
                  {{#if (getCanPin header.column)}}
                    <div class='pin-actions'>
                      {{#unless (isPinnedStart header.column)}}
                        <button
                          class='pin-button'
                          {{on 'click' (pin header.column 'start')}}
                        >◀</button>
                      {{/unless}}
                      {{#if (getIsPinned header.column)}}
                        <button
                          class='pin-button'
                          {{on 'click' (pin header.column false)}}
                        >✕</button>
                      {{/if}}
                      {{#unless (isPinnedEnd header.column)}}
                        <button
                          class='pin-button'
                          {{on 'click' (pin header.column 'end')}}
                        >▶</button>
                      {{/unless}}
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
    <div class='spacer-md'></div>
    <pre>{{this.tableState}}</pre>
  </template>
}
