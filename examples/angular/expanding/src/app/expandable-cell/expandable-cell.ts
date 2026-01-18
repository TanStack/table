import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import {
  injectTableCellContext,
  injectTableHeaderContext,
} from '@tanstack/angular-table'
import type { RowData } from '@tanstack/angular-table'
import type { _features } from '../app'

@Component({
  standalone: true,
  template: `
    <input
      type="checkbox"
      [indeterminate]="table.getIsSomeRowsSelected()"
      [checked]="table.getIsAllRowsSelected()"
      (change)="table.getToggleAllRowsSelectedHandler()($event)"
    />
    {{ ' ' }}

    <button (click)="table.getToggleAllRowsExpandedHandler()($event)">
      {{ table.getIsAllRowsExpanded() ? '👇' : '👉' }}
    </button>

    {{ label() }}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandableHeaderCell<T extends RowData> {
  readonly context = injectTableHeaderContext<typeof _features, T, unknown>()

  readonly label = input.required<string>()

  get table() {
    return this.context().table
  }
}

@Component({
  standalone: true,
  template: `
    <div [style.--depth]="row.depth">
      <div>
        <input
          type="checkbox"
          [indeterminate]="row.getIsSomeSelected()"
          [checked]="row.getIsSelected()"
          (change)="row.getToggleSelectedHandler()($event)"
        />
        {{ ' ' }}

        @if (row.getCanExpand()) {
          <button (click)="row.getToggleExpandedHandler()()">
            {{ row.getIsExpanded() ? '👇' : '👉' }}
          </button>
        } @else {
          <span>🔵</span>
        }
        {{ ' ' }}

        {{ context().getValue() }}
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      > div {
        padding-left: calc(2rem * var(--depth, 1));
      }
    }
  `,
})
export class ExpandableCell<T extends RowData> {
  readonly context = injectTableCellContext<typeof _features, T, unknown>()

  get row() {
    return this.context().row
  }
}
