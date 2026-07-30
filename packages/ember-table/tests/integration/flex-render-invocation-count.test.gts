import { module, test } from 'qunit'
import { render } from '@ember/test-helpers'
import { setupRenderingTest } from 'ember-qunit'
import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  stockFeatures,
  type Row,
  type Cell,
  type ColumnDef,
} from '#src/index.ts'

type Person = { id: string; firstName: string }

const getVisibleCells = (
  row: Row<typeof stockFeatures, Person>,
): Array<Cell<typeof stockFeatures, Person>> => row.getVisibleCells()

// The result of a columnDef `cell`/`header` render function is read by the
// FlexRender template more than once (branch check + content). Those reads
// must not re-invoke the user's render function: it should run exactly once
// per cell per render pass.
module('Integration | FlexRender | invocation count', function (hooks) {
  setupRenderingTest(hooks)

  test('cell and header render functions run once per render pass', async (assert) => {
    const calls = { cell: 0, header: 0 }

    const columns: ColumnDef<typeof stockFeatures, Person, unknown>[] = [
      {
        id: 'firstName',
        accessorFn: (row: Person) => row.firstName,
        header: () => {
          calls.header++
          return 'First name'
        },
        cell: (info) => {
          calls.cell++
          return info.getValue<string>()
        },
      },
    ]

    class TableComponent extends Component {
      @tracked data: Array<Person> = [
        { id: '1', firstName: 'Alice' },
        { id: '2', firstName: 'Bob' },
      ]

      table = useTable(() => ({
        data: this.data,
        features: stockFeatures,
        columns,
        getRowId: (row: Person) => row.id,
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      get headers() {
        return this.table.getHeaderGroups()
      }

      <template>
        <table>
          <thead>
            {{#each this.headers as |headerGroup|}}
              <tr>
                {{#each headerGroup.headers as |header|}}
                  <th><FlexRenderHeader @header={{header}} /></th>
                {{/each}}
              </tr>
            {{/each}}
          </thead>
          <tbody>
            {{#each this.rows key='id' as |row|}}
              <tr data-test-row={{row.id}}>
                {{#each (getVisibleCells row) key='id' as |cell|}}
                  <td><FlexRenderCell @cell={{cell}} /></td>
                {{/each}}
              </tr>
            {{/each}}
          </tbody>
        </table>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert.dom('td').exists({ count: 2 })
    assert.dom('[data-test-row="1"] td').hasText('Alice')
    assert.strictEqual(
      calls.cell,
      2,
      'cell fn ran exactly once per cell on initial render',
    )
    assert.strictEqual(
      calls.header,
      1,
      'header fn ran exactly once on initial render',
    )
  })
})
