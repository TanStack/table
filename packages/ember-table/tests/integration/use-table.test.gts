import { module, test } from 'qunit'
import { render, click } from '@ember/test-helpers'
import { setupRenderingTest } from 'ember-qunit'
import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import { useTable } from '#src/index.ts'
import {
  stockFeatures,
  tableFeatures,
  rowPaginationFeature,
  createPaginatedRowModel,
  createColumnHelper,
  type PaginationState,
} from '@tanstack/table-core'

type Person = { id: string; firstName: string; age: number }

function makeData(count: number): Array<Person> {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i),
    firstName: `First ${i}`,
    age: 20 + i,
  }))
}

// Templates can't call bound table methods with `this` context, so expose the
// structural checks (Angular's `in` / `Object.keys` tests) as plain helpers.
const hasKey = (obj: object, key: string): boolean => key in obj
const keysInclude = (obj: object, key: string): boolean =>
  Object.keys(obj).includes(key)

module('Integration | useTable', function (hooks) {
  setupRenderingTest(hooks)

  test('can initialize with basic no columns or data', async (assert) => {
    class TableComponent extends Component {
      @tracked data = []

      table = useTable(() => ({
        data: this.data,
        features: stockFeatures,
        columns: [],
      }))

      <template>
        {{! @glint-expect-error Incorrect type for column because no columns are defined }}
        {{#each this.table.columns as |column index|}}
          <p data-test-column={{index}}>{{column}}</p>
        {{/each}}

        <p data-test-render-complete>Render Complete</p>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert
      .dom('[data-test-render-complete]')
      .exists('Rendering should complete without error')
    assert
      .dom('[data-test-column]')
      .doesNotExist('No stale or unregistered columns are rendered')
  })

  // Ember analog of angular's "should support required signal inputs": the
  // table's row model reacts to the tracked `data` the thunk reads.
  test('row model reacts to tracked data changes', async (assert) => {
    const columnHelper = createColumnHelper<typeof stockFeatures, Person>()
    const columns = columnHelper.columns([
      columnHelper.accessor('firstName', { cell: (info) => info.getValue() }),
      columnHelper.accessor('age', { cell: (info) => info.getValue() }),
    ])

    class TableComponent extends Component {
      @tracked data = makeData(3)

      table = useTable(() => ({
        data: this.data,
        features: stockFeatures,
        columns,
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      shrink = () => {
        this.data = makeData(1)
      }

      <template>
        {{#each this.rows as |row|}}
          <div data-test-row>{{row.id}}</div>
        {{/each}}
        <button
          type='button'
          data-test-shrink
          {{on 'click' this.shrink}}
        >shrink</button>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert
      .dom('[data-test-row]')
      .exists({ count: 3 }, 'renders a row per data item')

    await click('[data-test-shrink]')

    assert
      .dom('[data-test-row]')
      .exists({ count: 1 }, 'row model re-renders when tracked data changes')
  })

  // Ember analog of angular's "in" / "Object.keys" structural tests, expressed
  // as rendered output since ember's table is a plain object (not a Proxy).
  test('exposes expected table structure', async (assert) => {
    class TableComponent extends Component {
      @tracked data: Array<Person> = makeData(1)

      table = useTable(() => ({
        data: this.data,
        features: stockFeatures,
        columns: [],
      }))

      <template>
        <div data-test-has-options>{{hasKey this.table 'options'}}</div>
        <div data-test-has-getrowmodel>{{hasKey this.table 'getRowModel'}}</div>
        <div data-test-keys-getrowmodel>{{keysInclude
            this.table
            'getRowModel'
          }}</div>
        <div data-test-keys-options>{{keysInclude this.table 'options'}}</div>

        <div data-test-has-notfound>{{hasKey this.table 'notFound'}}</div>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert
      .dom('[data-test-has-options]')
      .hasText('true', 'table has an "options" property')
    assert
      .dom('[data-test-has-getrowmodel]')
      .hasText('true', 'table has a "getRowModel" method')
    assert
      .dom('[data-test-keys-getrowmodel]')
      .hasText('true', 'Object.keys includes getRowModel')
    assert
      .dom('[data-test-keys-options]')
      .hasText('true', 'Object.keys includes options')

    assert
      .dom('[data-test-has-notfound]')
      .hasText('false', 'unknown properties are absent')
  })

  // Ember analog of angular's "Row model is reactive": paginated row model
  // reflects controlled pagination state while the core row model stays full.
  test('paginated row model reacts to pagination state', async (assert) => {
    const features = tableFeatures({
      rowPaginationFeature,
      paginatedRowModel: createPaginatedRowModel(),
    })
    const columnHelper = createColumnHelper<typeof features, Person>()
    const columns = columnHelper.columns([
      columnHelper.accessor('firstName', { cell: (info) => info.getValue() }),
      columnHelper.accessor('age', { cell: (info) => info.getValue() }),
    ])

    class TableComponent extends Component {
      @tracked data = makeData(10)
      @tracked pagination: PaginationState = { pageIndex: 0, pageSize: 5 }

      table = useTable(() => ({
        features,
        columns,
        data: this.data,
        state: {
          pagination: this.pagination,
        },
        onPaginationChange: (updater) => {
          this.pagination =
            typeof updater === 'function' ? updater(this.pagination) : updater
        },
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      get coreRowCount() {
        return this.table.getCoreRowModel().rows.length
      }

      shrinkPage = () => {
        this.table.setPageSize(3)
      }

      <template>
        {{#each this.rows as |row|}}
          <div data-test-row>{{row.id}}</div>
        {{/each}}
        <div data-test-core-count>{{this.coreRowCount}}</div>
        <button
          type='button'
          data-test-shrink-page
          {{on 'click' this.shrinkPage}}
        >shrink</button>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert
      .dom('[data-test-row]')
      .exists({ count: 5 }, 'renders one page of rows')
    assert
      .dom('[data-test-core-count]')
      .hasText('10', 'core row model holds every row')

    await click('[data-test-shrink-page]')

    assert
      .dom('[data-test-row]')
      .exists(
        { count: 3 },
        'paginated row model re-renders when page size changes',
      )
    assert
      .dom('[data-test-core-count]')
      .hasText('10', 'core row model is unaffected by pagination')
  })
})
