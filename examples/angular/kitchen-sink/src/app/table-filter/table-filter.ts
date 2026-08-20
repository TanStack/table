import { Component, computed, input } from '@angular/core'
import { DebouncedInput } from '../debounced-input/debounced-input'
import type { features } from '../app'
import type { Person } from '../makeData'
import type { Column } from '@tanstack/angular-table'

@Component({
  selector: 'app-table-filter',
  template: `
    @switch (filterVariant()) {
      @case ('range') {
        <div class="filter-row">
          <input
            debouncedInput
            [debounce]="300"
            type="number"
            class="filter-input"
            [min]="column().getFacetedMinMaxValues()?.[0] ?? ''"
            [max]="column().getFacetedMinMaxValues()?.[1] ?? ''"
            [value]="columnFilterValue()?.[0] ?? ''"
            [attr.placeholder]="minRangePlaceholder()"
            (changeEvent)="changeMinRangeValue($event)"
          />
          <input
            debouncedInput
            [debounce]="300"
            type="number"
            class="filter-input"
            [min]="column().getFacetedMinMaxValues()?.[0] ?? ''"
            [max]="column().getFacetedMinMaxValues()?.[1] ?? ''"
            [value]="columnFilterValue()?.[1] ?? ''"
            [attr.placeholder]="maxRangePlaceholder()"
            (changeEvent)="changeMaxRangeValue($event)"
          />
        </div>
      }
      @case ('select') {
        <select
          class="filter-select"
          [value]="columnFilterValue()?.toString() ?? ''"
          (change)="column().setFilterValue($any($event).target.value)"
        >
          <option value="">All</option>
          @for (value of sortedUniqueValues(); track value) {
            <option [value]="value">{{ value }}</option>
          }
        </select>
      }
      @default {
        <datalist [id]="column().id + 'list'">
          @for (value of sortedUniqueValues(); track value) {
            <option [value]="value"></option>
          }
        </datalist>
        <input
          type="text"
          class="filter-select"
          debouncedInput
          [debounce]="300"
          [attr.placeholder]="
            'Search (' + column().getFacetedUniqueValues().size + ')'
          "
          [attr.list]="column().id + 'list'"
          [value]="columnFilterValue() ?? ''"
          (changeEvent)="column().setFilterValue($any($event).target.value)"
        />
      }
    }
  `,
  imports: [DebouncedInput],
})
export class TableFilter {
  readonly column = input.required<Column<typeof features, Person>>()

  readonly filterVariant = computed(
    () => this.column().columnDef.meta?.filterVariant,
  )

  readonly columnFilterValue = computed(
    () => this.column().getFilterValue() as any,
  )

  readonly minRangePlaceholder = computed(() => {
    return `Min ${
      this.column().getFacetedMinMaxValues()?.[0] !== undefined
        ? `(${this.column().getFacetedMinMaxValues()?.[0]})`
        : ''
    }`
  })

  readonly maxRangePlaceholder = computed(() => {
    return `Max ${
      this.column().getFacetedMinMaxValues()?.[1] !== undefined
        ? `(${this.column().getFacetedMinMaxValues()?.[1]})`
        : ''
    }`
  })

  readonly sortedUniqueValues = computed(() => {
    if (this.filterVariant() === 'range') return []
    return Array.from(this.column().getFacetedUniqueValues().keys())
      .sort()
      .slice(0, 5000)
  })

  readonly changeMinRangeValue = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    this.column().setFilterValue((old?: [number, number]) => [value, old?.[1]])
  }

  readonly changeMaxRangeValue = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    this.column().setFilterValue((old?: [number, number]) => [old?.[0], value])
  }
}
