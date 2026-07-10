import { module, test } from 'qunit'
import { render, click } from '@ember/test-helpers'
import { setupRenderingTest } from 'ember-qunit'
import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'

import {
  useTable,
  FlexRenderCell,
  tableFeatures,
  rowPaginationFeature,
  createPaginatedRowModel,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  createColumnHelper,
  createAtom,
  type Row,
  type Cell,
  type SortingState,
  type PaginationState,
} from '#src/index.ts'

// --- Shared fixture ---

interface Person {
  id: string
  firstName: string
  age: number
}

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    cell: (info) => info.getValue(),
  }),
])

function makeData(...people: Array<Partial<Person>>): Array<Person> {
  return people.map((p, i) => ({
    id: p.id ?? String(i),
    firstName: p.firstName ?? `Person ${i}`,
    age: p.age ?? 30,
  }))
}

// Insertion order intentionally differs from alphabetical order so a sorting
// change visibly reorders rows.
const UNSORTED = ['Dave', 'Alice', 'Carl', 'Bea']

// TanStack Table v9 uses prototype-based methods that need `this` binding;
// Ember templates extract function references unbound, so wrap the call.
const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells()

module('Integration | external state (controlled)', function (hooks) {
  setupRenderingTest(hooks)

  test('controlled state drives the table', async function (assert) {
    class TableComponent extends Component {
      @tracked data: Array<Person> = makeData(
        ...UNSORTED.map((firstName) => ({ firstName })),
      )
      @tracked sorting: SortingState = []
      @tracked pagination: PaginationState = { pageIndex: 0, pageSize: 2 }

      table = useTable(() => ({
        data: this.data,
        columns,
        features,
        state: {
          sorting: this.sorting,
          pagination: this.pagination,
        },
        onSortingChange: (updater) => {
          this.sorting =
            typeof updater === 'function' ? updater(this.sorting) : updater
        },
        onPaginationChange: (updater) => {
          this.pagination =
            typeof updater === 'function' ? updater(this.pagination) : updater
        },
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      get pageSize() {
        return this.table.store.state.pagination.pageSize
      }

      get sortState() {
        return JSON.stringify(this.table.store.state.sorting ?? [])
      }

      sortByName = () =>
        this.table.setSorting([{ id: 'firstName', desc: false }])

      <template>
        <button
          type="button"
          data-test-sort-by-name
          {{on "click" this.sortByName}}
        >Sort</button>
        <span data-test-page-size>{{this.pageSize}}</span>
        <span data-test-sort>{{this.sortState}}</span>
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

    assert
      .dom('[data-test-page-size]')
      .hasText('2', 'initial page size comes from the controlled slice')
    assert.dom('[data-test-row]').exists({ count: 2 })
    assert
      .dom('[data-test-row]:first-of-type')
      .containsText('Dave', 'rows start in insertion order')

    await click('[data-test-sort-by-name]')

    assert
      .dom('[data-test-sort]')
      .hasText(
        '[{"id":"firstName","desc":false}]',
        'onSortingChange wrote back to the controlled slice and the table reads it',
      )
    assert
      .dom('[data-test-row]:first-of-type')
      .containsText('Alice', 'row model re-sorted from the controlled slice')
    assert
      .dom('[data-test-page-size]')
      .hasText('2', 'unrelated controlled slice is untouched')
  })

  test('externally mutating controlled state updates the table', async function (assert) {
    class TableComponent extends Component {
      @tracked data: Array<Person> = makeData(
        ...UNSORTED.map((firstName) => ({ firstName })),
      )
      @tracked pagination: PaginationState = { pageIndex: 0, pageSize: 2 }

      table = useTable(() => ({
        data: this.data,
        columns,
        features,
        state: { pagination: this.pagination },
        onPaginationChange: (updater) => {
          this.pagination =
            typeof updater === 'function' ? updater(this.pagination) : updater
        },
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      get pageSize() {
        return this.table.store.state.pagination.pageSize
      }

      // Mutates the tracked slice directly, without going through any table
      // API — the pull-based adapter must pick it up on the next read.
      growExternally = () => {
        this.pagination = { pageIndex: 0, pageSize: 3 }
      }

      <template>
        <button
          type="button"
          data-test-grow
          {{on "click" this.growExternally}}
        >Grow</button>
        <span data-test-page-size>{{this.pageSize}}</span>
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

    assert.dom('[data-test-row]').exists({ count: 2 })

    await click('[data-test-grow]')

    assert
      .dom('[data-test-page-size]')
      .hasText('3', 'store reflects the externally mutated slice')
    assert
      .dom('[data-test-row]')
      .exists({ count: 3 }, 'row model recomputed from the external mutation')
  })

  test('controlled slice read wins over internal writes', async function (assert) {
    class TableComponent extends Component {
      @tracked data: Array<Person> = makeData(
        ...UNSORTED.map((firstName) => ({ firstName })),
      )
      @tracked sorting: SortingState = []

      table = useTable(() => ({
        data: this.data,
        columns,
        features,
        state: { sorting: this.sorting },
        // Classic controlled-component semantics: the handler observes the
        // request but intentionally does not apply it.
        onSortingChange: () => {
          assert.step('sort change requested')
        },
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      get sortState() {
        return JSON.stringify(this.table.store.state.sorting ?? [])
      }

      sortByName = () =>
        this.table.setSorting([{ id: 'firstName', desc: false }])

      <template>
        <button
          type="button"
          data-test-sort-by-name
          {{on "click" this.sortByName}}
        >Sort</button>
        <span data-test-sort>{{this.sortState}}</span>
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

    await click('[data-test-sort-by-name]')

    assert.verifySteps(
      ['sort change requested'],
      'the change handler was invoked',
    )
    assert
      .dom('[data-test-sort]')
      .hasText('[]', 'table still reads the unchanged controlled value')
    assert
      .dom('[data-test-row]:first-of-type')
      .containsText('Dave', 'rows stay in insertion order')
  })

  test('internal slice writes do not re-assess controlled slices', async function (assert) {
    // Sorting is controlled; pagination is internal (initialState only). The
    // reverse direction — asserting that a controlled-slice change leaves
    // internal-slice getters alone — does NOT hold today: every controlled
    // slice flows through the single getOptions() computed, so changing one
    // tracked option dirties all option-derived atoms (tag-based tracking has
    // no value-equality cutoff). Only this direction is guaranteed.
    class TableComponent extends Component {
      @tracked data: Array<Person> = makeData(
        ...UNSORTED.map((firstName) => ({ firstName })),
      )
      @tracked sorting: SortingState = []

      table = useTable(() => {
        assert.step('setup table')

        return {
          data: this.data,
          columns,
          features,
          initialState: { pagination: { pageIndex: 0, pageSize: 2 } },
          state: { sorting: this.sorting },
          onSortingChange: (updater) => {
            this.sorting =
              typeof updater === 'function' ? updater(this.sorting) : updater
          },
        }
      })

      get pageSize() {
        assert.step('assess pageSize')
        return this.table.store.state.pagination.pageSize
      }

      get sortState() {
        assert.step('assess sortState')
        return JSON.stringify(this.table.store.state.sorting ?? [])
      }

      growPage = () => this.table.setPageSize(10)

      <template>
        <button
          type="button"
          data-test-grow
          {{on "click" this.growPage}}
        >Grow</button>
        <span data-test-page-size>{{this.pageSize}}</span>
        <span data-test-sort>{{this.sortState}}</span>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert.verifySteps(
      ['setup table', 'assess pageSize', 'assess sortState'],
      'all initial steps recorded',
    )

    await click('[data-test-grow]')

    assert.verifySteps(
      ['assess pageSize'],
      'internal pagination write re-assesses only the pagination getter',
    )
    assert.dom('[data-test-page-size]').hasText('10')
    assert.dom('[data-test-sort]').hasText('[]')
  })
})

module('Integration | external atoms', function (hooks) {
  setupRenderingTest(hooks)

  test('table reads state from external atoms', async function (assert) {
    const paginationAtom = createAtom<PaginationState>({
      pageIndex: 0,
      pageSize: 2,
    })

    class TableComponent extends Component {
      @tracked data: Array<Person> = makeData(
        ...UNSORTED.map((firstName) => ({ firstName })),
      )

      table = useTable(() => ({
        data: this.data,
        columns,
        features,
        // The atom must win over initialState for the same slice.
        initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
        atoms: { pagination: paginationAtom },
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      get pageSize() {
        return this.table.store.state.pagination.pageSize
      }

      <template>
        <span data-test-page-size>{{this.pageSize}}</span>
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

    assert
      .dom('[data-test-page-size]')
      .hasText('2', 'page size comes from the atom, not initialState')
    assert
      .dom('[data-test-row]')
      .exists({ count: 2 }, 'row model paginates from the atom value')
  })

  test('external atom writes update the table', async function (assert) {
    const paginationAtom = createAtom<PaginationState>({
      pageIndex: 0,
      pageSize: 2,
    })

    class TableComponent extends Component {
      @tracked data: Array<Person> = makeData(
        ...UNSORTED.map((firstName) => ({ firstName })),
      )

      table = useTable(() => ({
        data: this.data,
        columns,
        features,
        atoms: { pagination: paginationAtom },
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      get pageSize() {
        return this.table.store.state.pagination.pageSize
      }

      growViaAtom = () => {
        paginationAtom.set({ pageIndex: 0, pageSize: 4 })
      }

      <template>
        <button
          type="button"
          data-test-grow
          {{on "click" this.growViaAtom}}
        >Grow</button>
        <span data-test-page-size>{{this.pageSize}}</span>
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

    assert.dom('[data-test-row]').exists({ count: 2 })

    await click('[data-test-grow]')

    assert
      .dom('[data-test-page-size]')
      .hasText('4', 'atom write propagated into the table state')
    assert
      .dom('[data-test-row]')
      .exists({ count: 4 }, 'row model recomputed from the atom write')
  })

  test('table writes route back to the external atom', async function (assert) {
    const paginationAtom = createAtom<PaginationState>({
      pageIndex: 0,
      pageSize: 2,
    })

    class TableComponent extends Component {
      @tracked data: Array<Person> = makeData(
        ...UNSORTED.map((firstName) => ({ firstName })),
      )

      table = useTable(() => ({
        data: this.data,
        columns,
        features,
        atoms: { pagination: paginationAtom },
      }))

      get rows() {
        return this.table.getRowModel().rows
      }

      get pageSize() {
        return this.table.store.state.pagination.pageSize
      }
      // The atom comes from ember-table's createAtom (a @tracked Signal), so
      // this raw read is tag-tracked and reactive on its own.
      get atomPageSize() {
        return paginationAtom.get().pageSize
      }

      growPage = () => this.table.setPageSize(4)

      <template>
        <button
          type="button"
          data-test-grow
          {{on "click" this.growPage}}
        >Grow</button>
        <span data-test-page-size>{{this.pageSize}}</span>
        <span data-test-atom-page-size>{{this.atomPageSize}}</span>
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

    await click('[data-test-grow]')

    assert
      .dom('[data-test-page-size]')
      .hasText('4', 'table reflects its own write')
    assert.strictEqual(
      paginationAtom.get().pageSize,
      4,
      'the external atom received the table write',
    )
    assert
      .dom('[data-test-atom-page-size]')
      .hasText(
        '4',
        'raw reads of an ember createAtom are reactive in the template',
      )
  })

  test('atom-backed slices are tracked independently', async function (assert) {
    const paginationAtom = createAtom<PaginationState>({
      pageIndex: 0,
      pageSize: 2,
    })
    const sortingAtom = createAtom<SortingState>([])

    class TableComponent extends Component {
      @tracked data: Array<Person> = makeData(
        ...UNSORTED.map((firstName) => ({ firstName })),
      )

      table = useTable(() => {
        assert.step('setup table')

        return {
          data: this.data,
          columns,
          features,
          atoms: { pagination: paginationAtom, sorting: sortingAtom },
        }
      })

      get pageSize() {
        assert.step('assess pageSize')
        return this.table.store.state.pagination.pageSize
      }

      get sortState() {
        assert.step('assess sortState')
        return JSON.stringify(this.table.store.state.sorting ?? [])
      }

      growViaAtom = () => {
        paginationAtom.set({ pageIndex: 0, pageSize: 4 })
      }

      <template>
        <button
          type="button"
          data-test-grow
          {{on "click" this.growViaAtom}}
        >Grow</button>
        <span data-test-page-size>{{this.pageSize}}</span>
        <span data-test-sort>{{this.sortState}}</span>
      </template>
    }

    await render(<template><TableComponent /></template>)

    assert.verifySteps(
      ['setup table', 'assess pageSize', 'assess sortState'],
      'all initial steps recorded',
    )

    await click('[data-test-grow]')

    assert.verifySteps(
      ['assess pageSize'],
      'a pagination atom write re-assesses only the pagination getter',
    )
    assert.dom('[data-test-page-size]').hasText('4')
    assert.dom('[data-test-sort]').hasText('[]')
  })
})
