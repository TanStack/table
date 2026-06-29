import { Component, input } from '@angular/core'
import type { OnInit } from '@angular/core'
import type { Column, RowData, Table } from '@tanstack/angular-table'
import type { features } from './app.component'

@Component({
  selector: 'app-table-filter',
  template: ` @if (columnType) {
    @if (columnType == 'number') {
      <div class="filter-row">
        <input
          #min
          type="number"
          class="filter-input"
          placeholder="Min"
          [value]="getMinValue()"
          (input)="updateMinFilterValue(min.value)"
        />
        <input
          #max
          type="number"
          class="filter-select"
          placeholder="max"
          [value]="getMaxValue()"
          (input)="updateMaxFilterValue(max.value)"
        />
      </div>
    } @else {
      <input
        #search
        type="text"
        class="filter-select"
        placeholder="Search..."
        [value]="column().getFilterValue() ?? ''"
        (input)="column().setFilterValue(search.value)"
      />
    }
  }`,
})
export class FilterComponent<T extends RowData> implements OnInit {
  column = input.required<Column<typeof features, T>>()

  table = input.required<Table<typeof features, T>>()

  columnType!: string

  ngOnInit() {
    this.columnType = typeof this.table()
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(this.column().id)
  }

  getMinValue() {
    const minValue = this.column().getFilterValue() as
      | [string | undefined, string | undefined]
      | undefined

    return minValue?.[0] ?? ''
  }

  getMaxValue() {
    const maxValue = this.column().getFilterValue() as
      | [string | undefined, string | undefined]
      | undefined

    return maxValue?.[1] ?? ''
  }

  updateMinFilterValue(newValue: string): void {
    this.column().setFilterValue((old: any) => {
      return [newValue, old?.[1]]
    })
  }

  updateMaxFilterValue(newValue: string): void {
    this.column().setFilterValue((old: any) => [old?.[0], newValue])
  }
}
