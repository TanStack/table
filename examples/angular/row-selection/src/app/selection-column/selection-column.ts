import { injectTableCellContext } from '@tanstack/angular-table'
import { ChangeDetectionStrategy, Component, computed } from '@angular/core'
import {
  injectFlexRenderCellContext,
  injectFlexRenderHeaderContext,
} from '../table'

@Component({
  template: `
    <input
      type="checkbox"
      [checked]="context.table.getIsAllRowsSelected()"
      [indeterminate]="context.table.getIsSomeRowsSelected()"
      (change)="context.table.toggleAllRowsSelected()"
    />
  `,
  host: {
    class: 'selection-cell',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeaderSelection {
  context = injectFlexRenderHeaderContext()
}

@Component({
  template: `
    <input
      type="checkbox"
      [checked]="context.row.getIsSelected()"
      [disabled]="!context.row.getCanSelect()"
      (change)="context.row.getToggleSelectedHandler()($event)"
    />
  `,
  host: {
    class: 'selection-cell',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRowSelection {
  readonly cell = injectTableCellContext()
  readonly row = computed(() => this.cell().row)
  readonly context = injectFlexRenderCellContext()
}
