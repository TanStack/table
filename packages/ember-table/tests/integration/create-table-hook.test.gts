import { module, test } from 'qunit'
import { render, click } from '@ember/test-helpers'
import { setupRenderingTest } from 'ember-qunit'
import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  createTableHook,
  FlexRenderCell,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  type Row,
  type Cell,
} from '#src/index.ts'

type Person = { id: string; firstName: string; age: number }

function makeData(...people: Array<Partial<Person>>): Array<Person> {
  return people.map((p, i) => ({
    id: p.id ?? String(i),
    firstName: p.firstName ?? `Person ${i}`,
    age: p.age ?? 30,
  }))
}

// Define the shared feature set and default options once.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const { appFeatures, createAppColumnHelper, createAppTable } = createTableHook({
  features,
  // A shared default option that every app table should inherit.
  getRowId: (row: Person) => row.id,
})

const columnHelper = createAppColumnHelper<Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { cell: (info) => info.getValue() }),
  columnHelper.accessor('age', { cell: (info) => info.getValue() }),
])

// TanStack Table v9 uses prototype-based methods that need `this` binding;
// ember templates extract function references unbound, so wrap the call.
const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells()

module('Integration | createTableHook', function (hooks) {
  setupRenderingTest(hooks)

  test('appFeatures returns the shared feature set', function (assert) {
    assert.strictEqual(
      appFeatures,
      features,
      'the hook exposes the features it was created with',
    )
  })

  test('createAppTable builds a working, reactive table', async function (assert) {
    class TableComponent extends Component {
      @tracked data: Array<Person> = makeData(
        { firstName: 'Alice' },
        { firstName: 'Bob' },
      )

      // No `features` here: the hook supplies them.
      table = createAppTable<Person>(() => ({
        columns,
        data: this.data,
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      // The shared default `getRowId` should be applied to this table.
      get firstRowId() {
        return this.rows[0]?.id
      }

      addRow = () => {
        this.data = [
          ...this.data,
          ...makeData({ id: 'carol', firstName: 'Carol' }),
        ]
      }

      <template>
        <span data-test-first-row-id>{{this.firstRowId}}</span>
        <button
          type='button'
          data-test-add
          {{on 'click' this.addRow}}
        >Add</button>
        {{#each this.rows as |row|}}
          <tr data-test-row>
            {{#each (getAllCells row) as |cell|}}
              <td><FlexRenderCell @cell={{cell}} /></td>
            {{/each}}
          </tr>
        {{/each}}
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert.dom('[data-test-row]').exists({ count: 2 }, 'initial rows rendered')
    assert
      .dom('[data-test-first-row-id]')
      .hasText('0', 'shared default getRowId from the hook is applied')

    await click('[data-test-add]')

    assert
      .dom('[data-test-row]')
      .exists({ count: 3 }, 'row model recomputes when tracked data changes')
    assert
      .dom('[data-test-row]:last-child')
      .containsText('Carol', 'new row content rendered')
  })
})
