import { Directive, effect, inject, input } from '@angular/core'
import { Cell, CellData, RowData, TableFeatures } from '@tanstack/table-core'
import { SIGNAL, signalSetFn } from '@angular/core/primitives/signals'
import { FlexRender } from '../flex-render'
import type { Signal } from '@angular/core'
import type { Header } from '@tanstack/table-core'

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
  readonly cell = input.required<Cell<TFeatures, TData, TValue>>({
    alias: 'tanStackTableCell',
  })
}

export function injectTableCellContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
>(): TanStackTableCellContext<TFeatures, TData, TValue>['cell'] {
  return inject(TanStackTableCell<TFeatures, TData, TValue>).cell
}

@Directive({
  selector:
    'ng-template[flexRenderCell], ng-template[flexRenderFooter], ng-template[flexRenderHeader]',
  hostDirectives: [{ directive: FlexRender }],
})
export class CellFlexRender<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue,
> {
  readonly flexRender = inject(FlexRender)

  readonly cell = input<Cell<TFeatures, TData, TValue>>(undefined, {
    alias: 'flexRenderCell',
  })

  readonly header = input<Header<TFeatures, TData, TValue>>(undefined, {
    alias: 'flexRenderHeader',
  })

  readonly footer = input<Header<TFeatures, TData, TValue>>(undefined, {
    alias: 'flexRenderFooter',
  })

  constructor() {
    effect(() => {
      const cell = this.cell()
      const header = this.header()
      const footer = this.footer()
      const contentNode = this.flexRender.content[SIGNAL]
      const propsNode = this.flexRender.props[SIGNAL]

      if (cell) {
        signalSetFn(contentNode, cell.column.columnDef.cell)
        signalSetFn(propsNode, cell.getContext())
      }
      if (header) {
        signalSetFn(contentNode, header.column.columnDef.header)
        signalSetFn(propsNode, header.getContext())
      }
      if (footer) {
        signalSetFn(contentNode, footer.column.columnDef.footer)
        signalSetFn(propsNode, footer.getContext())
      }
    })
  }
}
