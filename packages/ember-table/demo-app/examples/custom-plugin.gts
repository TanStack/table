import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  FlexRenderFooter,
  tableFeatures,
  rowPaginationFeature,
  createPaginatedRowModel,
  createColumnHelper,
  assignTableAPIs,
  functionalUpdate,
  makeStateUpdater,
  type Row,
  type Cell,
  type OnChangeFn,
  type RowData,
  type TableFeature,
  type TableFeatures,
  type Updater,
} from '#src/index.ts';
import { makeData, type Person } from '../utils/make-data';

// --- Custom "density" feature plugin (translated from the Angular example) ---

// State contributed by the feature.
export type DensityState = 'sm' | 'md' | 'lg';
export interface TableState_Density {
  density: DensityState;
}

// Options contributed by the feature.
export interface TableOptions_Density {
  enableDensity?: boolean;
  onDensityChange?: OnChangeFn<DensityState>;
}

// Table instance APIs contributed by the feature.
export interface Table_Density {
  setDensity: (updater: Updater<DensityState>) => void;
  toggleDensity: (value?: DensityState) => void;
}

// Register the plugin's types via declaration merging so the table types
// (state / options / instance) all resolve cleanly.
declare module '@tanstack/table-core' {
  interface Plugins {
    densityPlugin: TableFeature;
  }

  interface TableState_FeatureMap {
    densityPlugin: TableState_Density;
  }

  interface TableOptions_FeatureMap<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    TFeatures extends TableFeatures,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    TData extends RowData,
  > {
    densityPlugin: TableOptions_Density;
  }

  interface Table_FeatureMap<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    TFeatures extends TableFeatures,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    TData extends RowData,
  > {
    densityPlugin: Table_Density;
  }
}

export const densityPlugin: TableFeature = {
  getInitialState: (initialState) => {
    return {
      density: 'md',
      ...initialState, // must come last so user state wins
    };
  },

  getDefaultTableOptions: (table) => {
    return {
      enableDensity: true,
      onDensityChange: makeStateUpdater('density', table),
    };
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('densityPlugin', table, {
      table_setDensity: {
        fn: (updater: Updater<DensityState>) => {
          const safeUpdater: Updater<DensityState> = (old) => {
            return functionalUpdate(updater, old);
          };
          return (table.options as TableOptions_Density).onDensityChange?.(
            safeUpdater,
          );
        },
      },
      table_toggleDensity: {
        fn: (value?: DensityState) => {
          const safeUpdater: Updater<DensityState> = (old) => {
            if (value) return value;
            // cycle through the 3 options
            return old === 'lg' ? 'md' : old === 'md' ? 'sm' : 'lg';
          };
          return (table.options as TableOptions_Density).onDensityChange?.(
            safeUpdater,
          );
        },
      },
    });
  },
};

// --- Table setup ---

const features = tableFeatures({
  rowPaginationFeature,
  densityPlugin,
  paginatedRowModel: createPaginatedRowModel(),
});

const columnHelper = createColumnHelper<typeof features, Person>();

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (props) => props.column.id,
  }),
]);

const PAGE_SIZES = [10, 20, 30, 40, 50];

// --- Template helpers ---

const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells();
const not = (value: unknown): boolean => !value;
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b);
const isFunction = (value: unknown): value is (...args: never[]) => unknown =>
  typeof value === 'function';

