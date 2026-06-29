import { Component, computed, input } from '@angular/core'
import { DebouncedInput } from '../debounced-input/debounced-input'
import type { features } from '../app'
import type { Person } from '../makeData'
import type { Column, Table } from '@tanstack/angular-table'

@Component({
  selector: 'app-table-filter',
  template: `
    @switch (filterVariant()) {
      @case ('range') {
        <div class="filter-row">
          <input
            debouncedInput
            [debounce]="500"
            type="number"
            class="filter-input"
            [value]="columnFilterValue()?.[0] ?? ''"
            placeholder="Min"
            (changeEvent)="changeMinRangeValue($event)"
          />
          <input
            debouncedInput
            [debounce]="500"
            type="number"
            class="filter-input"
            [value]="columnFilterValue()?.[1] ?? ''"
            placeholder="Max"
            (changeEvent)="changeMaxRangeValue($event)"
          />
        </div>
      }
      @case ('select') {
        <select
          [value]="columnFilterValue()?.toString()"
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
            <option [value]="value">{{ value }}</option>
          }
        </datalist>
        <input
          type="text"
          class="filter-select"
          debouncedInput
          [debounce]="500"
          placeholder="Search..."
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
  readonly table = input.required<Table<typeof features, Person>>()
  readonly filterVariant = computed(
    () => (this.column().columnDef.meta ?? {}).filterVariant,
  )
  readonly columnFilterValue = computed(
    () => this.column().getFilterValue() as any,
  )

  readonly sortedUniqueValues = computed(() => {
    if (this.filterVariant() === 'range') return []
    const columnId = this.column().id
    return Array.from(
      new Set(
        this.table()
          .getPreFilteredRowModel()
          .flatRows.map((row) => row.getValue(columnId)),
      ),
    )
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
