import type { TableFeatures } from '../types/TableFeatures'

/**
 * A helper function to help define the features that are to be imported and applied to a table instance.
 * Use this utility to make it easier to have the correct type inference for the features that are being imported.
 * **Note:** It is recommended to use this utility statically outside of a component.
 *
 * You can also declare per-table `meta` types here with the `tableMeta` and
 * `columnMeta` type-only slots instead of using global declaration merging.
 * The values are phantom (ignored and stripped at runtime) — only their types
 * are used.
 * @example
 * ```
 * import { tableFeatures, columnVisibilityFeature, rowPinningFeature } from '@tanstack/react-table'
 * const features = tableFeatures({
 *   columnVisibilityFeature,
 *   rowPinningFeature,
 *   tableMeta: {} as { updateData: (rowIndex: number, columnId: string, value: unknown) => void },
 *   columnMeta: {} as { align?: 'left' | 'right' },
 * });
 * const table = useTable({ features, rowModels: {}, columns, data });
 * ```
 */
export function tableFeatures<TFeatures extends TableFeatures>(
  features: TFeatures,
): TFeatures {
  return features
}

// test

// const features = tableFeatures({
//   rowPinningFeature: {},
// });
