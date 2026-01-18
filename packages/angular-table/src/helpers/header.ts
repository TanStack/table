import { Directive, InjectionToken, inject, input } from '@angular/core'
import { CellData, Header, RowData, TableFeatures } from '@tanstack/table-core'
import type { Signal } from '@angular/core'

/**
 * DI context shape for a TanStack Table header.
 *
 * This exists to make the current `Header` injectable by any nested component/directive
 * without passing it through inputs/props.
 */
export interface TanStackTableHeaderContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> {
  /** Signal that returns the current header instance. */
  header: Signal<Header<TFeatures, TData, TValue>>
}

/**
 * Injection token that provides access to the current header.
 *
 * This token is provided by the {@link TanStackTableHeader} directive.
 */
export const TanStackTableHeaderToken = new InjectionToken<
  TanStackTableHeaderContext<any, any, any>['header']
>('[TanStack Table] HeaderContext')

/**
 * Provides a TanStack Table `Header` instance in Angular DI.
 *
 * The header can be injected by:
 * - any descendant of an element using `[tanStackTableHeader]="..."`
 * - any component instantiated by `*flexRender` when the render props contains `header`
 *
 * @example
 * ```html
 * <th [tanStackTableHeader]="header">
 *   <app-sort-indicator />
 * </th>
 * ```
 *
 * ```ts
 * @Component({
 *   selector: 'app-sort-indicator',
 *   template: `
 *     <button (click)="toggle()">
 *       {{ header().column.id }}
 *     </button>
 *   `,
 * })
 * export class SortIndicatorComponent {
 *   readonly header = injectTableHeaderContext()
 *
 *   toggle() {
 *     this.header().column.toggleSorting()
 *   }
 * }
 * ```
 */
@Directive({
  selector: '[tanStackTableHeader]',
  exportAs: 'header',
  providers: [
    {
      provide: TanStackTableHeaderToken,
      useFactory: () => inject(TanStackTableHeader).header,
    },
  ],
})
export class TanStackTableHeader<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> implements TanStackTableHeaderContext<TFeatures, TData, TValue> {
  /**
   * The current TanStack Table header.
   *
   * Provided as a required signal input so DI consumers always read the latest value.
   */
  readonly header = input.required<Header<TFeatures, TData, TValue>>({
    alias: 'tanStackTableHeader',
  })
}

/**
 * Injects the current TanStack Table header signal.
 *
 * Available when:
 * - there is a nearest `[tanStackTableHeader]` directive in the DI tree, or
 * - the caller is rendered via `*flexRender` with render props containing `header`
 */
export function injectTableHeaderContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
>(): TanStackTableHeaderContext<TFeatures, TData, TValue>['header'] {
  return inject(TanStackTableHeaderToken)
}
