import { module, test } from 'qunit';
import { render, click } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import {
  useTable,
  FlexRenderCell,
  flexRenderComponent,
  tableFeatures,
  rowPaginationFeature,
  createPaginatedRowModel,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  rowSelectionFeature,
  createColumnHelper,
  type Row,
  type Cell,
  type FlexRenderableSignature,
} from '#src/index.ts';

// --- Shared fixture ---

interface Person {
  id: string;
  firstName: string;
  age: number;
}

// A composed feature set with the row models the reactivity tests exercise:
// pagination (row slicing), sorting, and row selection.
const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
  rowSelectionFeature,
});

const columnHelper = createColumnHelper<typeof features, Person>();

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    cell: (info) => info.getValue(),
  }),
]);

// Renders the underlying value; used to prove FlexRenderCell can swap between a
// primitive branch and a component branch reactively.
class AgeBadge extends Component<
  FlexRenderableSignature<typeof features, Person, number>
> {
  get value(): number {
    const ctx = this.args.ctx as { getValue: () => number };
    return ctx.getValue();
  }

  <template>
    <span data-test-age-badge>{{this.value}}</span>
  </template>
}

// A column whose cell renders a component for "senior" ages and a bare number
// otherwise, so a data change that crosses the threshold flips the branch.
const swapColumns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    cell: (info) =>
      info.getValue() >= 65 ? flexRenderComponent(AgeBadge) : info.getValue(),
  }),
]);

function makeData(...people: Array<Partial<Person>>): Array<Person> {
  return people.map((p, i) => ({
    id: p.id ?? String(i),
    firstName: p.firstName ?? `Person ${i}`,
    age: p.age ?? 30,
  }));
}

// TanStack Table v9 uses prototype-based methods that need `this` binding;
// Ember templates extract function references unbound, so wrap the call.
const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells();

