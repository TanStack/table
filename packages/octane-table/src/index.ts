// @tanstack/octane-table — TanStack Table v9 for the Octane renderer.
//
// TanStack Table v9 separates a framework-agnostic core (`@tanstack/table-core`:
// `constructTable`, tree-shakeable features, and TanStack Store atoms behind
// every state slice) from a thin framework adapter. This package re-exports the
// core verbatim and ports the adapter — `useTable`, `Subscribe`, `FlexRender`,
// `createTableHook`, `createTableHookContexts` — onto octane.
//
// Upstream's `useLegacyTable` v8-compat layer is deliberately NOT ported: it
// exists to migrate existing React v8 codebases, which an octane binding has
// none of. Octane code targets the v9 `useTable` API directly.
export * from '@tanstack/table-core'

export * from './FlexRender'
export * from './Subscribe.tsrx'
export * from './createTableHook.tsrx'
export * from './createTableHookContexts'
export * from './types'
export * from './useTable.tsrx'
