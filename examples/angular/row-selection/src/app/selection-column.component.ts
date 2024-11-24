import { injectFlexRenderContext } from '@tanstack/angular-table'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import type { CellContext, HeaderContext } from '@tanstack/angular-table'

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
export class TableHeadSelectionComponent<T> {
  context = injectFlexRenderContext<
    // @ts-expect-error TODO: Should fix types
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
  context =
    // @ts-expect-error TODO: Should fix types
    injectFlexRenderContext<CellContext<{ rowSelectionFeature: {} }, unknown>>()
}
