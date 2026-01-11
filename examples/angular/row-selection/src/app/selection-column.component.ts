import {
  injectFlexRenderContext,
  injectTableCellContext,
} from '@tanstack/angular-table'
import { ChangeDetectionStrategy, Component, computed } from '@angular/core'
import type {
  CellContext,
  HeaderContext,
  RowData,
} from '@tanstack/angular-table'

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
    class: 'px-1 block',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeadSelectionComponent<T extends RowData> {
  context =
    injectFlexRenderContext<
      HeaderContext<{ rowSelectionFeature: {} }, T, unknown>
    >()
}

@Component({
  template: `
    <input
      type="checkbox"
      [checked]="context.row.getIsSelected()"
      (change)="context.row.getToggleSelectedHandler()($event)"
    />
  `,
  host: {
    class: 'px-1 block',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRowSelectionComponent<T> {
  readonly cell = injectTableCellContext()
  readonly row = computed(() => this.cell().row)
  context =
    // @ts-expect-error TODO: Should fix types
    injectFlexRenderContext<CellContext<{ rowSelectionFeature: {} }, unknown>>()
}
