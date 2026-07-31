// Declaration companion for createTableHook.tsrx.
//
// A SPECIFIC module declaration (resolved by relative path), not an ambient
// `declare module '*.tsrx'` — so it types only this module and doesn't pollute a
// consumer's own .tsrx imports. The runtime resolves the real compiled .tsrx.
import type { TableFeatures } from '@tanstack/table-core'
import type {
  CreateTableHookOptions,
  CreateTableHookResult,
  TableComponentType,
} from './types'

export declare function createTableHook<
  TFeatures extends TableFeatures,
  const TTableComponents extends Record<string, TableComponentType>,
  const TCellComponents extends Record<string, TableComponentType>,
  const THeaderComponents extends Record<string, TableComponentType>,
>(
  options: CreateTableHookOptions<
    TFeatures,
    TTableComponents,
    TCellComponents,
    THeaderComponents
  >,
): CreateTableHookResult<
  TFeatures,
  TTableComponents,
  TCellComponents,
  THeaderComponents
>
