import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  tableFeatures,
  createColumnHelper,
  type Row,
  type Cell,
} from '#src/index.ts';
import { makeData, type Person } from '../utils/make-data';

const features = tableFeatures({});

const columnHelper = createColumnHelper<typeof features, Person>();

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'drag-handle',
    header: 'Move',
    cell: () => '☰',
  }),
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
]);

// --- Template helpers (v9 methods need explicit `this`) ---

const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells();

export default class RowDndTable extends Component {
  @tracked data: Array<Person> = makeData(15);

  // Row index of the item currently being dragged.
  draggedIndex: number | null = null;

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    // Person has no natural id, so use the stable row index.
    getRowId: (_row: Person, index: number) => String(index),
  }));

  get headerGroups() {
    return this.table.getHeaderGroups();
  }

  get rows() {
    return this.table.getRowModel().rows;
  }

  get sortedIds() {
    return JSON.stringify(
      this.data.map((row) => `${row.firstName} ${row.lastName}`),
      null,
      2,
    );
  }

  dragStart = (index: number) => (event: DragEvent) => {
    this.draggedIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      // Firefox requires data to be set for the drag to start.
      event.dataTransfer.setData('text/plain', String(index));
    }
  };

  handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  };

  drop = (targetIndex: number) => (event: DragEvent) => {
    event.preventDefault();
    const from = this.draggedIndex;
    this.draggedIndex = null;
    if (from === null || from === targetIndex) {
      return;
    }
    const next = [...this.data];
    const [moved] = next.splice(from, 1);
    if (moved) {
      next.splice(targetIndex, 0, moved);
    }
    this.data = next;
  };

  handleDragEnd = () => {
    this.draggedIndex = null;
  };

  regenerateData = () => {
    this.data = makeData(15);
  };

  <template>
    <div class="demo-root">
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
          {{#each this.rows as |row index|}}
            <tr
              draggable="true"
              {{on "dragstart" (this.dragStart index)}}
              {{on "dragover" this.handleDragOver}}
              {{on "drop" (this.drop index)}}
              {{on "dragend" this.handleDragEnd}}
            >
              {{#each (getAllCells row) as |cell|}}
                <td><FlexRenderCell @cell={{cell}} /></td>
              {{/each}}
            </tr>
          {{/each}}
        </tbody>
      </table>
      <div class="spacer-md"></div>
      <pre>{{this.sortedIds}}</pre>
    </div>
  </template>
}
