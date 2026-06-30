import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { pageTitle } from 'ember-page-title';
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  FlexRenderFooter,
  flexRenderComponent,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
} from '@tanstack/ember-table';

// --- Data types and generation ---

interface Person {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
}

const FIRST_NAMES = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank',
  'Grace', 'Hank', 'Ivy', 'Jack', 'Karen', 'Leo',
  'Mona', 'Nate', 'Olivia', 'Paul', 'Quinn', 'Rita',
  'Sam', 'Tina',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia',
  'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez',
  'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore',
  'Jackson', 'Martin',
];

const STATUSES = ['relationship', 'complicated', 'single'] as const;

function makeData(count: number): Array<Person> {
  return Array.from({ length: count }, (_, i) => ({
    firstName: FIRST_NAMES[i % FIRST_NAMES.length]!,
    lastName: LAST_NAMES[(i * 3) % LAST_NAMES.length]!,
    age: 20 + ((i * 7) % 30),
    visits: (i * 37) % 1000,
    status: STATUSES[i % STATUSES.length]!,
    progress: (i * 13) % 100,
  }));
}

// --- Custom cell component example ---

class StatusBadge extends Component<{
  Args: {
    ctx: unknown;
    args: unknown;
  };
}> {
  get value(): string {
    const ctx = this.args.ctx as { getValue: () => string };
    return ctx.getValue();
  }

  get className(): string {
    const value = this.value;
    if (value === 'relationship') return 'status-relationship';
    if (value === 'complicated') return 'status-complicated';
    return 'status-single';
  }

  <template>
    <span class={{this.className}}>{{this.value}}</span>
  </template>
}

// --- Table setup ---

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
});

const columnHelper = createColumnHelper<typeof features, Person>();

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: () => flexRenderComponent(StatusBadge),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (info) => info.column.id,
  }),
]);

// --- Template helpers ---
// TanStack Table v9 uses prototype-based methods that require `this` binding.
// Ember templates extract function references without binding, so we provide
// helpers that call methods on the correct object.

const getCanSort = (column: Column<typeof features, Person> ): boolean => column.getCanSort();
const getAllCells = (row: Row<typeof features, Person>): Array<Cell<typeof features, Person>> => row.getAllCells();
const lookup = (obj: Record<string, string>, key: string): string => obj[key] ?? '';

const toggleSort = (column: Column<typeof features, Person>) => {
  return (event: Event) => {
    column.getToggleSortingHandler()?.(event);
  };
};

// --- Component ---

class BasicAppTable extends Component {
  @tracked data: Array<Person> = makeData(20);

  tableManager = useTable(this, () => ({
    features,
    columns,
    data: this.data,
  }));

  get table() {
    return this.tableManager.table;
  }

  get headerGroups() {
    return this.table.getHeaderGroups();
  }

  get rows() {
    return this.table.getRowModel().rows;
  }

  get footerGroups() {
    return this.table.getFooterGroups();
  }

  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2);
  }

  get sortIndicators(): Record<string, string> {
    const indicators: Record<string, string> = {};
    for (const hg of this.table.getHeaderGroups()) {
      for (const h of hg.headers) {
        const sorted = h.column.getIsSorted();
        indicators[h.column.id] = sorted === 'asc' ? ' ▲' : sorted === 'desc' ? ' ▼' : '';
      }
    }
    return indicators;
  }

  regenerateData = () => {
    this.data = makeData(20);
  };

  stressTest = () => {
    this.data = makeData(1_000);
  };

  <template>
    <div class="demo-root">
      <div>
        <button {{on "click" this.regenerateData}}>Regenerate Data</button>
        <button {{on "click" this.stressTest}}>Stress Test (1k rows)</button>
      </div>
      <table>
        <thead>
          {{#each this.headerGroups as |headerGroup|}}
            <tr>
              {{#each headerGroup.headers as |header|}}
                <th colspan={{header.colSpan}}>
                  {{#unless header.isPlaceholder}}
                    <div
                      {{on "click" (toggleSort header.column)}}
                      style="cursor: {{if (getCanSort header.column) "pointer" "not-allowed"}}; user-select: none"
                    >
                      <FlexRenderHeader @header={{header}} />{{lookup this.sortIndicators header.column.id}}
                    </div>
                  {{/unless}}
                </th>
              {{/each}}
            </tr>
          {{/each}}
        </thead>
        <tbody>
          {{#each this.rows as |row|}}
            <tr>
              {{#each (getAllCells row) as |cell|}}
                <td><FlexRenderCell @cell={{cell}} /></td>
              {{/each}}
            </tr>
          {{/each}}
        </tbody>
        <tfoot>
          {{#each this.footerGroups as |footerGroup|}}
            <tr>
              {{#each footerGroup.headers as |header|}}
                <th>
                  {{#unless header.isPlaceholder}}
                    <FlexRenderFooter @footer={{header}} />
                  {{/unless}}
                </th>
              {{/each}}
            </tr>
          {{/each}}
        </tfoot>
      </table>
      <pre>{{this.tableState}}</pre>
    </div>
  </template>
}

<template>
  {{pageTitle "Ember Table Demo"}}
  <BasicAppTable />
</template>
