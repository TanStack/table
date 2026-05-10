import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { TableOptions } from '../types/TableOptions'

/**
 * Returns table options while preserving generic inference.
 *
 * This helper is useful when composing reusable table options outside of a framework adapter call.
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
 * Returns table options while preserving generic inference when `data` is supplied later.
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
 * Returns table options while preserving generic inference when both `data` and `columns` are supplied later.
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
 * Returns a fully specified table options object without changing its runtime value.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(options: TableOptions<TFeatures, TData>): TableOptions<TFeatures, TData>

/**
 * Returns table options while preserving generic inference when `_features` is supplied by a wrapper.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, '_features'>,
): Omit<TableOptions<TFeatures, TData>, '_features'>

/**
 * Returns table options while preserving generic inference when `data` and `_features` are supplied by a wrapper.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, 'data' | '_features'>,
): Omit<TableOptions<TFeatures, TData>, 'data' | '_features'>

/**
 * Returns table options while preserving generic inference when `columns` and `_features` are supplied by a wrapper.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, 'columns' | '_features'>,
): Omit<TableOptions<TFeatures, TData>, 'columns' | '_features'>

/**
 * Returns table options while preserving generic inference when `data`, `columns`, and `_features` are supplied by a wrapper.
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