module('Integration | reactivity', function (hooks) {
  setupRenderingTest(hooks);

  test('data changes recompute the row model reactively', async function (assert) {
    class TableComponent extends Component {
      @tracked data: Array<Person> = makeData(
        { firstName: 'Alice' },
        { firstName: 'Bob' },
      );

      table = useTable(() => ({ data: this.data, columns, features }));

      get rows() {
        return this.table.getRowModel().rows;
      }

      addRow = () => {
        this.data = [...this.data, ...makeData({ firstName: 'Carol' })];
      };

      <template>
        <button
          type="button"
          data-test-add
          {{on "click" this.addRow}}
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

    await render(<template><TableComponent /></template>);

    assert.dom('[data-test-row]').exists({ count: 2 }, 'initial rows rendered');

    await click('[data-test-add]');

    assert
      .dom('[data-test-row]')
      .exists({ count: 3 }, 'row model recomputed after data change');
    assert
      .dom('[data-test-row]:last-child')
      .containsText('Carol', 'new row content rendered');
  });

  test('internal state updates propagate to the DOM (pagination + selection)', async function (assert) {
    class TableComponent extends Component {
      @tracked data: Array<Person> = makeData(
        { firstName: 'A' },
        { firstName: 'B' },
        { firstName: 'C' },
        { firstName: 'D' },
      );

      table = useTable(() => ({
        data: this.data,
        columns,
        features,
        initialState: { pagination: { pageIndex: 0, pageSize: 2 } },
      }));

      get rows() {
        return this.table.getRowModel().rows;
      }

      get pageSize() {
        return this.table.store.state.pagination.pageSize;
      }

      get selectedCount() {
        return this.table.getSelectedRowModel().rows.length;
      }

      growPage = () => this.table.setPageSize(5);
      selectFirst = () =>
        this.table.getRowModel().rows[0]?.toggleSelected(true);

      <template>
        <button
          type="button"
          data-test-grow
          {{on "click" this.growPage}}
        >Grow</button>
        <button
          type="button"
          data-test-select
          {{on "click" this.selectFirst}}
        >Select</button>
        <span data-test-page-size>{{this.pageSize}}</span>
        <span data-test-selected>{{this.selectedCount}}</span>
        {{#each this.rows as |row|}}
          <tr data-test-row>
            {{#each (getAllCells row) as |cell|}}
              <td><FlexRenderCell @cell={{cell}} /></td>
            {{/each}}
          </tr>
        {{/each}}
      </template>
    }

    await render(<template><TableComponent /></template>);

    assert.dom('[data-test-page-size]').hasText('2', 'initial page size');
    assert.dom('[data-test-row]').exists({ count: 2 }, 'only one page of rows');

    await click('[data-test-grow]');

    assert
      .dom('[data-test-page-size]')
      .hasText('5', 'setPageSize propagated to state + DOM');
    assert
      .dom('[data-test-row]')
      .exists({ count: 4 }, 'larger page reveals all rows');

    assert
      .dom('[data-test-selected]')
      .hasText('0', 'nothing selected initially');

    await click('[data-test-select]');

    assert
      .dom('[data-test-selected]')
      .hasText('1', 'row selection state propagated to the derived atom + DOM');
  });

  test('unrelated state slices are tracked independently', async function (assert) {
    class TableComponent extends Component {
      @tracked data: Array<Person> = makeData(
        { firstName: 'A' },
        { firstName: 'B' },
      );

      table = useTable(() => {
        assert.step('setup table');

        return {
          data: this.data,
          columns,
          features,
          initialState: { pagination: { pageIndex: 0, pageSize: 2 } },
        };
      });

      get pageSize() {
        assert.step('assess pageSize');
        return this.table.store.state.pagination.pageSize;
      }

      get sortState() {
        assert.step('assess sortState');
        return JSON.stringify(this.table.store.state.sorting ?? []);
      }

      growPage = () => this.table.setPageSize(10);

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

    await render(<template><TableComponent /></template>);

    assert.verifySteps(
      ['setup table', 'assess pageSize', 'assess sortState'],
      'all initial state steps have been recorded',
    );

    assert.dom('[data-test-page-size]').hasText('2');
    assert.dom('[data-test-sort]').hasText('[]', 'sorting slice starts empty');

    await click('[data-test-grow]');

    // Currently failing! States are not sliced independently as expected
    assert.verifySteps(
      ['assess pageSize'],
      'no state assessments have occurred yet',
    );

    assert
      .dom('[data-test-page-size]')
      .hasText('10', 'pagination slice updated');
    assert
      .dom('[data-test-sort]')
      .hasText(
        '[]',
        'unrelated sorting slice unaffected by a pagination change and does not re-setup table',
      );
  });

  test('flex-render reacts to content and swaps between primitive and component', async function (assert) {
    class TableComponent extends Component {
      @tracked data: Array<Person> = makeData({ firstName: 'Alice', age: 30 });

      table = useTable(() => ({
        data: this.data,
        columns: swapColumns,
        features,
      }));

      get rows() {
        return this.table.getRowModel().rows;
      }

      age = () => {
        this.data = makeData({ firstName: 'Alice', age: 70 });
      };

      <template>
        <button type="button" data-test-age {{on "click" this.age}}>Age</button>
        {{#each this.rows as |row|}}
          <tr data-test-row>
            {{#each (getAllCells row) as |cell|}}
              <td data-test-cell><FlexRenderCell @cell={{cell}} /></td>
            {{/each}}
          </tr>
        {{/each}}
      </template>
    }

    await render(<template><TableComponent /></template>);

    assert
      .dom('[data-test-age-badge]')
      .doesNotExist('young age renders the primitive branch');
    assert
      .dom('[data-test-row]')
      .containsText('30', 'primitive cell shows the value');

    await click('[data-test-age]');

    assert
      .dom('[data-test-age-badge]')
      .exists('crossing the threshold swaps to the component branch');
    assert
      .dom('[data-test-age-badge]')
      .hasText('70', 'component receives the latest cell context value');
  });
});
