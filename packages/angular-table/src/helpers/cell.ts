import { Directive, InjectionToken, inject, input } from '@angular/core'
import { Cell, CellData, RowData, TableFeatures } from '@tanstack/table-core'
import type { Signal } from '@angular/core'

/**
 * DI context shape for a TanStack Table cell.
 *
 * This exists to make the current `Cell` injectable by any nested component/directive
 * without having to pass it through inputs/props manually.
 */
export interface TanStackTableCellContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> {
  /** Signal that returns the current cell instance. */
  cell: Signal<Cell<TFeatures, TData, TValue>>
}

/**
 * Injection token that provides access to the current cell.
 *
 * This token is provided by the {@link TanStackTableCell} directive.
 */
export const TanStackTableCellToken = new InjectionToken<
  TanStackTableCellContext<any, any, any>['cell']
>('[TanStack Table] CellContext')

/**
 * Provides a TanStack Table `Cell` instance in Angular DI.
 *
 * The cell can be injected by:
 * - any descendant of an element using `[tanStackTableCell]="..."`
 * - any component instantiated by `*flexRender` when the render props contains `cell`
 *
 * @example
 * Inject from the nearest `[tanStackTableCell]`:
 * ```html
 * <td [tanStackTableCell]="cell">
 *   <app-cell-actions />
 * </td>
 * ```
 *
 * ```ts
 * @Component({
 *   selector: 'app-cell-actions',
 *   template: `{{ cell().id }}`,
 * })
 * export class CellActionsComponent {
 *   readonly cell = injectTableCellContext()
 * }
 * ```
 *
 * @example
 * Inject inside a component rendered via `flexRender`:
 * ```ts
 * @Component({
 *   selector: 'app-price-cell',
 *   template: `{{ cell().getValue() }}`,
 * })
 * export class PriceCellComponent {
 *   readonly cell = injectTableCellContext()
 * }
 * ```
 */
@Directive({
  selector: '[tanStackTableCell]',
  exportAs: 'cell',
  providers: [
    {
      provide: TanStackTableCellToken,
      useFactory: () => inject(TanStackTableCell).cell,
    },
  ],
})
export class TanStackTableCell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> implements TanStackTableCellContext<TFeatures, TData, TValue> {
  /**
   * The current TanStack Table cell.
   *
   * Provided as a required signal input so DI consumers always read the latest value.
   */
  readonly cell = input.required<Cell<TFeatures, TData, TValue>>({
    alias: 'tanStackTableCell',
  })
}

/**
 * Injects the current TanStack Table cell signal.
 *
 * Available when:
 * - there is a nearest `[tanStackTableCell]` directive in the DI tree, or
 * - the caller is rendered via `*flexRender` with render props containing `cell`
 */
export function injectTableCellContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
>(): TanStackTableCellContext<TFeatures, TData, TValue>['cell'] {
  return inject(TanStackTableCellToken)
}
