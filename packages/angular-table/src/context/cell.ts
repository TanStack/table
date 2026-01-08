import { Directive, inject, input } from '@angular/core'
import { Cell, CellData, RowData, TableFeatures } from '@tanstack/table-core'
import type { Signal } from '@angular/core'

export interface TanStackTableCellContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> {
  cell: Signal<Cell<TFeatures, TData, TValue>>
}

@Directive({
  selector: '[tanStackTableCell]',
  exportAs: 'cell',
})
export class TanStackTableCell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> implements TanStackTableCellContext<TFeatures, TData, TValue> {
  readonly cell = input.required<Cell<TFeatures, TData, TValue>>()
}

export function injectTableCellContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
>(): TanStackTableCellContext<TFeatures, TData, TValue> {
  return inject(TanStackTableCell<TFeatures, TData, TValue>)
}
