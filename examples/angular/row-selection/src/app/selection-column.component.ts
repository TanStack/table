import { type CellContext, type HeaderContext } from '@tanstack/angular-table'
import { Component, input } from '@angular/core'

@Component({
  selector: 'app-table-head-selection',
  template: `
    <input
      type="checkbox"
      [checked]="props().table.getIsAllRowsSelected()"
      [indeterminate]="props().table.getIsSomeRowsSelected()"
      (change)="props().table.toggleAllRowsSelected()"
    />
  `,
  standalone: true,
})
export class TableHeadSelectionComponent<T> {
  props = input.required<HeaderContext<T, unknown>>()
}

@Component({
  template: `
    <input
      type="checkbox"
      [checked]="props().row.getIsSelected()"
      (change)="props().row.getToggleSelectedHandler()($event)"
    />
  `,
  standalone: true,
})
export class TableRowSelectionComponent<T> {
  props = input.required<CellContext<T, unknown>>()
}
