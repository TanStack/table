import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { TableOptions } from '../types/TableOptions'

/**
 * Preserves table option inference when reusable options omit `columns`.
 *
 * This is useful for composing shared options that will receive columns later
 * from a framework adapter or table factory.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, 'columns'> & {
    _features: TFeatures
  },
): Omit<TableOptions<TFeatures, TData>, 'columns' | '_features'> & {
  _features: TFeatures
}

/**
 * Preserves table option inference when reusable options omit `data`.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, 'data'> & {
    _features: TFeatures
  },
): Omit<TableOptions<TFeatures, TData>, 'data' | '_features'> & {
  _features: TFeatures
}

/**
 * Preserves table option inference when reusable options omit both `data` and
 * `columns`.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, 'data' | 'columns'> & {
    _features: TFeatures
  },
): Omit<TableOptions<TFeatures, TData>, 'data' | 'columns' | '_features'> & {
  _features: TFeatures
}

/**
 * Preserves inference for a fully specified table options object.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(options: TableOptions<TFeatures, TData>): TableOptions<TFeatures, TData>

/**
 * Preserves inference when a wrapper supplies `_features`.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, '_features'>,
): Omit<TableOptions<TFeatures, TData>, '_features'>

/**
 * Preserves inference when a wrapper supplies both `data` and `_features`.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, 'data' | '_features'>,
): Omit<TableOptions<TFeatures, TData>, 'data' | '_features'>

/**
 * Preserves inference when a wrapper supplies both `columns` and `_features`.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, 'columns' | '_features'>,
): Omit<TableOptions<TFeatures, TData>, 'columns' | '_features'>

/**
 * Preserves inference when a wrapper supplies `data`, `columns`, and
 * `_features`.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<
    TableOptions<TFeatures, TData>,
    'data' | 'columns' | '_features'
  >,
): Omit<TableOptions<TFeatures, TData>, 'data' | 'columns' | '_features'>

/**
 * Runtime implementation for `tableOptions`.
 *
 * The helper returns the same object it receives; all value comes from the
 * overloads preserving table option inference at compile time.
 */
export function tableOptions(options: unknown) {
  return options
}

// test

// const options = tableOptions({
//   _features: {},
// })