export default class CustomPluginTable extends Component {
  @tracked data: Array<Person> = makeData(20);
  @tracked density: DensityState = 'md';
  @tracked pageIndex = 0;
  @tracked pageSize = 10;

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    state: {
      density: this.density,
      pagination: { pageIndex: this.pageIndex, pageSize: this.pageSize },
    },
    onDensityChange: (updater) => {
      this.density = isFunction(updater) ? updater(this.density) : updater;
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({ pageIndex: this.pageIndex, pageSize: this.pageSize })
          : updater;
      this.pageIndex = next.pageIndex;
      this.pageSize = next.pageSize;
    },
  }));

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

  // Padding is driven by the current density, read reactively via a getter.
  get cellPadding() {
    switch (this.density) {
      case 'sm':
        return '4px';
      case 'lg':
        return '16px';
      default:
        return '8px';
    }
  }

  get cellStyle() {
    return `padding: ${this.cellPadding};`;
  }

  get canPreviousPage() {
    return this.table.getCanPreviousPage();
  }

  get canNextPage() {
    return this.table.getCanNextPage();
  }

  get pageCount() {
    return this.table.getPageCount();
  }

  get currentPage() {
    return (this.pageIndex + 1).toLocaleString();
  }

  get pageCountDisplay() {
    return this.table.getPageCount().toLocaleString();
  }

  get pageSizes() {
    return PAGE_SIZES;
  }

  toggleDensity = () => {
    this.table.toggleDensity();
  };

  regenerateData = () => {
    this.data = makeData(20);
  };

  goToFirstPage = () => {
    this.table.setPageIndex(0);
  };

  goToPreviousPage = () => {
    this.table.previousPage();
  };

  goToNextPage = () => {
    this.table.nextPage();
  };

  goToLastPage = () => {
    this.table.setPageIndex(this.table.getPageCount() - 1);
  };

  handlePageSizeChange = (event: Event) => {
    const target = event.currentTarget as HTMLSelectElement;
    this.table.setPageSize(Number(target.value));
  };

  <template>
    <div class="demo-root">
      <div class="controls">
        <button class="demo-button" {{on "click" this.toggleDensity}}>
          Toggle Density (current:
          {{this.density}})
        </button>
        <button class="demo-button" {{on "click" this.regenerateData}}>
          Regenerate Data
        </button>
      </div>
      <div class="spacer-sm"></div>
      <table>
        <thead>
          {{#each this.headerGroups as |headerGroup|}}
            <tr>
              {{#each headerGroup.headers as |header|}}
                <th colspan={{header.colSpan}} style={{this.cellStyle}}>
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
              {{#each (getAllCells row) as |cell|}}
                <td style={{this.cellStyle}}>
                  <FlexRenderCell @cell={{cell}} />
                </td>
              {{/each}}
            </tr>
          {{/each}}
        </tbody>
        <tfoot>
          {{#each this.footerGroups as |footerGroup|}}
            <tr>
              {{#each footerGroup.headers as |header|}}
                <th style={{this.cellStyle}}>
                  {{#unless header.isPlaceholder}}
                    <FlexRenderFooter @footer={{header}} />
                  {{/unless}}
                </th>
              {{/each}}
            </tr>
          {{/each}}
        </tfoot>
      </table>
      <div class="spacer-sm"></div>
      <div class="controls">
        <button
          class="demo-button demo-button-sm"
          disabled={{not this.canPreviousPage}}
          {{on "click" this.goToFirstPage}}
        >
          &lt;&lt;
        </button>
        <button
          class="demo-button demo-button-sm"
          disabled={{not this.canPreviousPage}}
          {{on "click" this.goToPreviousPage}}
        >
          &lt;
        </button>
        <button
          class="demo-button demo-button-sm"
          disabled={{not this.canNextPage}}
          {{on "click" this.goToNextPage}}
        >
          &gt;
        </button>
        <button
          class="demo-button demo-button-sm"
          disabled={{not this.canNextPage}}
          {{on "click" this.goToLastPage}}
        >
          &gt;&gt;
        </button>
        <span class="inline-controls">
          <div>Page</div>
          <strong>
            {{this.currentPage}}
            of
            {{this.pageCountDisplay}}
          </strong>
        </span>
        <select {{on "change" this.handlePageSizeChange}}>
          {{#each this.pageSizes as |size|}}
            <option value={{size}} selected={{eq size this.pageSize}}>
              Show
              {{size}}
            </option>
          {{/each}}
        </select>
      </div>
      <div class="spacer-md"></div>
      <pre>Density: {{this.density}}</pre>
      <pre>{{this.tableState}}</pre>
    </div>
  </template>
}
