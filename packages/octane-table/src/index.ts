// @tanstack/octane-table — TanStack Table v9 for the Octane renderer.
//
// TanStack Table v9 separates a framework-agnostic core (`@tanstack/table-core`:
// `constructTable`, tree-shakeable features, and TanStack Store atoms behind
// every state slice) from a thin framework adapter. This package re-exports the
// core verbatim and ports the adapter — `useTable`, `Subscribe`, `FlexRender`,
// `createTableHook`, `createTableHookContexts` — onto octane.
//
export * from '@tanstack/table-core'

export * from './FlexRender'
export * from './Subscribe.tsrx'
export * from './createTableHook.tsrx'
export * from './createTableHookContexts'
export * from './types'
export * from './useTable.tsrx'
