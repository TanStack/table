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
    features: TFeatures
  },
): Omit<TableOptions<TFeatures, TData>, 'columns' | 'features'> & {
  features: TFeatures
}

/**
 * Preserves table option inference when reusable options omit `data`.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, 'data'> & {
    features: TFeatures
  },
): Omit<TableOptions<TFeatures, TData>, 'data' | 'features'> & {
  features: TFeatures
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
    features: TFeatures
  },
): Omit<TableOptions<TFeatures, TData>, 'data' | 'columns' | 'features'> & {
  features: TFeatures
}

/**
 * Preserves inference for a fully specified table options object.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(options: TableOptions<TFeatures, TData>): TableOptions<TFeatures, TData>

/**
 * Preserves inference when a wrapper supplies `features`.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, 'features'>,
): Omit<TableOptions<TFeatures, TData>, 'features'>

/**
 * Preserves inference when a wrapper supplies both `data` and `features`.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, 'data' | 'features'>,
): Omit<TableOptions<TFeatures, TData>, 'data' | 'features'>

/**
 * Preserves inference when a wrapper supplies both `columns` and `features`.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<TableOptions<TFeatures, TData>, 'columns' | 'features'>,
): Omit<TableOptions<TFeatures, TData>, 'columns' | 'features'>

/**
 * Preserves inference when a wrapper supplies `data`, `columns`, and
 * `features`.
 */
export function tableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  options: Omit<
    TableOptions<TFeatures, TData>,
    'data' | 'columns' | 'features'
  >,
): Omit<TableOptions<TFeatures, TData>, 'data' | 'columns' | 'features'>

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
//   features: {},
// })
