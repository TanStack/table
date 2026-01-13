import { Directive, InjectionToken, inject, input } from '@angular/core'
import { RowData, TableFeatures, TableState } from '@tanstack/table-core'
import { AngularTable } from '../injectTable'
import type { Signal } from '@angular/core'

export const TanStackTableToken = new InjectionToken<
  Signal<AngularTable<any, any>>
>('[TanStack Table] Table Context')

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
  readonly table = input.required<AngularTable<TFeatures, TData, TSelected>>({
    alias: 'tanStackTable',
  })
}

export function injectTableContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected extends {} = TableState<TFeatures>,
>(): Signal<AngularTable<TFeatures, TData, TSelected>> {
  return inject(TanStackTableToken)
}
