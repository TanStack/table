import { Component, computed, input } from '@angular/core'
import type { features } from '../app'
import type { Account } from '../makeData'
import type { FacetKey } from '../buckets'
import type { Column, Table } from '@tanstack/angular-table'

@Component({
  selector: 'app-table-filter',
  template: `
    @if (column().columnDef.meta?.filterVariant === 'facets') {
      <fieldset class="facet-options">
        @for (option of options(); track option.value) {
          <label>
            <input
              type="checkbox"
              [checked]="selected().includes(option.value)"
              (change)="toggleFacet(option.value)"
            />
            <span>{{ option.label }}</span>
            <span class="count">{{
              (counts().get(option.value) ?? 0).toLocaleString()
            }}</span>
          </label>
        }
      </fieldset>
    } @else {
      <input
        type="text"
        class="filter-select"
        placeholder="Search…"
        [value]="column().getFilterValue() ?? ''"
        (input)="column().setFilterValue($any($event).target.value)"
      />
    }
  `,
})
export class TableFilter {
  readonly column = input.required<Column<typeof features, Account>>()
  readonly table = input.required<Table<typeof features, Account>>()
  readonly options = computed(
    () => this.column().columnDef.meta?.facetOptions ?? [],
  )
  readonly selected = computed(
    () => (this.column().getFilterValue() ?? []) as Array<FacetKey>,
  )
  readonly counts = computed(() => this.column().getFacetedUniqueValues())

  toggleFacet(value: FacetKey) {
    const selected = this.selected()
    this.column().setFilterValue(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    )
  }
}
