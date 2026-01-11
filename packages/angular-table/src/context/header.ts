import { Directive, InjectionToken, inject, input } from '@angular/core'
import { CellData, Header, RowData, TableFeatures } from '@tanstack/table-core'
import type { Signal } from '@angular/core'

export const HeaderContextToken = new InjectionToken<
  TanStackTableHeaderContext<any, any, any>['header']
>('[TanStack Table] HeaderContext')

export interface TanStackTableHeaderContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> {
  header: Signal<Header<TFeatures, TData, TValue>>
}

@Directive({
  selector: '[tanStackTableHeader]',
  exportAs: 'header',
  providers: [
    {
      provide: HeaderContextToken,
      useFactory: () => inject(TanStackTableHeader).header,
    },
  ],
})
export class TanStackTableHeader<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> implements TanStackTableHeaderContext<TFeatures, TData, TValue> {
  readonly header = input.required<Header<TFeatures, TData, TValue>>({
    alias: 'tanStackTableHeader',
  })
}

export function injectTableHeaderContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
>(): TanStackTableHeaderContext<TFeatures, TData, TValue>['header'] {
  return inject(HeaderContextToken)
}
