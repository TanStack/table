import { Directive, effect, inject, input, untracked } from '@angular/core'
import {
  Cell,
  CellData,
  Header,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'
import { FlexRender } from '../flex-render'
import { CellContextToken } from './cell'
import { HeaderContextToken } from './header'
import { TableContextToken } from './table'

@Directive({
  selector:
    'ng-template[flexRenderCell], ng-template[flexRenderFooter], ng-template[flexRenderHeader]',
  hostDirectives: [{ directive: FlexRender }],
})
export class CellFlexRender<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> {
  readonly #flexRender = inject(FlexRender<TFeatures, TData, TValue, any>)

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
      const { content, props, staticProviders } = this.#flexRender

      if (cell) {
        content.set(cell.column.columnDef.cell)
        props.set(cell.getContext())
        // TODO: fix
        untracked(() =>
          this.#flexRender.ngOnChanges({
            inputContent: {
              currentValue: cell.column.columnDef.cell,
            },
            inputProps: {
              currentValue: cell.getContext(),
            },
          } as any),
        )
        staticProviders.set([
          { provide: TableContextToken, useValue: () => cell.table },
          { provide: CellContextToken, useValue: () => cell },
        ])
      }

      if (header) {
        content.set(header.column.columnDef.header)
        props.set(header.getContext())
        staticProviders.set([
          { provide: TableContextToken, useValue: () => header.table },
          { provide: HeaderContextToken, useValue: () => header },
        ])
      }

      if (footer) {
        content.set(footer.column.columnDef.footer)
        props.set(footer.getContext())
        staticProviders.set([
          { provide: TableContextToken, useValue: () => footer.table },
          {
            provide: HeaderContextToken,
            useValue: () => footer,
          },
        ])
      }
    })
  }
}
