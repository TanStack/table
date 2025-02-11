import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core'
import {
  type HeaderContext,
  injectFlexRenderContext,
  type Table,
  CellContext,
  RowData,
} from '@tanstack/angular-table'

@Component({
  standalone: true,
  template: `
    <button (click)="click.emit($event)">
      {{ expanded() ? '👇' : '👉' }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpanderCell {
  readonly expanded = input.required<boolean>()

  readonly click = output<MouseEvent>()
}

@Component({
  standalone: true,
  template: `
    <div [style.--depth]="row.depth">
      {{ context.getValue() }}
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
  readonly context = injectFlexRenderContext<CellContext<{}, T, unknown>>()

  get row() {
    return this.context.row
  }
}
