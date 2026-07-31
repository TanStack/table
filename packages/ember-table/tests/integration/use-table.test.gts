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
  type StockFeatures,
  type Table,
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

  test('option atoms return a valid subscription', function (assert) {
    const table = useTable(() => ({
      data: makeData(1),
      features: stockFeatures,
      columns: [],
    }))

    const subscription = table.optionAtoms.data.subscribe(() => {})

    assert.strictEqual(
      typeof subscription.unsubscribe,
      'function',
      'callers can always tear down the returned subscription',
    )
    subscription.unsubscribe()
  })

  test('can initialize with basic no columns or data', async (assert) => {
    class TableComponent extends Component {
      @tracked data = []

      table = useTable(() => ({
        data: this.data,
        features: stockFeatures,
        columns: [],
      }))

      // Templates must not read `this.table` directly while `useTable` is
      // initialized inline: glint/TS then reports the `useTable` call itself
      // as non-callable (inference cycle). Hop through a typed getter.
      get tableRef(): Table<StockFeatures, never> {
        return this.table
      }

      <template>
        {{! @glint-expect-error Incorrect type for column because no columns are defined }}
        {{#each this.tableRef.columns as |column index|}}
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

  test('keeps the central options proxy stable and live', async (assert) => {
    class TableComponent extends Component {
      @tracked data = makeData(2)

      table = useTable(() => ({
        data: this.data,
        features: stockFeatures,
        columns: [],
      }))

      savedOptions = this.table.options

      get hasSameOptionsReference() {
        return this.savedOptions === this.table.options
      }

      get savedOptionsDataLength() {
        return this.savedOptions.data.length
      }

      get optionAtomDataLength() {
        return this.table.optionAtoms.data.get().length
      }

      shrink = () => {
        this.data = makeData(1)
      }

      <template>
        <output data-test-options-identity>
          {{if this.hasSameOptionsReference 'same' 'different'}}
        </output>
        <output data-test-saved-options>
          {{this.savedOptionsDataLength}}
        </output>
        <output data-test-option-atom>
          {{this.optionAtomDataLength}}
        </output>
        <button type='button' data-test-shrink {{on 'click' this.shrink}}>
          shrink
        </button>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert
      .dom('[data-test-options-identity]')
      .hasText('same', 'the adapter leaves core’s stable options proxy intact')
    assert
      .dom('[data-test-saved-options]')
      .hasText('2', 'a saved options reference reads the initial value')
    assert
      .dom('[data-test-option-atom]')
      .hasText('2', 'the option atom reads the initial value')

    await click('[data-test-shrink]')

    assert
      .dom('[data-test-options-identity]')
      .hasText('same', 'the options proxy identity stays stable after updates')
    assert
      .dom('[data-test-saved-options]')
      .hasText('1', 'the saved options reference remains live')
    assert
      .dom('[data-test-option-atom]')
      .hasText('1', 'the option atom remains live')
  })

  test('imperative option writes override tracked adapter options', async (assert) => {
    class TableComponent extends Component {
      @tracked data = makeData(3)

      table = useTable(() => ({
        data: this.data,
        features: stockFeatures,
        columns: [],
      }))

      get optionsDataLength() {
        return this.table.options.data.length
      }

      get optionAtomDataLength() {
        return this.table.optionAtoms.data.get().length
      }

      setThroughApi = () => {
        this.table.setOptions((previous) => ({
          ...previous,
          data: makeData(2),
        }))
        this.data = makeData(5)
      }

      setThroughAtom = () => {
        this.table.optionAtoms.data.set(makeData(1))
        this.data = makeData(6)
      }

      <template>
        <output data-test-options-data>{{this.optionsDataLength}}</output>
        <output data-test-option-atom-data>
          {{this.optionAtomDataLength}}
        </output>
        <button
          type='button'
          data-test-set-api
          {{on 'click' this.setThroughApi}}
        >
          set through API
        </button>
        <button
          type='button'
          data-test-set-atom
          {{on 'click' this.setThroughAtom}}
        >
          set through atom
        </button>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert.dom('[data-test-options-data]').hasText('3')
    assert.dom('[data-test-option-atom-data]').hasText('3')

    await click('[data-test-set-api]')

    assert
      .dom('[data-test-options-data]')
      .hasText('2', 'setOptions wins over a later tracked option change')
    assert.dom('[data-test-option-atom-data]').hasText('2')

    await click('[data-test-set-atom]')

    assert
      .dom('[data-test-options-data]')
      .hasText('1', 'assignment through the option atom remains visible')
    assert.dom('[data-test-option-atom-data]').hasText('1')
  })

  test('setOptions can add option keys after construction', async (assert) => {
    class TableComponent extends Component {
      @tracked refresh = 0

      table = useTable(() => ({
        data: makeData(1),
        features: stockFeatures,
        columns: [],
      }))

      get optionValue() {
        void this.refresh
        return String(this.table.options.debugRows)
      }

      get optionAtomValue() {
        void this.refresh
        return String(this.table.optionAtoms.debugRows?.get())
      }

      get hasOption() {
        void this.refresh
        return String('debugRows' in this.table.options)
      }

      addOption = () => {
        this.table.setOptions((previous) => ({
          ...previous,
          debugRows: true,
        }))
        // The key did not exist when the template first rendered, so there was
        // no option atom to track yet. The host rerender makes the newly
        // created atom visible.
        this.refresh++
      }

      <template>
        <output data-test-option-value>{{this.optionValue}}</output>
        <output data-test-option-atom-value>{{this.optionAtomValue}}</output>
        <output data-test-has-option>{{this.hasOption}}</output>
        <button
          type='button'
          data-test-add-option
          {{on 'click' this.addOption}}
        >
          add option
        </button>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert.dom('[data-test-option-value]').hasText('undefined')
    assert.dom('[data-test-option-atom-value]').hasText('undefined')
    assert.dom('[data-test-has-option]').hasText('false')

    await click('[data-test-add-option]')

    assert
      .dom('[data-test-option-value]')
      .hasText('true', 'the live options proxy sees the newly supplied key')
    assert
      .dom('[data-test-option-atom-value]')
      .hasText('true', 'setOptions creates the new option atom')
    assert
      .dom('[data-test-has-option]')
      .hasText('true', 'reflection sees the newly supplied key')
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

      // Typed getter hop for the same glint/TS inference cycle as above.
      get tableRef(): Table<StockFeatures, Person> {
        return this.table
      }

      <template>
        <div data-test-has-options>{{hasKey this.tableRef 'options'}}</div>
        <div data-test-has-getrowmodel>{{hasKey
            this.tableRef
            'getRowModel'
          }}</div>
        <div data-test-keys-getrowmodel>{{keysInclude
            this.tableRef
            'getRowModel'
          }}</div>
        <div data-test-keys-options>{{keysInclude
            this.tableRef
            'options'
          }}</div>

        <div data-test-has-notfound>{{hasKey this.tableRef 'notFound'}}</div>
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
        const table = this.table
        table.setPageSize(3)
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
