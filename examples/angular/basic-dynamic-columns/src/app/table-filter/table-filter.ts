import { Component, computed, input } from '@angular/core'
import { DebouncedInput } from '../debounced-input/debounced-input'
import type { DataType, DynamicRow, features } from '../app'
import type { Column, Table } from '@tanstack/angular-table'

// The filter variant rendered for a column. Derived from the detected data type,
// with the extra `enum-select` / `text` distinction for strings decided from the
// column's faceted unique values (low cardinality -> a select of its values).
type FilterVariant =
  'number-range' | 'date-range' | 'boolean-select' | 'enum-select' | 'text'

@Component({
  selector: 'app-table-filter',
  template: `
    @switch (filterVariant()) {
      @case ('number-range') {
        <div class="filter-row">
          <input
            debouncedInput
            [debounce]="500"
            type="number"
            class="filter-input"
            [value]="columnFilterValue()?.[0] ?? ''"
            [attr.placeholder]="minRangePlaceholder()"
            (changeEvent)="changeMinRangeValue($event)"
          />
          <input
            debouncedInput
            [debounce]="500"
            type="number"
            class="filter-input"
            [value]="columnFilterValue()?.[1] ?? ''"
            [attr.placeholder]="maxRangePlaceholder()"
            (changeEvent)="changeMaxRangeValue($event)"
          />
        </div>
      }
      @case ('date-range') {
        <div class="filter-row">
          <input
            debouncedInput
            [debounce]="500"
            type="date"
            class="filter-input"
            [value]="columnFilterValue()?.[0] ?? ''"
            (changeEvent)="changeMinDateValue($event)"
          />
          <input
            debouncedInput
            [debounce]="500"
            type="date"
            class="filter-input"
            [value]="columnFilterValue()?.[1] ?? ''"
            (changeEvent)="changeMaxDateValue($event)"
          />
        </div>
      }
      @case ('boolean-select') {
        <select
          class="filter-select"
          [value]="columnFilterValue()?.toString() ?? ''"
          (change)="column().setFilterValue($any($event).target.value)"
        >
          <option value="">All</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      }
      @case ('enum-select') {
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
        <input
          type="text"
          class="filter-input"
          debouncedInput
          [debounce]="500"
          [attr.placeholder]="
            'Search... (' + column().getFacetedUniqueValues().size + ')'
          "
          [value]="columnFilterValue() ?? ''"
          (changeEvent)="column().setFilterValue($any($event).target.value)"
        />
      }
    }
  `,
  imports: [DebouncedInput],
})
export class TableFilter {
  readonly column = input.required<Column<typeof features, DynamicRow>>()

  readonly table = input.required<Table<typeof features, DynamicRow>>()

  readonly dataType = computed<DataType>(
    () => (this.column().columnDef.meta ?? { dataType: 'string' }).dataType,
  )

  readonly columnFilterValue = computed(
    () => this.column().getFilterValue() as any,
  )

  // string: low-cardinality columns become a select of their faceted values,
  // everything else gets a free-text search.
  readonly sortedUniqueValues = computed(() => {
    return Array.from(this.column().getFacetedUniqueValues().keys())
      .map(String)
      .sort()
  })

  readonly filterVariant = computed<FilterVariant>(() => {
    const dataType = this.dataType()
    if (dataType === 'number') return 'number-range'
    if (dataType === 'date') return 'date-range'
    if (dataType === 'boolean') return 'boolean-select'
    const unique = this.sortedUniqueValues()
    if (unique.length > 0 && unique.length <= 10) return 'enum-select'
    return 'text'
  })

  readonly minRangePlaceholder = computed(() => {
    const min = this.column().getFacetedMinMaxValues()?.[0]
    return `Min${min !== undefined ? ` (${min})` : ''}`
  })

  readonly maxRangePlaceholder = computed(() => {
    const max = this.column().getFacetedMinMaxValues()?.[1]
    return `Max${max !== undefined ? ` (${max})` : ''}`
  })

  readonly changeMinRangeValue = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    this.column().setFilterValue((old?: [number, number]) => [value, old?.[1]])
  }

  readonly changeMaxRangeValue = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    this.column().setFilterValue((old?: [number, number]) => [old?.[0], value])
  }

  readonly changeMinDateValue = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    this.column().setFilterValue((old?: [string, string]) => [
      String(value),
      old?.[1] ?? '',
    ])
  }

  readonly changeMaxDateValue = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    this.column().setFilterValue((old?: [string, string]) => [
      old?.[0] ?? '',
      String(value),
    ])
  }
}
