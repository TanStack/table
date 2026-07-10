import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import type { TOC } from '@ember/component/template-only'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  tableFeatures,
  columnPinningFeature,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
  type Header,
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
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: 'Age',
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
])

// --- Template helpers (v9 methods need explicit `this` binding) ---

const getLeftVisibleCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getLeftVisibleCells()

const getCenterVisibleCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getCenterVisibleCells()

const getRightVisibleCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getRightVisibleCells()

const getCanPin = (column: Column<typeof features, Person>): boolean =>
  column.getCanPin()

const getIsPinned = (
  column: Column<typeof features, Person>,
): ColumnPinningPosition => column.getIsPinned()

const isPinnedLeft = (column: Column<typeof features, Person>): boolean =>
  column.getIsPinned() === 'left'

const isPinnedRight = (column: Column<typeof features, Person>): boolean =>
  column.getIsPinned() === 'right'

const pin = (
  column: Column<typeof features, Person>,
  side: ColumnPinningPosition,
) => {
  return () => column.pin(side)
}

// --- Reusable header cell (label + pin controls) ---

interface PinHeaderSignature {
  Args: {
    header: Header<typeof features, Person>
  }
}

const PinHeader: TOC<PinHeaderSignature> = <template>
  {{#unless @header.isPlaceholder}}
    <div class="nowrap">
      <FlexRenderHeader @header={{@header}} />
    </div>
    {{#if (getCanPin @header.column)}}
      <div class="pin-actions">
        {{#unless (isPinnedLeft @header.column)}}
          <button
            class="pin-button"
            {{on "click" (pin @header.column "left")}}
          >◀</button>
        {{/unless}}
        {{#if (getIsPinned @header.column)}}
          <button
            class="pin-button"
            {{on "click" (pin @header.column false)}}
          >✕</button>
        {{/if}}
        {{#unless (isPinnedRight @header.column)}}
          <button
            class="pin-button"
            {{on "click" (pin @header.column "right")}}
          >▶</button>
        {{/unless}}
      </div>
    {{/if}}
  {{/unless}}
</template>

export default class ColumnPinningSplitTable extends Component {
  @tracked data: Array<Person> = makeData(20)

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    initialState: {
      columnPinning: {
        left: ['firstName'],
        right: ['progress'],
      },
    },
  }))

  get leftHeaderGroups() {
    return this.table.getLeftHeaderGroups()
  }

  get centerHeaderGroups() {
    return this.table.getCenterHeaderGroups()
  }

  get rightHeaderGroups() {
    return this.table.getRightHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
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

  <template>
    <div class="button-row">
      <button
        class="demo-button demo-button-sm"
        {{on "click" this.regenerateData}}
      >Regenerate Data</button>
      <button
        class="demo-button demo-button-sm"
        {{on "click" this.stressTest}}
      >Stress Test (1k rows)</button>
    </div>

    <div class="spacer-md"></div>

    <p class="demo-note">
      This example takes advantage of the "splitting" APIs. (APIs that have
      "left", "center", and "right" modifiers)
    </p>

    <div class="split-tables">
      {{! Left Side }}
      <table class="outlined-table">
        <thead>
          {{#each this.leftHeaderGroups as |headerGroup|}}
            <tr>
              {{#each headerGroup.headers as |header|}}
                <th colspan={{header.colSpan}}>
                  <PinHeader @header={{header}} />
                </th>
              {{/each}}
            </tr>
          {{/each}}
        </thead>
        <tbody>
          {{#each this.rows as |row|}}
            <tr>
              {{#each (getLeftVisibleCells row) as |cell|}}
                <td><FlexRenderCell @cell={{cell}} /></td>
              {{/each}}
            </tr>
          {{/each}}
        </tbody>
      </table>

      {{! Center Side }}
      <table class="outlined-table">
        <thead>
          {{#each this.centerHeaderGroups as |headerGroup|}}
            <tr>
              {{#each headerGroup.headers as |header|}}
                <th colspan={{header.colSpan}}>
                  <PinHeader @header={{header}} />
                </th>
              {{/each}}
            </tr>
          {{/each}}
        </thead>
        <tbody>
          {{#each this.rows as |row|}}
            <tr>
              {{#each (getCenterVisibleCells row) as |cell|}}
                <td><FlexRenderCell @cell={{cell}} /></td>
              {{/each}}
            </tr>
          {{/each}}
        </tbody>
      </table>

      {{! Right Side }}
      <table class="outlined-table">
        <thead>
          {{#each this.rightHeaderGroups as |headerGroup|}}
            <tr>
              {{#each headerGroup.headers as |header|}}
                <th colspan={{header.colSpan}}>
                  <PinHeader @header={{header}} />
                </th>
              {{/each}}
            </tr>
          {{/each}}
        </thead>
        <tbody>
          {{#each this.rows as |row|}}
            <tr>
              {{#each (getRightVisibleCells row) as |cell|}}
                <td><FlexRenderCell @cell={{cell}} /></td>
              {{/each}}
            </tr>
          {{/each}}
        </tbody>
      </table>
    </div>

    <div class="spacer-md"></div>
    <pre>{{this.tableState}}</pre>
  </template>
}
