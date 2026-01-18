import {
  DestroyRef,
  Directive,
  Injector,
  InputSignal,
  TemplateRef,
  ViewContainerRef,
  inject,
  input,
} from '@angular/core'
import {
  FlexRenderInputContent,
  FlexViewRenderer,
} from './flex-render/renderer'
import type {
  CellContext,
  CellData,
  HeaderContext,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'

export {
  injectFlexRenderContext,
  type FlexRenderComponentProps,
} from './flex-render/context'

export type {
  FlexRenderInputContent,
  FlexRenderContent,
} from './flex-render/renderer'

/**
 * Use this utility directive to render headers, cells, or footers with custom markup.
 *
 * Note: If you are rendering cell, header, or footer without custom context or other props,
 * you can use the {@link FlexRenderCell} directive as shorthand instead .
 *
 * @example
 * ```ts
 * import {FlexRender} from '@tanstack/angular-table';
 *
 * @Component({
 *   imports: [FlexRender],
 *   template: `
 *      <td
 *        *flexRender="
 *          cell.column.columnDef.cell;
 *          props: cell.getContext();
 *          let cell"
 *      >
 *        {{cell}}
 *      </td>
 *
 *      <th
 *        *flexRender="
 *          header.column.columnDef.header;
 *          props: header.getContext();
 *          let header"
 *        >
 *        {{header}}
 *      </td>
 *
 *      <td
 *        *flexRender="
 *          footer.column.columnDef.footer;
 *          props: footer.getContext();
 *          let footer"
 *      >
 *        {{footer}}
 *      </td>
 *   `,
 * })
 * class App {
 * }
 * ```
 *
 * Can be imported through {@link FlexRenderDirective} or {@link FlexRender} import,
 * which the latter is preferred.
 */
@Directive({
  selector: 'ng-template[flexRender]',
  standalone: true,
})
export class FlexRenderDirective<
  TFeatures extends TableFeatures,
  TRowData extends RowData,
  TValue extends CellData,
  TProps extends
    | NonNullable<unknown>
    | CellContext<TFeatures, TRowData, TValue>
    | HeaderContext<TFeatures, TRowData, TValue>,
> {
  readonly content: InputSignal<FlexRenderInputContent<TProps>> = input(
    undefined as FlexRenderInputContent<TProps>,
    { alias: 'flexRender' },
  )

  readonly props = input<TProps>({} as TProps, {
    alias: 'flexRenderProps',
  })

  readonly injector = input(inject(Injector), {
    alias: 'flexRenderInjector',
  })

  readonly #viewContainerRef = inject(ViewContainerRef)
  readonly #templateRef = inject(TemplateRef)

  constructor() {
    const renderer = new FlexViewRenderer({
      content: this.content,
      props: this.props,
      injector: this.injector,
      templateRef: this.#templateRef,
      viewContainerRef: this.#viewContainerRef,
    })

    renderer.mount()

    inject(DestroyRef).onDestroy(() => {
      renderer.destroy()
    })
  }
}
