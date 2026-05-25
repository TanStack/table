import { Component, computed, input } from '@angular/core'
import { DebouncedInput } from '../debounced-input/debounced-input'
import type { _features } from '../app'
import type { Person } from '../makeData'
import type {
  CellData,
  Column,
  RowData,
  Table,
  TableFeatures,
} from '@tanstack/angular-table'

declare module '@tanstack/angular-table' {
  // allows us to define custom properties for our columns
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    filterVariant?: 'text' | 'range' | 'select'
  }
}

@Component({
  selector: 'app-table-filter',
  template: `
    @switch (filterVariant()) {
      @case ('range') {
        <div>
          <div class="filter-row">
            <input
              debouncedInput
              [debounce]="500"
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
              [debounce]="500"
              type="number"
              class="filter-input"
              [min]="column().getFacetedMinMaxValues()?.[0] ?? ''"
              [max]="column().getFacetedMinMaxValues()?.[1] ?? ''"
              [value]="columnFilterValue()?.[1] ?? ''"
              [attr.placeholder]="maxRangePlaceholder()"
              (changeEvent)="changeMaxRangeValue($event)"
            />
          </div>
          <div class="spacer-xs"></div>
        </div>
      }
      @case ('select') {
        <select
          [value]="columnFilterValue()?.toString()"
          (change)="column().setFilterValue($any($event).target.value)"
        >
          <option value="">All</option>
          @for (value of sortedUniqueValues(); track value) {
            <option [value]="value">
              {{ value }}
            </option>
          }
        </select>
      }
      @default {
        <datalist [id]="column().id + 'list'">
          @for (value of sortedUniqueValues(); track value) {
            <option [value]="value">
              {{ value }}
            </option>
          }
        </datalist>
        <input
          type="text"
          class="filter-select"
          debouncedInput
          [debounce]="500"
          [attr.placeholder]="
            'Search... (' + column().getFacetedUniqueValues().size + ')'
          "
          [attr.list]="column().id + 'list'"
          [value]="columnFilterValue() ?? ''"
          (changeEvent)="column().setFilterValue($any($event).target.value)"
        />
        <div class="spacer-xs"></div>
      }
    }
  `,
  imports: [DebouncedInput],
})
export class TableFilter {
  readonly column = input.required<Column<typeof _features, Person>>()

  readonly table = input.required<Table<typeof _features, Person>>()

  readonly filterVariant = computed(() => {
    return (this.column().columnDef.meta ?? {}).filterVariant
  })

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
      this.column().getFacetedMinMaxValues()?.[1]
        ? `(${this.column().getFacetedMinMaxValues()?.[1]})`
        : ''
    }`
  })

  readonly sortedUniqueValues = computed(() => {
    const filterVariant = this.filterVariant()
    const column = this.column()
    if (filterVariant === 'range') {
      return []
    }
    return Array.from(column.getFacetedUniqueValues().keys())
      .sort()
      .slice(0, 5000)
  })

  readonly changeMinRangeValue = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    this.column().setFilterValue((old?: [number, number]) => {
      return [value, old?.[1]]
    })
  }

  readonly changeMaxRangeValue = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    this.column().setFilterValue((old?: [number, number]) => {
      return [old?.[0], value]
    })
  }
}
