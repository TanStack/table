import { module, test } from 'qunit'
import { render, click } from '@ember/test-helpers'
import { setupRenderingTest } from 'ember-qunit'
import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  aggregationFns,
  columnGroupingFeature,
  createGroupedRowModel,
  flexRenderComponent,
  rowAggregationFeature,
  stockFeatures,
  tableFeatures,
  type Row,
  type Cell,
  type CellContext,
  type FlexRenderableSignature,
  type ColumnDef,
} from '#src/index.ts'
import type { TOC } from '@ember/component/template-only'

type Person = { id: string; firstName: string }

const defaultData: Array<Person> = [{ id: '0', firstName: 'Alice' }]

type GroupedPerson = {
  id: string
  region: string
  team: string
  amount: number
}

const groupingFeatures = tableFeatures({
  aggregationFns,
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  rowAggregationFeature,
})

const groupingColumns: Array<
  ColumnDef<typeof groupingFeatures, GroupedPerson>
> = [
  {
    id: 'region',
    accessorKey: 'region',
    cell: (context) => `Region ${String(context.getValue())}`,
  },
  {
    id: 'team',
    accessorKey: 'team',
    cell: (context) => `Team ${String(context.getValue())}`,
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    aggregationFn: 'sum',
    cell: (context) => `Amount ${String(context.getValue())}`,
    aggregatedCell: (context) => `Total ${String(context.getValue())}`,
  },
]

// Templates can't call bound table methods with `this` context, so expose them
// as plain helpers (mirrors the demo-app table templates).
const getVisibleCells = (
  row: Row<typeof stockFeatures, Person>,
): Array<Cell<typeof stockFeatures, Person>> => row.getVisibleCells()

const getGroupingCells = (
  row: Row<typeof groupingFeatures, GroupedPerson>,
): Array<Cell<typeof groupingFeatures, GroupedPerson>> => row.getAllCells()

// --- Cell/header components used by the tests ---

class Badge extends Component<
  FlexRenderableSignature<
    typeof stockFeatures,
    Person,
    string,
    { status: string }
  >
> {
  get status(): string {
    return this.args.options?.status ?? ''
  }

  <template>
    <span data-test-badge>{{this.status}}</span>
  </template>
}

const BadgeA: TOC<
  FlexRenderableSignature<typeof stockFeatures, Person, string, undefined>
> = <template>
  <span data-test-a>A component</span>
</template>

const BadgeB: TOC<
  FlexRenderableSignature<typeof stockFeatures, Person, string, undefined>
> = <template>
  <span data-test-b>B component</span>
</template>

class ExpandBadge extends Component<
  FlexRenderableSignature<typeof stockFeatures, Person, string, undefined>
> {
  get label(): string {
    const ctx = this.args.ctx as CellContext<
      typeof stockFeatures,
      Person,
      unknown
    >
    return ctx.row.getIsExpanded() ? 'expanded' : 'collapsed'
  }

  <template>
    <span data-test-badge>{{this.label}}</span>
  </template>
}

interface ExpandArgs {
  expanded: boolean
  onToggle: () => void
}

class ExpandCell extends Component<
  FlexRenderableSignature<typeof stockFeatures, Person, string, ExpandArgs>
> {
  get label(): string {
    return this.args.options?.expanded ? 'Expanded' : 'Collapsed'
  }

  toggle = () => {
    this.args.options?.onToggle()
  }

  <template>
    <button
      type='button'
      data-test-expand-btn
      {{on 'click' this.toggle}}
    >{{this.label}}</button>
  </template>
}

const HeaderBadge: TOC<
  FlexRenderableSignature<typeof stockFeatures, Person, string, undefined>
> = <template>
  <span data-test-header-badge>Badge Header</span>
</template>

