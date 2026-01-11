import { Directive, effect, inject, input } from '@angular/core'
import {
  Cell,
  CellData,
  Header,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'
import { FlexRenderDirective } from '../flexRender'

/**
 * Simplified directive wrapper of `*flexRender`.
 *
 * Use this utility component to render headers, cells, or footers with custom markup.
 *
 * Only one prop (`cell`, `header`, or `footer`) may be passed based on the used selector.
 *
 * @example
 * ```html
 * <td *flexRenderCell="cell; let cell">{{cell}}</td>
 * <th *flexRenderHeader="header; let header">{{header}}</th>
 * <th *flexRenderFooter="footer; let footer">{{footer}}</th>
 * ```
 *
 * This replaces calling `*flexRender` directly like this:
 * ```html
 * <td *flexRender="cell.column.columnDef.cell; props: cell.getContext(); let cell">{{cell}}</td>
 * <td *flexRender="header.column.columnDef.header; props: header.getContext(); let header">{{header}}</td>
 * <td *flexRender="footer.column.columnDef.footer; props: footer.getContext(); let footer">{{footer}}</td>
 * ```
 *
 * @see {FlexRender}
 */
@Directive({
  selector:
    'ng-template[flexRenderCell], ng-template[flexRenderFooter], ng-template[flexRenderHeader]',
  hostDirectives: [{ directive: FlexRenderDirective }],
})
export class FlexRenderCell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> {
  readonly #flexRender = inject(
    FlexRenderDirective<TFeatures, TData, TValue, any>,
  )

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
      const { content, props } = this.#flexRender

      if (cell) {
        content.set(cell.column.columnDef.cell)
        props.set(cell.getContext())
      }

      if (header) {
        content.set(header.column.columnDef.header)
        props.set(header.getContext())
      }

      if (footer) {
        content.set(footer.column.columnDef.footer)
        props.set(footer.getContext())
      }
    })
  }
}
