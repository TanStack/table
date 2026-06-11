/**
 * A helper for declaring the `tableMeta`/`columnMeta` type-only slots in the
 * `features` option without a type assertion.
 *
 * Equivalent to `{} as TMeta`, but reads as type-only at the call site and
 * avoids `@typescript-eslint/no-unnecessary-type-assertion` false positives
 * when the meta type has only optional properties (where an auto-fix removing
 * the assertion would silently degrade the inferred meta type to `{}`).
 *
 * The returned value is a phantom — it is ignored and stripped from the
 * table's registered features at runtime; only its type is used.
 * @example
 * ```
 * import { metaHelper, tableFeatures, rowSortingFeature } from '@tanstack/react-table'
 * const features = tableFeatures({
 *   rowSortingFeature,
 *   tableMeta: metaHelper<MyTableMeta>(),
 *   columnMeta: metaHelper<MyColumnMeta>(),
 * });
 * ```
 */
export function metaHelper<TMeta extends object>(): TMeta {
  return {} as TMeta
}
