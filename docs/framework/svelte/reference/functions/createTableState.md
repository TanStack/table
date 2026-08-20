---
id: createTableState
title: createTableState
---

# Function: createTableState()

```ts
function createTableState<TState>(initialValue): [() => TState, (updater) => void];
```

Defined in: [packages/svelte-table/src/createTableState.svelte.ts:18](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableState.svelte.ts#L18)

Creates a small Svelte 5 state holder that accepts TanStack Table updaters.

This is useful when a table state slice should be owned outside the table
with `$state`, but still needs to accept both value and functional updater
forms from `on[State]Change` callbacks.

## Type Parameters

### TState

`TState`

## Parameters

### initialValue

`TState`

## Returns

\[() => `TState`, (`updater`) => `void`\]

## Example

```ts
const [pagination, setPagination] = createTableState({
  pageIndex: 0,
  pageSize: 10,
})
```
