import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { TableOptions } from '../types/TableOptions'

export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, Array<TData>>, 'columns'> & {
    _features: TFeatures
  },
): Omit<TableOptions<TFeatures, Array<TData>>, 'columns' | '_features'> & {
  _features: TFeatures
}

export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, Array<TData>>, 'data'> & {
    _features: TFeatures
  },
): Omit<TableOptions<TFeatures, Array<TData>>, 'data' | '_features'> & {
  _features: TFeatures
}

export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, Array<TData>>, '_features'>,
): Omit<TableOptions<TFeatures, Array<TData>>, '_features'>

export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, Array<TData>>, 'data' | 'columns'> & {
    _features: TFeatures
  },
): Omit<
  TableOptions<TFeatures, Array<TData>>,
  'data' | 'columns' | '_features'
> & {
  _features: TFeatures
}

export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, Array<TData>>, 'data' | '_features'>,
): Omit<TableOptions<TFeatures, Array<TData>>, 'data' | '_features'>

export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, Array<TData>>, 'columns' | '_features'>,
): Omit<TableOptions<TFeatures, Array<TData>>, 'columns' | '_features'>

export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<
    TableOptions<TFeatures, Array<TData>>,
    'data' | 'columns' | '_features'
  >,
): Omit<TableOptions<TFeatures, Array<TData>>, 'data' | 'columns' | '_features'>

export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: TableOptions<TFeatures, Array<TData>>,
): TableOptions<TFeatures, Array<TData>>

export function tableOptions(options: unknown) {
  return options
}

// test

// const options = tableOptions({
//   _features: {},
// })
