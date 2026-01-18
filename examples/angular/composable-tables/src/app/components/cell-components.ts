import { Component, computed } from '@angular/core'
import { injectFlexRenderContext } from '@tanstack/angular-table'
import { CurrencyPipe } from '@angular/common'
import { injectTableCellContext } from '../table'
import type { CellContext, TableFeatures } from '@tanstack/angular-table'
import type { Person } from '../makeData'

@Component({
  // Using dynamic components with Angular, we can just put a simple selector
  // that will be rendered, but we need to specify an unique host property
  // that will identify this component
  selector: 'span',
  host: {
    'tanstack-table-text-cell': '',
  },
  template: ` {{ cell.getValue() }} `,
})
export class TextCell {
  readonly cell =
    injectFlexRenderContext<CellContext<TableFeatures, any, string>>()
}

@Component({
  selector: 'span',
  host: {
    'tanstack-table-number-cell': '',
  },
  template: ` {{ cell.getValue().toLocaleString() }} `,
})
export class NumberCell {
  readonly cell =
    injectFlexRenderContext<CellContext<TableFeatures, any, number>>()
}

@Component({
  selector: 'span',
  host: {
    'tanstack-table-status-cell': '',
    '[class.status-badge]': 'true',
    '[class]': 'cell().getValue()',
  },
  template: ` {{ cell().getValue() }} `,
})
export class StatusCell {
  readonly cell = injectTableCellContext<
    'relationship' | 'complicated' | 'single'
  >()
}

@Component({
  selector: 'table-progress-cell',
  template: `
    <div class="progress-bar"></div>
    <div class="progress-bar-fill" [style.width.%]="progress()"></div>
  `,
})
export class ProgressCell {
  readonly cell = injectTableCellContext<number>()

  readonly progress = computed(() => this.cell().getValue())
}

@Component({
  selector: 'table-row-actions',
  template: `
    <div class="row-actions">
      <button (click)="view()" title="View">👁️</button>
      <button (click)="edit()" title="Edit">️️✏️</button>
      <button (click)="delete()" title="Delete">🗑️</button>
    </div>
  `,
})
export class RowActionsCell {
  readonly cell = injectTableCellContext<number, Person>()

  view() {
    alert(
      `View: ${this.cell().row.original.firstName} ${this.cell().row.original.lastName}`,
    )
  }

  edit() {
    alert(
      `Edit: ${this.cell().row.original.firstName} ${this.cell().row.original.lastName}`,
    )
  }

  delete() {
    alert(
      `Delete: ${this.cell().row.original.firstName} ${this.cell().row.original.lastName}`,
    )
  }
}

@Component({
  selector: 'table-price-cell',
  template: ` <span class="price"> {{ cell().getValue() | currency }} </span> `,
  imports: [CurrencyPipe],
})
export class PriceCell {
  readonly cell = injectTableCellContext<number>()
}

@Component({
  selector: 'span',
  host: {
    'tanstack-table-category-cell': '',
    '[class.category-badge]': 'true',
    '[class]': 'cell().getValue()',
  },
  template: ` {{ cell().getValue() }} `,
})
export class CategoryCell {
  readonly cell = injectTableCellContext<
    'electronics' | 'clothing' | 'food' | 'books'
  >()
}
