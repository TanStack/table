import { CommonModule } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { Column, Table } from '@tanstack/angular-table'

@Component({
  selector: 'Filter',
  template: ` @if (columnType) {
    @if (columnType == 'number') {
      <div>
        <input
          type="number"
          [value]="getMinValue()"
          placeholder="min"
          #min
          (change)="updateMinFilterValue(min.value)"
          (click)="$event.stopPropagation()"
        />
        <input
          type="number"
          [value]="getMaxValue()"
          placeholder="max"
          #max
          (change)="updateMaxFilterValue(max.value)"
          (click)="$event.stopPropagation()"
        />
      </div>
    } @else {
      <input
        type="text"
        [value]="column.getFilterValue() ?? ''"
        #search
        placeholder="Search..."
        (change)="column.setFilterValue(search.value)"
        (click)="$event.stopPropagation()"
      />
    }
  }`,
  standalone: true,
  imports: [CommonModule],
})
export class FilterComponent implements OnInit {
  @Input({ required: true })
  column!: Column<any, any>

  @Input({ required: true })
  table!: Table<any>

  private _columnType!: string

  public get columnType(): string {
    return this._columnType
  }
  public set columnType(value: string) {
    this._columnType = value
  }

  ngOnInit() {
    this.columnType = typeof this.table
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(this.column.id)
  }
  getMinValue() {
    const minValue = this.column.getFilterValue() as any

    return (minValue?.[0] ?? '') as string
  }
  getMaxValue() {
    const maxValue = this.column.getFilterValue() as any
    return (maxValue?.[1] ?? '') as string
  }

  updateMinFilterValue(newValue: any): void {
    this.column.setFilterValue((old: any) => {
      return [newValue, old?.[1]]
    })
  }
  updateMaxFilterValue(newValue: any): void {
    this.column.setFilterValue((old: any) => [old?.[0], newValue])
  }
}
