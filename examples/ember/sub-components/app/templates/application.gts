import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  tableFeatures,
  rowExpandingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createColumnHelper,
  type Row,
  type Cell,
} from '@tanstack/ember-table'
import type { TOC } from '@ember/component/template-only'
import { makeData, type Person } from '../utils/make-data'

const features = tableFeatures({
  rowExpandingFeature,
  columnVisibilityFeature,
  expandedRowModel: createExpandedRowModel(),
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: () => 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
])

// --- Sub-component rendered in the expanded detail row ---

interface SubComponentSignature {
  Args: { row: Row<typeof features, Person> }
}

const SubComponent: TOC<SubComponentSignature> = <template>
  <pre class="code-block" style="font-size: 10px">
    <code>{{jsonify @row}}</code>
  </pre>
</template>

// --- Template helpers (v9 methods need explicit `this` binding) ---

const getVisibleCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getVisibleCells()
const getCanExpand = (row: Row<typeof features, Person>): boolean =>
  row.getCanExpand()
const getIsExpanded = (row: Row<typeof features, Person>): boolean =>
  row.getIsExpanded()
const toggleExpanded = (row: Row<typeof features, Person>) => () =>
  row.toggleExpanded()
const jsonify = (row: Row<typeof features, Person>): string =>
  JSON.stringify(row.original, null, 2)
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b)

export default class SubComponentsTable extends Component {
  @tracked data: Array<Person> = makeData(20)

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    getRowCanExpand: () => true,
  }))

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
  }

  get visibleColumnCount() {
    return this.table.getVisibleLeafColumns().length
  }

  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2)
  }

  regenerateData = () => {
    this.data = makeData(20)
  }

  <template>
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
            {{#each (getVisibleCells row) as |cell index|}}
              <td>
                {{#if (eq index 0)}}
                  {{#if (getCanExpand row)}}
                    <button {{on "click" (toggleExpanded row)}}>
                      {{if (getIsExpanded row) "👇" "👉"}}
                    </button>
                  {{else}}
                    <span>🔵</span>
                  {{/if}}
                {{/if}}
                <FlexRenderCell @cell={{cell}} />
              </td>
            {{/each}}
          </tr>
          {{#if (getIsExpanded row)}}
            <tr>
              <td colspan={{this.visibleColumnCount}}>
                <SubComponent @row={{row}} />
              </td>
            </tr>
          {{/if}}
        {{/each}}
      </tbody>
    </table>
    <div class="spacer-md"></div>
    <pre>{{this.tableState}}</pre>
  </template>
}