module('Integration | FlexRender', function (hooks) {
  setupRenderingTest(hooks)

  // Angular: unit "should render primitives" + table "Render null/undefined as
  // empty" + "Render primitive". Covers both the function and the raw-value
  // branches of flexRender.
  test('renders primitive and empty cell content', async (assert) => {
    const columns: ColumnDef<typeof stockFeatures, Person, unknown>[] = [
      { id: 'c-null', cell: () => null },
      { id: 'c-undefined', cell: () => undefined },
      { id: 'c-string', cell: 'My string' },
      { id: 'c-number', cell: 0 as unknown as string },
      { id: 'c-fn', cell: () => 'fn value' },
    ]

    class TableComponent extends Component {
      @tracked data = defaultData

      table = useTable(() => ({
        data: this.data,
        features: stockFeatures,
        columns,
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      <template>
        <table>
          <tbody>
            {{#each this.rows as |row|}}
              <tr>
                {{#each (getVisibleCells row) as |cell|}}
                  <td data-test-cell={{cell.column.id}}><FlexRenderCell
                      @cell={{cell}}
                    /></td>
                {{/each}}
              </tr>
            {{/each}}
          </tbody>
        </table>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert.dom('[data-test-cell="c-null"]').hasText('', 'null renders empty')
    assert
      .dom('[data-test-cell="c-undefined"]')
      .hasText('', 'undefined renders empty')
    assert
      .dom('[data-test-cell="c-string"]')
      .hasText('My string', 'string value renders')
    assert
      .dom('[data-test-cell="c-number"]')
      .hasText('0', 'number value renders even if falsey')
    assert
      .dom('[data-test-cell="c-fn"]')
      .hasText('fn value', 'function return value renders')
  })

  test('renders aggregate cells and suppresses grouping placeholders', async (assert) => {
    class TableComponent extends Component {
      table = useTable(() => ({
        data: [
          { id: '1', region: 'Europe', team: 'Blue', amount: 1 },
          { id: '2', region: 'Europe', team: 'Green', amount: 2 },
        ],
        columns: groupingColumns,
        features: groupingFeatures,
        initialState: {
          grouping: ['region', 'team'],
        },
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      <template>
        {{#each this.rows as |row|}}
          <section role='group' aria-label='Grouped row'>
            {{#each (getGroupingCells row) as |cell|}}
              <output role='status' aria-label={{cell.column.id}}>
                <FlexRenderCell @cell={{cell}} />
              </output>
            {{/each}}
          </section>
        {{/each}}
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert
      .dom('[role="status"][aria-label="region"]')
      .hasText('Region Europe', 'the active grouping cell uses its cell render')
    assert
      .dom('[role="status"][aria-label="team"]')
      .hasText('', 'the other grouped column renders as a placeholder')
    assert
      .dom('[role="status"][aria-label="amount"]')
      .hasText('Total 3', 'the aggregate column uses aggregatedCell')
  })

  // Angular: "should render components" / "Render component with FlexRenderComponent".
  test('renders a component cell and reacts to arg changes', async (assert) => {
    class TableComponent extends Component {
      @tracked data = defaultData
      @tracked status = 'Initial status'

      table = useTable(() => ({
        data: this.data,
        features: stockFeatures,
        columns: [
          {
            id: 'status',
            cell: () => flexRenderComponent(Badge, { status: this.status }),
          },
        ],
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      update = () => {
        this.status = 'Updated status'
      }

      <template>
        <table>
          <tbody>
            {{#each this.rows as |row|}}
              <tr>
                {{#each (getVisibleCells row) as |cell|}}
                  <td><FlexRenderCell @cell={{cell}} /></td>
                {{/each}}
              </tr>
            {{/each}}
          </tbody>
        </table>
        <button
          type='button'
          data-test-update
          {{on 'click' this.update}}
        >update</button>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert
      .dom('[data-test-badge]')
      .hasText('Initial status', 'component renders initial arg')

    await click('[data-test-update]')

    assert
      .dom('[data-test-badge]')
      .hasText(
        'Updated status',
        'component re-renders when the reactive arg changes',
      )
  })

  // Angular: "Render content reactively when flexRenderComponent class changes".
  test('switches component type reactively', async (assert) => {
    class TableComponent extends Component {
      @tracked data = defaultData
      @tracked showB = false

      table = useTable(() => ({
        data: this.data,
        features: stockFeatures,
        columns: [
          {
            id: 'switch',
            cell: () =>
              this.showB
                ? flexRenderComponent(BadgeB)
                : flexRenderComponent(BadgeA),
          },
        ],
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      toggle = () => {
        this.showB = !this.showB
      }

      <template>
        <table>
          <tbody>
            {{#each this.rows as |row|}}
              <tr>
                {{#each (getVisibleCells row) as |cell|}}
                  <td><FlexRenderCell @cell={{cell}} /></td>
                {{/each}}
              </tr>
            {{/each}}
          </tbody>
        </table>
        <button
          type='button'
          data-test-toggle
          {{on 'click' this.toggle}}
        >toggle</button>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert.dom('[data-test-a]').exists('renders the first component')
    assert.dom('[data-test-b]').doesNotExist()

    await click('[data-test-toggle]')

    assert
      .dom('[data-test-b]')
      .exists('renders the second component after the type changes')
    assert.dom('[data-test-a]').doesNotExist()
  })

  // Angular: "Render content reactively based on signal value".
  test('switches between primitive, null, and component reactively', async (assert) => {
    class TableComponent extends Component {
      @tracked data = defaultData
      @tracked content: unknown = 'Initial status'

      table = useTable(() => ({
        data: this.data,
        features: stockFeatures,
        columns: [
          {
            id: 'content',
            cell: () => this.content,
          },
        ],
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      setNull = () => {
        this.content = null
      }

      setComponent = () => {
        this.content = flexRenderComponent(Badge, { status: 'Updated status' })
      }

      <template>
        <table>
          <tbody>
            {{#each this.rows as |row|}}
              <tr>
                {{#each (getVisibleCells row) as |cell|}}
                  <td data-test-cell><FlexRenderCell @cell={{cell}} /></td>
                {{/each}}
              </tr>
            {{/each}}
          </tbody>
        </table>
        <button
          type='button'
          data-test-null
          {{on 'click' this.setNull}}
        >null</button>
        <button
          type='button'
          data-test-component
          {{on 'click' this.setComponent}}
        >component</button>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert
      .dom('[data-test-cell]')
      .hasText('Initial status', 'renders the primitive value')

    await click('[data-test-null]')

    assert
      .dom('[data-test-cell]')
      .hasText('', 'renders empty when the value becomes null')

    await click('[data-test-component]')

    assert
      .dom('[data-test-badge]')
      .hasText(
        'Updated status',
        'renders a component when the value becomes a component config',
      )
  })

  // Angular: "Cell content always get the latest context value".
  test('cell component receives the latest context', async (assert) => {
    class TableComponent extends Component {
      @tracked data = defaultData

      table = useTable(() => ({
        data: this.data,
        features: stockFeatures,
        // The flat test rows have no subRows, so opt them into expandability
        getRowCanExpand: () => true,
        columns: [
          {
            id: 'expand',
            cell: () => flexRenderComponent(ExpandBadge),
          },
        ],
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      toggle = () => {
        this.table.getRow('0').toggleExpanded()
      }

      <template>
        <table>
          <tbody>
            {{#each this.rows as |row|}}
              <tr>
                {{#each (getVisibleCells row) as |cell|}}
                  <td><FlexRenderCell @cell={{cell}} /></td>
                {{/each}}
              </tr>
            {{/each}}
          </tbody>
        </table>
        <button
          type='button'
          data-test-toggle
          {{on 'click' this.toggle}}
        >toggle</button>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert
      .dom('[data-test-badge]')
      .hasText('collapsed', 'reads the initial context')

    await click('[data-test-toggle]')

    assert
      .dom('[data-test-badge]')
      .hasText(
        'expanded',
        'cell component re-renders with the latest context value',
      )
  })

  // Angular: "Support cell with component output" — adapted to ember by passing
  // a callback through the component args.
  test('cell component can invoke a callback passed through args', async (assert) => {
    class TableComponent extends Component {
      @tracked data = defaultData

      table = useTable(() => ({
        data: this.data,
        features: stockFeatures,
        // The flat test rows have no subRows, so opt them into expandability
        getRowCanExpand: () => true,
        columns: [
          {
            id: 'expand',
            cell: ({
              row,
            }: CellContext<typeof stockFeatures, Person, unknown>) =>
              flexRenderComponent(ExpandCell, {
                expanded: row.getIsExpanded(),
                onToggle: () => row.toggleExpanded(),
              }),
          },
        ],
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      <template>
        <table>
          <tbody>
            {{#each this.rows as |row|}}
              <tr>
                {{#each (getVisibleCells row) as |cell|}}
                  <td><FlexRenderCell @cell={{cell}} /></td>
                {{/each}}
              </tr>
            {{/each}}
          </tbody>
        </table>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert
      .dom('[data-test-expand-btn]')
      .hasText('Collapsed', 'renders the initial state')

    await click('[data-test-expand-btn]')

    assert
      .dom('[data-test-expand-btn]')
      .hasText(
        'Expanded',
        'the cell callback updates state and the component re-renders',
      )
  })

  // Header rendering via FlexRenderHeader (string and component headers).
  test('renders header content via FlexRenderHeader', async (assert) => {
    class TableComponent extends Component {
      @tracked data = defaultData

      table = useTable(() => ({
        data: this.data,
        features: stockFeatures,
        columns: [
          { id: 'h1', header: 'My Header', cell: () => '' },
          {
            id: 'h2',
            header: () => flexRenderComponent(HeaderBadge),
            cell: () => '',
          },
        ],
      }))

      get headerGroups() {
        return this.table.getHeaderGroups()
      }

      <template>
        <table>
          <thead>
            {{#each this.headerGroups as |headerGroup|}}
              <tr>
                {{#each headerGroup.headers as |header|}}
                  <th data-test-header={{header.column.id}}><FlexRenderHeader
                      @header={{header}}
                    /></th>
                {{/each}}
              </tr>
            {{/each}}
          </thead>
        </table>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert
      .dom('[data-test-header="h1"]')
      .hasText('My Header', 'renders a string header')
    assert.dom('[data-test-header-badge]').exists('renders a component header')
  })

  // Placeholder headers must render their column's header content. Skipping
  // them is the template's job (`{{#unless header.isPlaceholder}}`), which is
  // what makes `header.rowSpan` usable for merging header cells vertically.
  // Every other framework adapter behaves this way.
  test('renders placeholder headers instead of suppressing them', async (assert) => {
    const unevenColumns: Array<ColumnDef<typeof stockFeatures, Person>> = [
      {
        id: 'shallow',
        accessorKey: 'firstName',
        header: 'Shallow',
      },
      {
        id: 'group',
        header: 'Group',
        columns: [
          {
            id: 'deep',
            accessorKey: 'firstName',
            header: 'Deep',
          },
        ],
      },
    ]

    class TableComponent extends Component {
      table = useTable(() => ({
        data: defaultData,
        features: stockFeatures,
        columns: unevenColumns,
      }))

      get headerGroups() {
        return this.table.getHeaderGroups()
      }

      <template>
        <table>
          <thead>
            {{#each this.headerGroups as |headerGroup|}}
              <tr data-test-row={{headerGroup.depth}}>
                {{#each headerGroup.headers as |header|}}
                  <th
                    data-test-cell='{{headerGroup.depth}}-{{header.column.id}}'
                    data-test-placeholder={{header.isPlaceholder}}
                  ><FlexRenderHeader @header={{header}} /></th>
                {{/each}}
              </tr>
            {{/each}}
          </thead>
        </table>
      </template>
    }

    await render(<template><TableComponent /></template>)

    // `shallow` is a leaf one level above the deepest leaf, so the top row
    // holds its spanning placeholder.
    // Glimmer serializes a `true` attribute value as an empty string, so
    // assert presence rather than value.
    assert
      .dom('[data-test-cell="0-shallow"]')
      .hasAttribute(
        'data-test-placeholder',
        '',
        'the top cell is a placeholder',
      )
    assert
      .dom('[data-test-cell="0-group"]')
      .doesNotHaveAttribute(
        'data-test-placeholder',
        'the group header is not a placeholder',
      )
    assert
      .dom('[data-test-cell="0-shallow"]')
      .hasText('Shallow', 'the placeholder still renders its column header')
    assert
      .dom('[data-test-cell="0-group"]')
      .hasText('Group', 'real group headers are unaffected')
    assert
      .dom('[data-test-cell="1-deep"]')
      .hasText('Deep', 'leaf headers are unaffected')
  })
})
