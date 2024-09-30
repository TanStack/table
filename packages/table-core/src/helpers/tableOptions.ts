import type { Fns } from '../types/Fns'
import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { TableOptions } from '../types/TableOptions'

export function tableOptions<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TFns, TData>, 'columns'> & {
    _features: TFeatures
  },
): Omit<TableOptions<TFeatures, TFns, TData>, 'columns' | '_features'> & {
  _features: TFeatures
}

export function tableOptions<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TFns, TData>, 'data'> & {
    _features: TFeatures
  },
): Omit<TableOptions<TFeatures, TFns, TData>, 'data' | '_features'> & {
  _features: TFeatures
}

export function tableOptions<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TFns, TData>, '_features'>,
): Omit<TableOptions<TFeatures, TFns, TData>, '_features'>

export function tableOptions<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TFns, TData>, 'data' | 'columns'> & {
    _features: TFeatures
  },
): Omit<
  TableOptions<TFeatures, TFns, TData>,
  'data' | 'columns' | '_features'
> & {
  _features: TFeatures
}

export function tableOptions<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TFns, TData>, 'data' | '_features'>,
): Omit<TableOptions<TFeatures, TFns, TData>, 'data' | '_features'>

export function tableOptions<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TFns, TData>, 'columns' | '_features'>,
): Omit<TableOptions<TFeatures, TFns, TData>, 'columns' | '_features'>

export function tableOptions<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData = any,
>(
  options: Omit<
    TableOptions<TFeatures, TFns, TData>,
    'data' | 'columns' | '_features'
  >,
): Omit<TableOptions<TFeatures, TFns, TData>, 'data' | 'columns' | '_features'>

export function tableOptions<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData = any,
>(
  options: TableOptions<TFeatures, TFns, TData>,
): TableOptions<TFeatures, TFns, TData>

export function tableOptions(options: unknown) {
  return options
}

// test

// const options = tableOptions({
//   _features: {},
// })
