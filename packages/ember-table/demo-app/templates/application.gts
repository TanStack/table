import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import { pageTitle } from 'ember-page-title'
import { BasicAppTable } from '../examples/basic-table.gts'
import BasicExternalStateTable from '../examples/basic-external-state.gts'
import ColumnGroupsTable from '../examples/column-groups.gts'
import ColumnVisibilityTable from '../examples/column-visibility.gts'
import ColumnOrderingTable from '../examples/column-ordering.gts'
import ColumnPinningTable from '../examples/column-pinning.gts'
import ColumnPinningStickyTable from '../examples/column-pinning-sticky.gts'
import ColumnPinningSplitTable from '../examples/column-pinning-split.gts'
import ColumnSizingTable from '../examples/column-sizing.gts'
import ColumnResizingTable from '../examples/column-resizing.gts'
import ColumnResizingPerformantTable from '../examples/column-resizing-performant.gts'
import SortingTable from '../examples/sorting.gts'
import FiltersTable from '../examples/filters.gts'
import FiltersFacetedTable from '../examples/filters-faceted.gts'
import FiltersFuzzyTable from '../examples/filters-fuzzy.gts'
import PaginationTable from '../examples/pagination.gts'
import RowSelectionTable from '../examples/row-selection.gts'
import ExpandingTable from '../examples/expanding.gts'
import SubComponentsTable from '../examples/sub-components.gts'
import RowPinningTable from '../examples/row-pinning.gts'
import GroupingTable from '../examples/grouping.gts'
import EditableTable from '../examples/editable.gts'
import CustomPluginTable from '../examples/custom-plugin.gts'
import RowDndTable from '../examples/row-dnd.gts'
import RemoteDataTable from '../examples/remote-data.gts'
import KitchenSinkTable from '../examples/kitchen-sink.gts'
import type { ComponentLike } from '@glint/template'

interface Example {
  id: string
  label: string
  component: ComponentLike
}

const EXAMPLES: Array<Example> = [
  { id: 'basic', label: 'Basic', component: BasicAppTable },
  {
    id: 'basic-external-state',
    label: 'Basic (External State)',
    component: BasicExternalStateTable,
  },
  { id: 'sorting', label: 'Sorting', component: SortingTable },
  { id: 'filters', label: 'Filters', component: FiltersTable },
  {
    id: 'filters-faceted',
    label: 'Filters (Faceted)',
    component: FiltersFacetedTable,
  },
  {
    id: 'filters-fuzzy',
    label: 'Filters (Fuzzy)',
    component: FiltersFuzzyTable,
  },
  { id: 'pagination', label: 'Pagination', component: PaginationTable },
  {
    id: 'row-selection',
    label: 'Row Selection',
    component: RowSelectionTable,
  },
  { id: 'expanding', label: 'Expanding', component: ExpandingTable },
  {
    id: 'sub-components',
    label: 'Sub Components',
    component: SubComponentsTable,
  },
  { id: 'row-pinning', label: 'Row Pinning', component: RowPinningTable },
  { id: 'grouping', label: 'Grouping', component: GroupingTable },
  { id: 'editable', label: 'Editable Data', component: EditableTable },
  { id: 'row-dnd', label: 'Row Drag & Drop', component: RowDndTable },
  {
    id: 'column-groups',
    label: 'Column Groups',
    component: ColumnGroupsTable,
  },
  {
    id: 'column-visibility',
    label: 'Column Visibility',
    component: ColumnVisibilityTable,
  },
  {
    id: 'column-ordering',
    label: 'Column Ordering',
    component: ColumnOrderingTable,
  },
  {
    id: 'column-pinning',
    label: 'Column Pinning',
    component: ColumnPinningTable,
  },
  {
    id: 'column-pinning-sticky',
    label: 'Column Pinning (Sticky)',
    component: ColumnPinningStickyTable,
  },
  {
    id: 'column-pinning-split',
    label: 'Column Pinning (Split)',
    component: ColumnPinningSplitTable,
  },
  {
    id: 'column-sizing',
    label: 'Column Sizing',
    component: ColumnSizingTable,
  },
  {
    id: 'column-resizing',
    label: 'Column Resizing',
    component: ColumnResizingTable,
  },
  {
    id: 'column-resizing-performant',
    label: 'Column Resizing (Performant)',
    component: ColumnResizingPerformantTable,
  },
  {
    id: 'custom-plugin',
    label: 'Custom Plugin',
    component: CustomPluginTable,
  },
  { id: 'remote-data', label: 'Remote Data', component: RemoteDataTable },
  { id: 'kitchen-sink', label: 'Kitchen Sink', component: KitchenSinkTable },
]

const eq = (a: unknown, b: unknown): boolean => a === b

const QUERY_PARAM = 'example'

function exampleIdFromUrl(): string {
  const id = new URLSearchParams(window.location.search).get(QUERY_PARAM)
  return EXAMPLES.some((example) => example.id === id) ? id! : EXAMPLES[0]!.id
}

function writeExampleIdToUrl(id: string): void {
  const url = new URL(window.location.href)
  if (id === EXAMPLES[0]!.id) {
    url.searchParams.delete(QUERY_PARAM)
  } else {
    url.searchParams.set(QUERY_PARAM, id)
  }
  window.history.replaceState(null, '', url)
}

export default class Application extends Component {
  @tracked activeId: string = exampleIdFromUrl()

  get activeExample(): Example {
    return (
      EXAMPLES.find((example) => example.id === this.activeId) ?? EXAMPLES[0]!
    )
  }

  selectExample = (example: Example) => () => {
    this.activeId = example.id
    writeExampleIdToUrl(example.id)
  }

  <template>
    {{pageTitle "Ember Table Demo"}}

    <div class="example-tabs" role="tablist" aria-label="Examples">
      {{#each EXAMPLES as |example|}}
        <button
          type="button"
          role="tab"
          class="example-tab {{if (eq example.id this.activeId) 'is-active'}}"
          aria-selected="{{if (eq example.id this.activeId) 'true' 'false'}}"
          {{on "click" (this.selectExample example)}}
        >
          {{example.label}}
        </button>
      {{/each}}
    </div>

    <div class="examples"><this.activeExample.component /></div>
  </template>
}
