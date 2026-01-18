import { Directive, InjectionToken, inject, input } from '@angular/core'
import { RowData, TableFeatures, TableState } from '@tanstack/table-core'
import { AngularTable } from '../injectTable'
import type { Signal } from '@angular/core'

/**
 * Injection token that provides access to the current {@link AngularTable} instance.
 *
 * This token is provided by the {@link TanStackTable} directive.
 */
export const TanStackTableToken = new InjectionToken<
  Signal<AngularTable<any, any>>
>('[TanStack Table] Table Context')

/**
 * Provides a TanStack Table instance (`AngularTable`) in Angular DI.
 *
 * The table can be injected by:
 * - any descendant of an element using `[tanStackTable]="..."`
 * - any component instantiated by `*flexRender` when the render props contains `table`
 *
 * @example
 * ```html
 * <div [tanStackTable]="table">
 *   <app-pagination />
 * </div>
 * ```
 *
 * ```ts
 * @Component({
 *   selector: 'app-pagination',
 *   template: `
 *     <button (click)="prev()" [disabled]="!table().getCanPreviousPage()">Prev</button>
 *     <button (click)="next()" [disabled]="!table().getCanNextPage()">Next</button>
 *   `,
 * })
 * export class PaginationComponent {
 *   readonly table = injectTableContext()
 *
 *   prev() {
 *     this.table().previousPage()
 *   }
 *   next() {
 *     this.table().nextPage()
 *   }
 * }
 * ```
 */
@Directive({
  selector: '[tanStackTable]',
  exportAs: 'table',
  providers: [
    {
      provide: TanStackTableToken,
      useFactory: () => inject(TanStackTable).table,
    },
  ],
})
export class TanStackTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected extends {} = TableState<TFeatures>,
> {
  /**
   * The current TanStack Table instance.
   *
   * Provided as a required signal input so DI consumers always read the latest value.
   */
  readonly table = input.required<AngularTable<TFeatures, TData, TSelected>>({
    alias: 'tanStackTable',
  })
}

/**
 * Injects the current TanStack Table instance signal.
 *
 * Available when:
 * - there is a nearest `[tanStackTable]` directive in the DI tree, or
 * - the caller is rendered via `*flexRender` with render props containing `table`
 */
export function injectTableContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected extends {} = TableState<TFeatures>,
>(): Signal<AngularTable<TFeatures, TData, TSelected>> {
  return inject(TanStackTableToken)
}
