import { Directive, InjectionToken, inject, input } from '@angular/core'
import { RowData, Table, TableFeatures } from '@tanstack/table-core'
import type { Signal } from '@angular/core'

export const TableContextToken = new InjectionToken<
  TanStackTableContext<any, any>['table']
>('[TanStack Table] HeaderContext')

export interface TanStackTableContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  table: Signal<Table<TFeatures, TData>>
}

@Directive({
  selector: '[tanStackTable]',
  exportAs: 'table',
  providers: [
    {
      provide: TableContextToken,
      useFactory: () => inject(TanStackTable).table,
    },
  ],
})
export class TanStackTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
> implements TanStackTableContext<TFeatures, TData> {
  readonly table = input.required<Table<TFeatures, TData>>({
    alias: 'tanStackTable',
  })
}

export function injectTableContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TanStackTableContext<TFeatures, TData>['table'] {
  return inject(TableContextToken)
}
