import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
import { FlexRender } from '@tanstack/angular-table'
import type { Header, TableFeatures } from '@tanstack/angular-table'
import type { MarketQuote } from '../../feed/market-data'
import type {
  ColumnOrderTable,
  TradingTableInteractionController,
} from '../table-interactions'

type TradingHeader = Header<TableFeatures, MarketQuote, unknown>

@Component({
  selector: 'th[appTradingHeaderCell]',
  imports: [FlexRender],
  templateUrl: './trading-header-cell.html',
  host: {
    '[attr.colspan]': 'header().colSpan',
    '[attr.aria-sort]': 'ariaSort()',
    '[class.column-group-header]': 'isGroup()',
    '[class.numeric-header]': 'isNumeric()',
    '[class.is-column-dragging]':
      'interactions().draggedColumnId() === header().column.id',
    '[class.is-column-drop-target]':
      'interactions().dropTargetColumnId() === header().column.id',
    '[style.width]': 'width()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradingHeaderCell {
  readonly header = input.required<TradingHeader>({
    alias: 'appTradingHeaderCell',
  })
  readonly table = input.required<ColumnOrderTable>()
  readonly interactions = input.required<TradingTableInteractionController>()

  readonly isGroup = computed(() => this.header().subHeaders.length > 0)
  readonly isNumeric = computed(
    () => !this.isGroup() && !isTextColumn(this.header().column.id),
  )
  readonly width = computed(
    () => `calc(var(--header-${this.header().id}-size) * 1px)`,
  )
  readonly sorted = computed(() => this.header().column.getIsSorted())
  readonly ariaSort = computed(() =>
    this.isGroup() ? null : this.interactions().sortAriaValue(this.sorted()),
  )

  startColumnDrag(event: DragEvent): void {
    this.interactions().startColumnDrag(event, this.header().column.id)
  }

  dropColumn(event: DragEvent): void {
    this.interactions().dropColumn(this.table(), event, this.header().column.id)
  }
}

function isTextColumn(columnId: string): boolean {
  return columnId === 'market' || columnId === 'name' || columnId === 'symbol'
}
