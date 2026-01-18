import {
  DestroyRef,
  Directive,
  Injector,
  TemplateRef,
  ViewContainerRef,
  computed,
  inject,
  input,
} from '@angular/core'
import {
  Cell,
  CellData,
  Header,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'
import { FlexViewRenderer } from '../flex-render/renderer'
import type { FlexRenderInputContent } from '../flex-render/renderer'
import type { CellContext, HeaderContext } from '@tanstack/table-core'

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
 * Can be imported through {@link FlexRenderCell} or {@link FlexRender} import,
 * which the latter is preferred.
 *
 * @example
 * ```ts
 * import {FlexRender} from '@tanstack/angular-table
 *
 * @Component({
 *  // ...
 *  imports: [
 *    FlexRender
 *  ]
 * })
 * ```
 */
@Directive({
  selector:
    'ng-template[flexRenderCell], ng-template[flexRenderFooter], ng-template[flexRenderHeader]',
})
export class FlexRenderCell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> {
  readonly cell = input<Cell<TFeatures, TData, TValue>>(undefined, {
    alias: 'flexRenderCell',
  })

  readonly header = input<Header<TFeatures, TData, TValue>>(undefined, {
    alias: 'flexRenderHeader',
  })

  readonly footer = input<Header<TFeatures, TData, TValue>>(undefined, {
    alias: 'flexRenderFooter',
  })

  readonly #renderData = computed<
    | [
        content: FlexRenderInputContent<CellContext<TFeatures, TData, TValue>>,
        props: CellContext<TFeatures, TData, TValue>,
      ]
    | [
        content: FlexRenderInputContent<
          HeaderContext<TFeatures, TData, TValue>
        >,
        props: HeaderContext<TFeatures, TData, TValue>,
      ]
    | [content: null, props: null]
  >(
    () => {
      const cell = this.cell()
      const header = this.header()
      const footer = this.footer()
      if (cell) {
        return [cell.column.columnDef.cell, cell.getContext()]
      }
      if (header) {
        return [header.column.columnDef.header, header.getContext()]
      }
      if (footer) {
        return [footer.column.columnDef.footer, footer.getContext()]
      }
      return [null, null]
    },
    {
      equal: (a, b) => {
        return a[0] === b[0] && a[1] === b[1]
      },
    },
  )

  readonly #injector = inject(Injector)
  readonly #templateRef = inject(TemplateRef)
  readonly #viewContainerRef = inject(ViewContainerRef)

  constructor() {
    const content = computed(() => this.#renderData()[0])
    const props = computed(() => this.#renderData()[1])

    const renderer = new FlexViewRenderer<TFeatures, TData, TValue, any>({
      content: content,
      props: props,
      injector: () => this.#injector,
      templateRef: this.#templateRef,
      viewContainerRef: this.#viewContainerRef,
    })

    renderer.mount()

    inject(DestroyRef).onDestroy(() => {
      renderer.destroy()
    })
  }
}
