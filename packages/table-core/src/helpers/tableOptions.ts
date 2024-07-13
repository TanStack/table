import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { TableOptions } from '../types/TableOptions'

export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, 'columns'>,
): Omit<TableOptions<TFeatures, TData>, 'columns'>

export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, 'data'>,
): Omit<TableOptions<TFeatures, TData>, 'data'>

export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, '_features'>,
): Omit<TableOptions<TFeatures, TData>, '_features'>

export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, 'data' | 'columns'>,
): Omit<TableOptions<TFeatures, TData>, 'data' | 'columns'>

export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, 'data' | '_features'>,
): Omit<TableOptions<TFeatures, TData>, 'data' | '_features'>

export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, 'columns' | '_features'>,
): Omit<TableOptions<TFeatures, TData>, 'columns' | '_features'>

export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<
    TableOptions<TFeatures, TData>,
    'data' | 'columns' | '_features'
  >,
): Omit<TableOptions<TFeatures, TData>, 'data' | 'columns' | '_features'>

export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(options: TableOptions<TFeatures, TData>): TableOptions<TFeatures, TData>

export function tableOptions(options: unknown) {
  return options
}

//test

// const options = tableOptions({
//   _features: {},
// })
