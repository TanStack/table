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
  columnOrderingFeature,
  columnVisibilityFeature,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
  type Header,
  type ColumnPinningPosition,
} from '@tanstack/ember-table'
import { makeData, type Person } from '../utils/make-data'

const features = tableFeatures({
  columnVisibilityFeature,
  columnPinningFeature,
  columnOrderingFeature,
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

const getStartVisibleCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getStartVisibleCells()

const getCenterVisibleCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getCenterVisibleCells()

const getEndVisibleCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getEndVisibleCells()

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

const getIsVisible = (column: Column<typeof features, Person>): boolean =>
  column.getIsVisible()

const toggleColumnVisibility = (column: Column<typeof features, Person>) => {
  return (event: Event) => {
    column.getToggleVisibilityHandler()(event)
  }
}

const shuffle = <T,>(arr: Array<T>): Array<T> => {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}

// --- Reusable header cell (label + pin controls) ---

interface PinHeaderSignature {
  Args: {
    header: Header<typeof features, Person>
  }
}

const PinHeader: TOC<PinHeaderSignature> = <template>
  {{#unless @header.isPlaceholder}}
    <div class='nowrap'>
      <FlexRenderHeader @header={{@header}} />
    </div>
    {{#if (getCanPin @header.column)}}
      <div class='pin-actions'>
        {{#unless (isPinnedStart @header.column)}}
          <button
            class='pin-button'
            {{on 'click' (pin @header.column 'start')}}
          >◀</button>
        {{/unless}}
        {{#if (getIsPinned @header.column)}}
          <button
            class='pin-button'
            {{on 'click' (pin @header.column false)}}
          >✕</button>
        {{/if}}
        {{#unless (isPinnedEnd @header.column)}}
          <button
            class='pin-button'
            {{on 'click' (pin @header.column 'end')}}
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
        start: ['firstName'],
        end: ['progress'],
      },
    },
    // atoms: { columnPinning: columnPinningAtom }, // preferred: own pinning state with an external atom
    // state: { columnPinning }, // classic controlled state; pair with onColumnPinningChange
    // onColumnPinningChange: setColumnPinning,
    // enableColumnPinning: false, // disable pinning for every column; default true
  }))

  get leftHeaderGroups() {
    return this.table.getStartHeaderGroups()
  }

  get centerHeaderGroups() {
    return this.table.getCenterHeaderGroups()
  }

  get rightHeaderGroups() {
    return this.table.getEndHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
  }

  get leafColumns() {
    return this.table.getAllLeafColumns()
  }

  get isAllColumnsVisible() {
    return this.table.getIsAllColumnsVisible()
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

  toggleAllColumnsVisibility = (event: Event) => {
    this.table.getToggleAllColumnsVisibilityHandler()(event)
  }

  shuffleColumns = () => {
    this.table.setColumnOrder(
      shuffle(this.table.getAllLeafColumns().map((column) => column.id)),
    )
  }

  resetOrder = () => {
    this.table.resetColumnOrder()
  }

  <template>
    <div class='column-toggle-panel'>
      <div class='column-toggle-panel-header'>
        <label>
          <input
            type='checkbox'
            checked={{this.isAllColumnsVisible}}
            {{on 'change' this.toggleAllColumnsVisibility}}
          />
          Toggle All
        </label>
      </div>

      {{#each this.leafColumns as |column|}}
        <div class='column-toggle-row'>
          <label>
            <input
              type='checkbox'
              checked={{getIsVisible column}}
              {{on 'change' (toggleColumnVisibility column)}}
            />
            {{column.id}}
          </label>
        </div>
      {{/each}}
    </div>

    <div class='spacer-md'></div>

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
        {{on 'click' this.shuffleColumns}}
      >Shuffle Columns</button>
      <button
        class='demo-button demo-button-sm'
        {{on 'click' this.resetOrder}}
      >Reset Order</button>
    </div>

    <div class='spacer-md'></div>

    <p class='demo-note'>
      This example takes advantage of the "splitting" APIs. (APIs that have
      "left", "center", and "right" modifiers)
    </p>

    <div class='split-tables'>
      {{! Left Side }}
      <table class='outlined-table'>
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
              {{#each (getStartVisibleCells row) as |cell|}}
                <td><FlexRenderCell @cell={{cell}} /></td>
              {{/each}}
            </tr>
          {{/each}}
        </tbody>
      </table>

      {{! Center Side }}
      <table class='outlined-table'>
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
      <table class='outlined-table'>
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
              {{#each (getEndVisibleCells row) as |cell|}}
                <td><FlexRenderCell @cell={{cell}} /></td>
              {{/each}}
            </tr>
          {{/each}}
        </tbody>
      </table>
    </div>

    <div class='spacer-md'></div>
    <pre data-testid='table-state'>{{this.tableState}}</pre>
  </template>
}
